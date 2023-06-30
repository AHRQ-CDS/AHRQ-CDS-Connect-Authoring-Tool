const express = require('express');
const artifact = require('../handlers/cqlHandler');

const CQLRouter = express.Router();

// Routes for /authoring/api/cql
CQLRouter.route('/').post(artifact.objToZippedCql);

CQLRouter.route('/validate').post(artifact.objToELM);
CQLRouter.route('/viewCql').post(artifact.objToViewableCql);

// Routes for /authoring/api/cql/:artifact
CQLRouter.route('/:artifact').get(artifact.idToObj, artifact.objToZippedCql);

module.exports = CQLRouter;
