const Expression = require('../models/expression');

module.exports = {
  allGet : allGet,
  groupGet : groupGet,
  singleGet : singleGet,
  singlePost : singlePost,
  singlePut : singlePut,
  singleDelete : singleDelete
}

// Get all expressions
function allGet(req, res) {
  Expression.find((error, expressions) => {
    if (error) res.status(500).send(error);
    else res.json(expressions);
  });
};

// Get all expressions in a group
function groupGet(req, res) {
  console.log(req.params)
  Expression.find({ id : req.params.group_id }, (error, expressions) => {
    if (error) res.status(500).send(error);
    else res.json(expressions);
  })
}

// Get a single expression
function singleGet(req, res) {
  let id = req.params.expression;
  Expression.find({ _id : id }, (error, expression) => {
    if (error) res.status(500).send(error);
    else res.json(expression);
  })
}

// Post a single expression
function singlePost(req, res) {
  req.body.name = req.body.name.length ? req.body.name : 'Untitled';
  Expression.findOneAndUpdate(
    { name : req.body.name },
    req.body,
    { upsert : true },
    (error, response) => {
      if (error) res.status(500).send(error);
      else res.status(201).json(response);
    })
}

// Update a single expression
function singlePut(req, res) {
  let id = req.body._id;
  let expression = req.body;
  Expression.update(
    { _id : id },
    { $set : expression },
    (error, response) => {
      if (error) res.status(500).send(error);
      else res.sendStatus(200);
    })
}

// Delete a single expression
function singleDelete(req, res) {
  let id = req.params.expression;
  Expression.remove({ _id : id }, (error, response) => {
    if (error) res.status(500).send(error);
    else res.sendStatus(200);
  })
}
