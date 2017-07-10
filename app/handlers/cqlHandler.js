const Artifact = require('../models/artifact');
const ValueSets = require('../data/valueSets');
const _ = require('lodash');
const slug = require('slug');
const ejs = require('ejs');
const fs = require('fs');
let archiver = require('archiver');
const path = require( 'path' );
const templatePath = 'app/data/cql/templates'
const artifactPath = 'app/data/cql/artifact.ejs'
const templateMap = loadTemplates();
// Each library will be included. Aliases are optional.
const includeLibraries = [{name: 'FHIRHelpers', version: '1.0.2', alias: 'FHIRHelpers'},
                          {name: 'CDS_Connect_Commons_for_FHIRv102', version: '1', alias: 'C3F'},
                          {name: 'CDS_Connect_Conversions', version: '1', alias: 'Convert'}];

module.exports = {
   objToCql : objToCql,
   idToObj : idToObj
}

// Creates the cql file from an artifact ID
function idToObj(req, res, next) {
  Artifact.findOne({ _id : req.params.artifact },
    (error, artifact) => {
      if (error) console.log(error);
      else { 
        req.body = artifact;
        next();
      }
    });
}

// Creates the cql file from an artifact object
function objToCql(req, res) {
  let artifact = new CqlArtifact(req.body);
  let cqlObject = artifact.toJson();

  let archive = archiver('zip', {zlib : { level : 9 }});
  archive.on('error', (err) => {
    res.status(500).send({error : err.message});
  });
  res.attachment('archive-name.zip');
  archive.pipe(res);

  // Add helper Library
  let path = __dirname + '/../data/library_helpers/';
  archive.directory(path, '/');

  archive.append(cqlObject.text, { name : `${cqlObject.filename}.cql` });
  archive.finalize();
}

function loadTemplates() {
  let templateMap = {};
  // Loop through all the files in the temp directory
  fs.readdir( templatePath, function( err, files ) {
    if( err ) { console.error( "Could not list the directory.", err ); } 

    files.forEach( function( file, index ) {
      templateMap[file] = fs.readFileSync(path.join( templatePath, file ), 'utf-8');
    });
  });
  return templateMap;
}

// This creates the context EJS uses to create a union of queries using different valuesets
function createGroupedContext(id, valuesets, type) {
  let groupedContext = {
    template: 'MultipleValuesetsExpression',
    name: `${id}_valuesets`,
    valuesets: valuesets,
    type: type
  };
  return groupedContext;
}

// Class to handle all cql generation
class CqlArtifact {
  constructor(artifact) {
    this.name = slug(artifact.name ? artifact.name : 'untitled');
    this.version = artifact.version ? artifact.version : 1;
    this.dataModel = artifact.dataModel ? artifact.dataModel : {name: 'FHIR', version: '1.0.2'};
    this.includeLibraries = artifact.includeLibraries ? artifact.includeLibraries : includeLibraries;
    this.context = artifact.context ? artifact.context : 'Patient';
    this.inclusions = artifact.expTreeInclude;
    this.exclusions = artifact.expTreeExclude;
    this.initialize()
  }

  initialize() {
    this.resourceMap = new Map();
    this.codeSystemMap = new Map();
    this.codeMap = new Map();
    this.conceptMap = new Map();
    this.paramContexts = [];
    this.contexts = [];
    this.conjunctions = [];
    this.conjunction_main = [];

    if (this.inclusions.childInstances.length)
      this.parseTree(this.inclusions);
    if (this.exclusions.childInstances.length)
      this.parseTree(this.exclusions);
  }

  parseTree(element) {
    this.parseConjunction(element);
    const children = element.childInstances;
    children.forEach((child) => {
      if ("childInstances" in child) {
        this.parseTree(child)
      } else {
        if (child.type == 'parameter') {
          this.parseParameter(child);
        } else {
          this.parseElement(child);
        }
      }
    });
  }

  parseConjunction(element) {
    const conjunction = {template : element.id, components : []};
    const name = element.parameters[0].value;
    conjunction.element_name = (name || element.uniqueId);
    element.childInstances.forEach((child) => {
      conjunction.components.push({name : child.parameters[0].value})
    });
    this.conjunction_main.push(conjunction);
  }

  parseParameter(element) {
    const paramContext = {};
    element.parameters.forEach((parameter) => {
          paramContext[parameter.id] = parameter.value;
    });
    this.paramContexts.push(paramContext);
  }

