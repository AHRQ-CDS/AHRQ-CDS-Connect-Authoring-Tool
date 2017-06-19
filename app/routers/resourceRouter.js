const express = require('express');
const resources = require('../data/resources');
const templates = require('../data/form_templates');
const ResourceRouter = express.Router();

// Routes for /api/resources
ResourceRouter.route('/')
  // Get all age ranges saved in the resources collection
  .get(function(request, result) {
    result.json(resources);
  })

// Routes for /api/resources/templates
ResourceRouter.route('/templates')
  // Get all age ranges saved in the resources collection
  .get(function(request, result) {
    console.log(templates)
    result.json(templates);
  })

module.exports = ResourceRouter;