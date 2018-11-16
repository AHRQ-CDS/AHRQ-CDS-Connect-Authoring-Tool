const express = require('express');
const vsac = require('../handlers/vsacHandler');

const VSACRouter = express.Router();

VSACRouter.route('/login')
  .post(vsac.login);

VSACRouter.route('/checkAuthentication')
  .get(vsac.getTimeOfTGT);

module.exports = VSACRouter;
