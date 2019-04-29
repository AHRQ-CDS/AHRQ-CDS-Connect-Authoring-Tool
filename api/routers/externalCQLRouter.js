const express = require('express');
const externalCQL = require('../handlers/externalCQLHandler');

const ExternalCQLRouter = express.Router();

// Routes for /authoring/api/externalCQL
ExternalCQLRouter.route('/')
  // .get(externalCQL.allGet)
  .post(externalCQL.singlePost);

// Routes for /authoring/api/testing/:externalCQL
// ExternalCQLRouter.route('/:patient')
//   .get(externalCQL.singleGet)
//   .delete(externalCQL.singleDelete);

module.exports = ExternalCQLRouter;
