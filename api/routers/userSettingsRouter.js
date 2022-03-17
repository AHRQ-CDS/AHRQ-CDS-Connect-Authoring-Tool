const express = require('express');
const settings = require('../handlers/userSettingsHandler');

const UserSettingsRouter = express.Router();

// Routes for /authoring/api/settings
UserSettingsRouter.route('/').get(settings.get).put(settings.put);

module.exports = UserSettingsRouter;
