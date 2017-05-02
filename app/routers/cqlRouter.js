const express = require('express');
const artifact = require('../handlers/cqlHandler');
const CQLRouter = express.Router();

// Routes for /api/cql
CQLRouter.route('/')
  .post(artifact.objToCql)

// Routes for /api/cql/:artifact
CQLRouter.route('/:artifact')
  .get(artifact.idToObj, artifact.objToCql)

module.exports = CQLRouter;
