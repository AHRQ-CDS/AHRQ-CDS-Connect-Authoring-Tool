const express = require('express');
const _ = require('lodash');
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
  const allElements = req.body.template_instances;
  const libraryName = slug(req.body.name ? req.body.name : 'untitled');

  // TODO: This will come from the inputs in the "Save" modal eventually.
  const versionNumber = 1;
  const dataModel = "FHIR version '1.0.2'";
  const context = 'Patient';

  let initialCQL = `library ${libraryName} version '${versionNumber}' \n\n`;
  initialCQL += `using ${dataModel} \n\n`;

  const resourceMap = {}
  let definitionsCQL = `context ${context} \n\n`;
  // TODO: Some of this will be removed and put into separate templates eventually.
  allElements.forEach((element) => {
    const paramContext = {};

    element.parameters.forEach((parameter) => {
      switch (parameter.type) {
        case 'observation':
          paramContext[parameter.id] = parameter.value;
          resourceMap[parameter.value.id] = parameter.value
          break;
        default:
          paramContext[parameter.id] = parameter.value;
          break;
      }

    });

    definitionsCQL += interpolate(`${element.cql}\n`, paramContext);
  });

  let valueSetCQL = ''
  _.values(resourceMap).forEach((resource) => {
    valueSetCQL += `valueset "${resource.name}": '${resource.oid}'\n`;
  });
  valueSetCQL += (valueSetCQL.length > 0) ? '\n' : '';

  let cqlText = `${initialCQL}${valueSetCQL}${definitionsCQL}`

  const artifact = { 
    filename : libraryName,
    text : cqlText,
    type : 'text/plain'
  };
  res.json(artifact);
}

function interpolate(string, context) {
  return `${function (stringTemplate) {
            // eval the string template with the context 
            // this allows the variable in the template to resolve
            return eval(`\`${stringTemplate}\``);
          }.call(context, string)}\n`  
}

// Creates the cql file from an artifact ID
function fromArtifactID(req, res) {

}