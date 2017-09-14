const express = require('express');
const config = require('../handlers/configHandler');
const ConfigRouter = express.Router();

// Routes for /api/config
ConfigRouter.route('/resources')
  .get(config.getResources);

// Routes for /api/config/templates
ConfigRouter.route('/templates')
  .get(config.getTemplates);

// Routes for /api/config/valuesets
ConfigRouter.route('/valuesets')
  .get(config.getValueSets);

// Routes for /api/config/valuesets/:valueset*
ConfigRouter.route('/valuesets/:valueset*')
  .get(config.getOneValueSet);

module.exports = ConfigRouter;
