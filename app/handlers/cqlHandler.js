const Artifact = require('../models/artifact');
const ValueSets = require('../data/valueSets');
const _ = require('lodash');
const slug = require('slug');
const ejs = require('ejs');
const fs = require('fs');
const path = require( 'path' );
const templatePath = 'app/data/cql/templates'
const artifactPath = 'app/data/cql/artifact.ejs'
const templateMap = loadTemplates();

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
  res.json(artifact.toJson());
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


// Class to handle all cql generation
class CqlArtifact {
  constructor(artifact) {
    this.name = slug(artifact.name ? artifact.name : 'untitled');
    this.version = artifact.version ? artifact.version : 1;
    this.dataModel = artifact.dataModel ? artifact.dataModel : {name: 'FHIR', version: '1.0.2'};
    this.context = artifact.context ? artifact.context : 'Patient';
    this.elements = artifact.templateInstances;

    this.initialize()
  }

  initialize() {
    this.resourceMap = new Map();
    this.codeSystemMap = new Map();
    this.codeMap = new Map();
    this.conceptMap = new Map();
    this.contexts = [];
    this.elements.forEach((element) => { 
      this.parseElement(element)
    });
  }

  // Generate context and resources for a single element
  parseElement(element) {
    const context = {template: element.id};
    element.parameters.forEach((parameter) => {
      switch (parameter.type) {
        case 'observation':
          let valueSet = ValueSets.observations[parameter.value.id];
          context[parameter.id] = valueSet;
          // For observations that have codes associated with them instead of valuesets
          if ("codes" in valueSet) {
            valueSet.codes.forEach((code) => {
              this.codeSystemMap.set(code.codeSystem.name, code.codeSystem.id);
              this.codeMap.set(code.name, code);
            });
            this.conceptMap.set(valueSet.id, valueSet);
          } else {
            this.resourceMap.set(parameter.value.id, valueSet);
          }
          break;
        case 'integer':
          context[parameter.id] = parameter.value;
          if ('exclusive' in parameter) {
            context[`${parameter.id}_exclusive`] = parameter.exclusive; 
          }
        default:
          context[parameter.id] = parameter.value;
          break;
      }
    });

    context.element_name = slug(context.element_name || element.uniqueId);
    this.contexts.push(context)
  }

  // Generate cql for all elements
  body() {
    return this.contexts.map((context) => {
      if (!templateMap[context.template]) console.error("Template could not be found: " + context.template);
      return ejs.render(templateMap[context.template], context)
    }).join("\n");
  }
  header() {
    return ejs.render(fs.readFileSync(artifactPath, 'utf-8'), this);
  }

  // Produces the cql in string format
  toString() {
    return this.header()+this.body()

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