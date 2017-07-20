const Artifact = require('../models/artifact');
const ValueSets = require('../data/valueSets');
const _ = require('lodash');
const slug = require('slug');
const ejs = require('ejs');
const fs = require('fs');
let archiver = require('archiver');
const path = require( 'path' );
const templatePath = 'app/data/cql/templates'
const specificPath = 'app/data/cql/specificTemplates'
const modifierPath = 'app/data/cql/modifiers'
const artifactPath = 'app/data/cql/artifact.ejs'
const specificMap = loadTemplates(specificPath);
const templateMap = loadTemplates(templatePath);
const modifierMap = loadTemplates(modifierPath);
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

function loadTemplates(pathToTemplates) {
  let templateMap = {};
  // Loop through all the files in the temp directory
  fs.readdir( pathToTemplates, function( err, files ) {
    if( err ) { console.error( "Could not list the directory.", err ); } 

    files.forEach( function( file, index ) {
      templateMap[file] = fs.readFileSync(path.join( pathToTemplates, file ), 'utf-8');
    });
  });
  return templateMap;
}

// This creates the context EJS uses to create a union of queries using different valuesets
function createMultipleValueSetExpression(id, valuesets, type) {
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
    this.subpopulations = artifact.subpopulations;
    this.recommendations = artifact.recommendations;
    this.initialize()
  }

  initialize() {
    this.resourceMap = new Map();
    this.codeSystemMap = new Map();
    this.codeMap = new Map();
    this.conceptMap = new Map();
    this.paramContexts = [];
    this.referencedElements = [];
    this.contexts = [];
    this.conjunctions = [];
    this.conjunction_main = [];

    if (this.inclusions.childInstances.length)
      this.parseTree(this.inclusions);
    if (this.exclusions.childInstances.length)
      this.parseTree(this.exclusions);
    this.subpopulations.forEach(subpopulation => {
      if (subpopulation.childInstances.length)
        this.parseTree(subpopulation);
      }
    )
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
    conjunction.element_name = (name || element.subpopulationName || element.uniqueId);
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
    const context = {};
    if (element.extends) {
      context.template = (element.template) ? element.template : element.extends;
    } else {
      context.template = (element.template || element.id);
    }
    element.modifiers = element.modifiers || [];
    context.withoutModifiers = _.has(specificMap, context.template);
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
            if('checkInclusionInVS' in observationValueSets) {
              if(!_.isEmpty(element.modifiers) && _.last(element.modifiers).id === "InStatement") {
                _.last(element.modifiers).values = observationValueSets.checkInclusionInVS.name;
              }
              this.resourceMap.set(observationValueSets.checkInclusionInVS.name, observationValueSets.checkInclusionInVS);
            }
            context.values = [ observationValueSets.name ];
          } else {
            context.values = observationValueSets.observations.map(observation => {
              this.resourceMap.set(observation.name, observation);
              return observation.name;
            });
            // For observations that use more than one valueset, create a separate define statement that
            // groups the queries for each valueset into one expression that is then referenced
            if(observationValueSets.observations.length > 1) {
              if(!this.referencedElements.find(concept => concept.name === `${observationValueSets.id}_valuesets`)) {
                let multipleValueSetExpression = createMultipleValueSetExpression(observationValueSets.id, observationValueSets.observations, 'Observation');
                this.referencedElements.push(multipleValueSetExpression);
              }
              context.values = [`"${observationValueSets.id}_valuesets"`];
              context.template = 'GenericStatement'; // Potentially move this to the object itself in form_templates
            }
          }
          element.modifiers.forEach(modifier => {
            if (_.has(modifier.values, 'comparisonUnit')) {
              modifier.values.unit = observationValueSets.units.code;
            }
          })
          break;
        case 'number':
          context[parameter.id] = parameter.value;
          if ('exclusive' in parameter) {
            context[`${parameter.id}_exclusive`] = parameter.exclusive;
          }
          break;
        case 'condition':
          let conditionValueSets = ValueSets.conditions[parameter.value];
          context.values = conditionValueSets.conditions.map(condition => {
            this.resourceMap.set(condition.name, condition);
            return condition.name;
          })
          break;
        case 'medication':
          let medicationValueSets = ValueSets.medications[parameter.value];
          context.values = medicationValueSets.medications.map(medication => {
            this.resourceMap.set(medication.name, medication);
            return `C3F.Active${medication.type}([${medication.type}: "${medication.name}"])`
          })
          break;
        case 'procedure':
          let procedureValueSets = ValueSets.procedures[parameter.value];
          context[parameter.id] = procedureValueSets;
          context.values = procedureValueSets.procedures.map(procedure => {
            this.resourceMap.set(procedure.name, procedure)
            return procedure.name;
          });
          break;
        case 'encounter':
          let encounterValueSets = ValueSets.encounters[parameter.value];
          context.values = encounterValueSets.encounters.map(encounter => {
            this.resourceMap.set(encounter.name, encounter);
            return encounter.name;
          });
          context[parameter.id] = encounterValueSets;
          break;
        case 'allergyIntolerance' :
          let allergyIntoleranceValueSets = ValueSets.allergyIntolerances[parameter.value];
          context.values = allergyIntoleranceValueSets.allergyIntolerances.map(allergyIntolerance => {
            this.resourceMap.set(allergyIntolerance.name, allergyIntolerance);
            return allergyIntolerance.name;
          });
          context[parameter.id] = allergyIntoleranceValueSets;
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
          context.valueSetName = pregnancyValueSets.conditions[0].name;
          context.pregnancyStatusConcept = pregnancyValueSets.concepts[0].name;
          context.pregnancyCodeConcept = pregnancyValueSets.concepts[1].name;
          break;
          case 'breastfeeding':
            let breastfeedingValueSets = ValueSets.conditions[parameter.value];
            breastfeedingValueSets.conditions.map(condition => {
              this.resourceMap.set(condition.name, condition);
            })
            if ("concepts" in breastfeedingValueSets) {
              breastfeedingValueSets.concepts.forEach((concept) => {
                concept.codes.forEach((code) => {
                  this.codeSystemMap.set(code.codeSystem.name, code.codeSystem.id);
                  this.codeMap.set(code.name, code);
                });
                this.conceptMap.set(concept.name, concept);
              });
            }
            context.valueSetName = breastfeedingValueSets.conditions[0].name;
            context.breastfeedingCodeConcept = breastfeedingValueSets.concepts[0].name;
            context.breastfeedingYesConcept = breastfeedingValueSets.concepts[1].name;
            break;
        case 'list':
          if (parameter.category === "comparison") {
            context.comparisonUnit = (ValueSets.observations[_.find(_.find(this.inclusions, { 'id': parameter.value[0].id }).parameters, {'name': parameter.name}).value].units.code);
          }
          context[parameter.id] = parameter.value;
          break;
        case 'dropdown':
          if (parameter.id == "comparison") {
            context.doubleSided = false;
            element.parameters.forEach(parameter => {
              if (parameter.id === "comparison_2") {
                context.doubleSided = true;
              }
            })
          }
          context.values = context.values || []
          context[parameter.id] = parameter.value;
          break;
        default:
          context.values = context.values || []
          context[parameter.id] = parameter.value;
          break;
      }
    });

    context.modifiers = element.modifiers;
    context.element_name = (context.element_name || element.uniqueId);
    this.contexts.push(context)
  }

  /* Modifiers Explanation:
    Within `form_templates`, a template must be specified (unless extending an element that specifies a template).
    If the element specifies a template within the folder `specificTemplates` it's assumed that element will not have modifiers
      In this case, just render the element.
    Otherwise:
      At this point, context.values should contain an array of each part of this element's CQL
        (e.g. ["CABG Surgeries", "Coronary artery bypass graft", "PCI ICD10CM SNOMEDCT", "PCI ICD9CM", "Carotid intervention"])
      Because each of these elements requires the modifier to be applied to them, loop through and render the base template (not modifier!)
        (e.g. ["[Procedure: "CABG Surgeries"]", "[Procedure: "Coronary artery bypass graft"]", "[Procedure: "PCI ICD10CM SNOMEDCT"]", "[Procedure: "PCI ICD9CM"]", "[Procedure: "Carotid intervention"]"])
      Then call `applyModifiers`. For each of these values, go through and apply each of the modifiers to them (by rendering the modifier template, and passing them in)
      Finally, join all these string with "\n  or " and return this (potentially-large) multi-line string.
      Render the `BaseTemplate`, which just gives adds the `define` statement, and inserts this string below it
  */

  // Both parameters are arrays. All modifiers will be applied to all values, and joined with "\n or".
  applyModifiers (values, modifiers = []) { // default modifiers to []
    return values.map((value) => {
      modifiers.map(modifier => {
        if (!modifier.template in modifierMap) console.error("Modifier Template could not be found: " + modifier.cqlTemplate);
        let modifierContext = { cqlLibraryFunction: modifier.cqlLibraryFunction, value_name: value };
        if (modifier.values) modifierContext.values = modifier.values; // Certain modifiers (such as lookback) require values, so provide them here
        value = ejs.render(modifierMap[modifier.cqlTemplate], modifierContext)
      })
      return value;
    }).join("\n  or "); //consider using '\t' instead of spaces if desired
  }

  // Generate cql for all elements
  body() {
    let expressions = this.contexts.concat(this.conjunctions);
    expressions = expressions.concat(this.conjunction_main);
    return expressions.map((context) => {
      if (context.withoutModifiers || context.components) {
        return ejs.render(specificMap[context.template], context);
      } else {
        if (!context.template in templateMap) console.error("Template could not be found: " + context.template);
        context.values.forEach((value, index) => {
          context.values[index] = ejs.render(templateMap[context.template], {element_context: value})
        })
        let cqlString = this.applyModifiers(context.values, context.modifiers);
        return ejs.render(templateMap['BaseTemplate'], {element_name: context.element_name, cqlString: cqlString})
      }
    }).join("\n");
  }
  header() {
    return ejs.render(fs.readFileSync(artifactPath, 'utf-8'), this);
  }
  population() {
    const getTreeName = (tree) => {
      return tree.parameters.find(p => p.id === 'element_name').value || tree.uniqueId;
    }

    const treeNames = {
      inclusions: this.inclusions.childInstances.length ? getTreeName(this.inclusions) : "",
      exclusions: this.exclusions.childInstances.length ? getTreeName(this.exclusions) : ""
    };

    return ejs.render(fs.readFileSync(templatePath + '/IncludeExclude', 'utf-8'), treeNames);
  }

  recommendation() {
    let recommendationText = this.recommendations.map(recommendation => {
      let conjunction = 'and'; // possible that this may become `or`, or some combo of the two conjunctions
      let conditionalText = recommendation.subpopulations.map(subpopulation => `"${subpopulation.subpopulationName}"`).join(` ${conjunction} `);
      return `if ${conditionalText} then "${recommendation.text}"`;
    }).join("\n  ");
    return ejs.render(templateMap['BaseTemplate'], {element_name: 'Recommendations', cqlString: recommendationText})
  }

  rationale() {
    let rationaleText = this.recommendations.map(recommendation => {
      if (_.isEmpty(recommendation.rationale)) return '';
      let conjunction = 'and'; // possible that this may become `or`, or some combo of the two conjunctions
      let conditionalText = recommendation.subpopulations.map(subpopulation => `"${subpopulation.subpopulationName}"`).join(` ${conjunction} `);
      return `if ${conditionalText} then "${recommendation.rationale}"`;
    }).join('\n  ');
    if (_.isEmpty(rationaleText)) return '';
    return ejs.render(templateMap['BaseTemplate'], {element_name: 'Rationale', cqlString: rationaleText})

  }

  // Produces the cql in string format
  toString() {
    return this.header()+this.body()+'\n'+this.population()+'\n'+this.recommendation()+'\n'+this.rationale();
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
