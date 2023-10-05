const express = require('express');
const cql = require('../handlers/cqlHandler');

const CQLRouter = express.Router();

// Routes for /authoring/api/cql
CQLRouter.route('/').post(cql.objToZippedCql);

CQLRouter.route('/validate').post(cql.objToELM);
CQLRouter.route('/viewCql').post(cql.objToViewableCql);

module.exports = CQLRouter;
