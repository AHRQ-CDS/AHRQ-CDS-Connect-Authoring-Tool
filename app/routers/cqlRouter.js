const express = require('express');
const Artifact = require('../models/artifact');
const slug = require('slug');
const CQLRouter = express.Router();

// Routes for /api/cql
CQLRouter.route('/')
  .post(fromArtifactOBJ)

// Routes for /api/cql/:artifact
CQLRouter.route('/:artifact')
  .get(fromArtifactID)

module.exports = CQLRouter;

// Creates the cql file from an artifact object
function fromArtifactOBJ(req, res) {
  let cqlText = '';
  const allElements = req.body.template_instances;
  const libraryName = slug(req.body.name ? req.body.name : 'untitled');

  // TODO: This will come from the inputs in the "Save" modal eventually.
  const versionNumber = 1;
  const dataModel = "FHIR version '1.0.2'";
  const context = 'Patient';

  let initialCQL = `library ${libraryName} version '${versionNumber}' \n\n`;
  initialCQL += `using ${dataModel} \n\n`;
  initialCQL += `context ${context} \n\n`;
  cqlText += initialCQL;

  // TODO: Some of this will be removed and put into separate templates eventually.
  allElements.forEach((element) => {
    const paramContext = {};

    element.parameters.forEach((parameter) => {
      paramContext[parameter.id] = parameter.value;
    });

    cqlText += `${function (cql) {
      // eval the cql template with the context we created above
      // this allows the variable in the template to resolve
      return eval(`\`${cql}\``);
    }.call(paramContext, element.cql)}\n`;
  });

  const artifact = { 
    filename : libraryName,
    text : cqlText,
    type : 'text/plain'
  };
  res.json(artifact);
}

// Creates the cql file from an artifact ID
function fromArtifactID(req, res) {

}