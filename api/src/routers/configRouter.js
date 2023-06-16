const express = require('express');
const config = require('../handlers/configHandler');

const ConfigRouter = express.Router();

// Routes for /authoring/api/config/templates
ConfigRouter.route('/templates').get(config.getTemplates);

// Routes for /authoring/api/config/valuesets
ConfigRouter.route('/valuesets').get(config.getValueSets);

// Routes for /authoring/api/config/valuesets/:valueset*
ConfigRouter.route('/valuesets/:valueset*').get(config.getOneValueSet);

// Routes for /authoring/api/config/conversions
ConfigRouter.route('/conversions').get(config.getConversionFunctions);

// Routes for Query Builder Resources
// Route: /authoring/api/config/query/resources/dstu2
ConfigRouter.route('/query/resources/dstu2').get(config.getDSTU2Resources);

// Route: /authoring/api/config/query/resources/stu3
ConfigRouter.route('/query/resources/stu3').get(config.getSTU3Resources);

// Route: /authoring/api/config/query/resources/r4
ConfigRouter.route('/query/resources/r4').get(config.getR4Resources);

// Route: /authoring/api/config/query/resources/operators
ConfigRouter.route('/query/resources/operators').get(config.getResourceOperators);

module.exports = ConfigRouter;
