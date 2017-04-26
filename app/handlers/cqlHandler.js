const Artifact = require('../models/artifact');
const slug = require('slug');

module.exports = {
   objToCql : objToCql,
   idToObj : idToObj
}

const templates = {
   AgeRange : 'AgeInYears()>=${this.minInt} and AgeInYears()<=${this.maxInt}',
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
  let cqlText = '';
  const allElements = req.body.template_instances;
  const libraryName = slug(req.body.name ? req.body.name : 'untitled');

  // TODO: This will come from the inputs in the "Save" modal eventually.
  const versionNumber = 1;
  const dataModel = "FHIR version '1.0.2'";
  const context = 'Patient';

  let initialCQL = `library ${libraryName} version '${versionNumber}'\n`;
  initialCQL += `using ${dataModel}\n`;
  initialCQL += `context ${context}\n`;
  cqlText += initialCQL;

  // TODO: Some of this will be removed and put into separate templates eventually.
  allElements.forEach((element) => {
    const paramContext = {};

    element.parameters.forEach((parameter) => {
      paramContext[parameter.id] = parameter.value;
    });

    cqlText += `${function (cql) {
      console.log(cql)
      // eval the cql template with the context we created above
      // this allows the variable in the template to resolve
      return eval(`\`${cql}\``);
    }.call(paramContext, templates.AgeRange)}\n`;
  });

  const artifact = { 
    filename : libraryName,
    text : cqlText,
    type : 'text/plain'
  };
  res.json(artifact);
}

class CqlArtifact {
   constructor(artifact) {
      this.name = slug(artifact.name ? artifact.name : 'untitled');
      this.version = artifact.version ? artifact.version : 1;
      this.dataModel = "FHIR version '1.0.2'";
      this.context = 'Patient';
      this.rules = artifact.template_instances;

   }


   toString() {
      let headersCQL = `library ${this.name} version '${this.version}'\n\n`;
      headersCQL += `using ${this.dataModel}\n\n`;
      // TODO adding codesystems
      // TODO adding valuesets
      headersCQL += `context ${this.context}\n\n`;

   }
}