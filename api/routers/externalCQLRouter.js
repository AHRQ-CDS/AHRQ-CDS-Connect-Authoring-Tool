const express = require('express');
const externalCQL = require('../handlers/externalCQLHandler');

const ExternalCQLRouter = express.Router();

// Routes for /authoring/api/externalCQL
ExternalCQLRouter.route('/')
  .post(externalCQL.singlePost);

// Routes for /authoring/api/externalCQL/:artifactId
ExternalCQLRouter.route('/:artifactId')
  .get(externalCQL.allGet); // Get all external CQL libraries for a given artifact

// Routes for /authoring/api/externalCQL/:externalCQL
// ExternalCQLRouter.route('/:artifactId&:id')
//   .get(externalCQL.singleGet)
//   .delete(externalCQL.singleDelete);

module.exports = ExternalCQLRouter;
