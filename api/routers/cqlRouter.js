const express = require('express');
const artifact = require('../handlers/cqlHandler');
const publish = require('../handlers/publish');

const CQLRouter = express.Router();

// Routes for /authoring/api/cql
CQLRouter.route('/')
  .post(artifact.objToCql);

// Routes for /authoring/api/cql/:artifact
CQLRouter.route('/:artifact')
  .get(artifact.idToObj, artifact.objToCql);

// Route for /authoring/api/cql/publish
CQLRouter.route('/publish')
  .post(publish.publish);

module.exports = CQLRouter;
