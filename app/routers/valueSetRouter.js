const express = require('express');
const valueset = require('../handlers/valueSetHandler');
const ValueSetRouter = express.Router({mergeParams: true});

// Routes for /api/valuesets
ValueSetRouter.route('/')
  .get(valueset.getAll);

// Routes for /api/valuesets/:valueset*
ValueSetRouter.route('/:valueset*')
  .get(valueset.getOne);

module.exports = ValueSetRouter;