  // Generate context and resources for a single element
  parseElement(element) {

    const context = {template: element.id};
    // TODO: currently this assumes that if A extends B then the B element defines the CQL
    if (element.extends && !templateMap[element.id]) {
      context.template = element.extends;
    }

    element.parameters.forEach((parameter) => {
      switch (parameter.type) {
        case 'observation':
          let observationValueSets = ValueSets.observations[parameter.value];
          context[parameter.id] = observationValueSets;
          // For observations that have codes associated with them instead of valuesets
          if ("concepts" in observationValueSets) {
            observationValueSets.concepts.forEach((concept) => {
              concept.codes.forEach((code) => {
                this.codeSystemMap.set(code.codeSystem.name, code.codeSystem.id);
                this.codeMap.set(code.name, code);
              });
              this.conceptMap.set(concept.name, concept);
            });
            // For checking if a ConceptValue is in a valueset, incluce the valueset that will be used
            if('checkInclusionInVS' in observationValueSets){
              this.resourceMap.set(observationValueSets.checkInclusionInVS.name, observationValueSets.checkInclusionInVS);
            }
          } else {
            observationValueSets.observations.map(observation => {
              this.resourceMap.set(observation.name, observation);
            });
            // For observations that use more than one valueset, create a separate define statement that 
            // groups the queries for each valueset into one expression that is then referenced
            if(observationValueSets.observations.length > 1) {
              if(!this.contexts.find(context => context.name === `${observationValueSets.id}_valuesets`)) {
                let groupedContext = createGroupedContext(observationValueSets.id, observationValueSets.observations, 'Observation');
                this.contexts.push(groupedContext);
              }
            }
          }
          break;
        case 'number':
          context[parameter.id] = parameter.value;
          if ('exclusive' in parameter) {
            context[`${parameter.id}_exclusive`] = parameter.exclusive; 
          }
          break;
        case 'condition':
          let conditionValueSets = ValueSets.conditions[parameter.value];
          conditionValueSets.conditions.map(condition => {
            this.resourceMap.set(condition.name, condition);
          })
          context.conditions = conditionValueSets.conditions;
          context.active = !(parameter.inactive);
          break;
        case 'medication':
          let medicationValueSets = ValueSets.medications[parameter.value];
          medicationValueSets.medications.map(medication => {
            this.resourceMap.set(medication.name, medication);
          })
          context.medication_titles = medicationValueSets.medications;
          break;
        case 'procedure' :
          let procedureValueSets = ValueSets.procedures[parameter.value];
          context[parameter.id] = procedureValueSets;
          procedureValueSets.procedures.forEach(valueset => this.resourceMap.set(valueset.name, valueset));
          break;
        case 'pregnancy':
          let pregnancyValueSets = ValueSets.conditions[parameter.value];
          pregnancyValueSets.conditions.map(condition => {
            this.resourceMap.set(condition.name, condition);
          })
          if ("concepts" in pregnancyValueSets) {
            pregnancyValueSets.concepts.forEach((concept) => {
              concept.codes.forEach((code) => {
                this.codeSystemMap.set(code.codeSystem.name, code.codeSystem.id);
                this.codeMap.set(code.name, code);
              });
              this.conceptMap.set(concept.name, concept);
            });
          }
          context[parameter.id] = parameter.value;
          // Get values for Pregnancy, due to the specific template
          context.valueSetName = pregnancyValueSets.conditions[0].name;
          context.pregnancyStatusConcept = pregnancyValueSets.concepts[0].name;
          context.pregnancyCodeConcept = pregnancyValueSets.concepts[1].name;
          break;
        case 'list':
          if (parameter.category === "comparison") {
            context.comparisonUnit = (ValueSets.observations[_.find(_.find(this.inclusions, { 'id': parameter.value[0].id }).parameters, {'name': parameter.name}).value].units.code);
          }
          context[parameter.id] = parameter.value;
          break;
        case 'comparison':
          context.doubleSided = (parameter.id === "comparison_2");
          context[parameter.id] = parameter.value;
          break;
        default:
          context[parameter.id] = parameter.value;
          break;
      }
    });

    context.element_name = (context.element_name || element.uniqueId);
    this.contexts.push(context)
  }

  // Generate cql for all elements
  body() {
    let expressions = this.contexts.concat(this.conjunctions);
    expressions = expressions.concat(this.conjunction_main);
    return expressions.map((context) => {
      if (!templateMap[context.template]) console.error("Template could not be found: " + context.template);
      return ejs.render(templateMap[context.template], context)
    }).join("\n");
  }
  header() {
    return ejs.render(fs.readFileSync(artifactPath, 'utf-8'), this);
  }
  population() {
    let exists = {
      include : this.inclusions.childInstances.length ? true : false,
      exclude : this.exclusions.childInstances.length ? true : false,
    }
    return ejs.render(fs.readFileSync(templatePath + '/IncludeExclude', 'utf-8'), exists)
  }

  // Produces the cql in string format
  toString() {
    return this.header()+this.body()+'\n'+this.population();
  }

  // Return a cql file as a json object
  toJson() {
    return { 
      filename : this.name,
      text : this.toString(),
      type : 'text/plain'
    }
  }
}