const express = require('express');
const expression = require('../handlers/expressionHandler');

const ExpressionRouter = express.Router();

// Routes for /api/expressions
ExpressionRouter.route('/')
  .get(expression.allGet)
  .post(expression.singlePost)
  .put(expression.singlePut);

// Routes for /api/expressions/group/:group_id
ExpressionRouter.route('/group/:group_id')
  .get(expression.groupGet);

// Routes for /api/expressions/:expression
ExpressionRouter.route('/:expression')
  .get(expression.singleGet);

module.exports = ExpressionRouter;
