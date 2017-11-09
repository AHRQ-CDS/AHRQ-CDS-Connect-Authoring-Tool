const express = require('express');
const config = require('../handlers/configHandler');

const ConfigRouter = express.Router();

// Routes for /authoring/api/config
ConfigRouter.route('/resources')
  .get(config.getResources);

// Routes for /authoring/api/config/templates
ConfigRouter.route('/templates')
  .get(config.getTemplates);

// Routes for /authoring/api/config/valuesets
ConfigRouter.route('/valuesets')
  .get(config.getValueSets);

// Routes for /authoring/api/config/valuesets/:valueset*
ConfigRouter.route('/valuesets/:valueset*')
  .get(config.getOneValueSet);

// Routes for /authoring/api/repo/publish
ConfigRouter.route('/repo/publish')
  .get(config.getRepoPublishConfig);

module.exports = ConfigRouter;
