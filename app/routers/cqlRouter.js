const express = require('express');
const artifact = require('../handlers/cqlHandler');
const publish = require('../handlers/publish');
const CQLRouter = express.Router();

// Routes for /api/cql
CQLRouter.route('/')
  .post(artifact.objToCql)

// Routes for /api/cql/:artifact
CQLRouter.route('/:artifact')
  .get(artifact.idToObj, artifact.objToCql)

// Route for api/cql/publish
CQLRouter.route('/publish')
  .post(publish.publish)

module.exports = CQLRouter;
