const express = require('express');
const expression = require('../handlers/expressionHandler');

const ExpressionRouter = express.Router();

// Routes for /authoring/api/expressions
ExpressionRouter.route('/')
  .get(expression.allGet)
  .post(expression.singlePost)
  .put(expression.singlePut);

// Routes for /authoring/api/expressions/group/:group_id
ExpressionRouter.route('/group/:group_id')
  .get(expression.groupGet);

// Routes for /authoring/api/expressions/:expression
ExpressionRouter.route('/:expression')
  .get(expression.singleGet);

module.exports = ExpressionRouter;
