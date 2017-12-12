const express = require('express');
const vsac = require('../handlers/vsacHandler');

const VSACRouter = express.Router();

VSACRouter.route('/login')
  .post(vsac.login);

VSACRouter.route('/vs/:id')
  .get(vsac.getVSDetailsByOID);

module.exports = VSACRouter;
