const express = require('express');
const resources = require('../data/resources');
const ResourceRouter = express.Router();

// Routes for /api/resources
ResourceRouter.route('/')
  // Get all age ranges saved in the resources collection
  .get(function(request, result) {
    result.json(resources);
  })

module.exports = ResourceRouter;