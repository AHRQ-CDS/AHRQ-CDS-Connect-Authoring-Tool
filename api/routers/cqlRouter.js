const express = require('express');
const artifact = require('../handlers/cqlHandler');

const CQLRouter = express.Router();

// Routes for /authoring/api/cql
CQLRouter.route('/')
  .post(artifact.objToCql);

CQLRouter.route('/validate')
  .post(artifact.objToELM);

// Routes for /authoring/api/cql/:artifact
CQLRouter.route('/:artifact')
  .get(artifact.idToObj, artifact.objToCql);

module.exports = CQLRouter;
