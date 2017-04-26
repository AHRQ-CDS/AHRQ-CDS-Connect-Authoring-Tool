const Artifact = require('../models/artifact');
const ValueSets = require('../data/valueSets');
const CqlTemplates = require('../data/cqlTemplates');
const _ = require('lodash');
const slug = require('slug');

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

// Evaluates strings templates to inject variables
function interpolate(string, context) {
  return `${function (stringTemplate) {
    return eval(`\`${stringTemplate}\``);
  }.call(context, string)}\n`  
}

// Class to handle all cql generation
class CqlArtifact {
  constructor(artifact) {
    this.name = slug(artifact.name ? artifact.name : 'untitled');
    this.version = artifact.version ? artifact.version : 1;
    this.dataModel = artifact.dataModel ? artifact.dataModel : "FHIR version '1.0.2'";
    this.context = artifact.context ? artifact.context : 'Patient';
    this.elements = artifact.template_instances;

    this.resourceMap = {};
  }

  // Generate cql for a single element
  parseElement(element) {
    const paramContext = {};
    element.parameters.forEach((parameter) => {
      switch (parameter.type) {
        case 'observation':
          let valueSet = ValueSets.observations[parameter.value.id];
          paramContext[parameter.id] = valueSet;
          this.resourceMap[parameter.value.id] = valueSet;
          break;
        default:
          paramContext[parameter.id] = parameter.value;
          break;
      }
    });

    if ('element_name' in paramContext && paramContext.element_name.length) {
      paramContext.element_name = slug(paramContext.element_name);
    } else {
      paramContext.element_name = slug(element.uniqueId);
    }
    return interpolate(CqlTemplates[element.id], paramContext);
  }

  // Generate cql for all elements
  parseElements() {
    let cqlText = '';
    this.elements.forEach((element) => {
      cqlText += this.parseElement(element);
    });
    return cqlText;
  }

  // Generate the header lines (i.e. library, using, valuesets, context)
  headers() {
    let headersCQL = `library ${this.name} version '${this.version}'\n\n`;
    headersCQL += `using ${this.dataModel}\n\n`;
    
    if (Object.keys(this.resourceMap).length) {
      _.values(this.resourceMap).forEach((resource) => {
        headersCQL += `valueset "${resource.name}": '${resource.oid}'\n`;
      });
      headersCQL += '\n'
    }

    headersCQL += `context ${this.context}\n\n`;
    return headersCQL;
  }

  // Produces the cql in string format
  toString() {
    let bodyCQL = this.parseElements();
    let headersCQL = this.headers();
    return `${headersCQL}${bodyCQL}`;
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