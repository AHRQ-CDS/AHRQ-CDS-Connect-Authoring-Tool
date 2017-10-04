const Expression = require('../models/expression');

module.exports = {
  allGet,
  groupGet,
  singleGet,
  singlePost,
  singlePut,
  singleDelete
};

// Get all expressions
function allGet(req, res) {
  if (req.user) {
    // eslint-disable-next-line array-callback-return
    Expression.find({ user: req.user.uid }, (error, expressions) => {
      if (error) res.status(500).send(error);
      else res.json(expressions);
    });
  } else {
    res.sendStatus(401);
  }
}

// Get all expressions in a group
function groupGet(req, res) {
  if (req.user) {
    Expression.find({ user: req.user.uid, id: req.params.group_id }, (error, expressions) => {
      if (error) res.status(500).send(error);
      else res.json(expressions);
    });
  } else {
    res.sendStatus(401);
  }
}

// Get a single expression
function singleGet(req, res) {
  if (req.user) {
    const id = req.params.expression;
    Expression.find({ user: req.user.uid, _id: id }, (error, expression) => {
      if (error) res.status(500).send(error);
      else res.json(expression);
    });
  } else {
    res.sendStatus(401);
  }
}

// Post a single expression
function singlePost(req, res) {
  if (req.user) {
    req.body.name = req.body.name.length ? req.body.name : 'Untitled';
    req.body.user = req.user.uid;
    Expression.findOneAndUpdate(
      { user: req.user.uid, name: req.body.name },
      req.body,
      { upsert: true },
      (error, response) => {
        if (error) res.status(500).send(error);
        else res.status(201).json(response);
      });
  } else {
    res.sendStatus(401);
  }
}

// Update a single expression
function singlePut(req, res) {
  if (req.user) {
    const id = req.body._id;
    const expression = req.body;
    Expression.update(
      { user: req.user.uid, _id: id },
      { $set: expression },
      (error, response) => {
        if (error) res.status(500).send(error);
        else res.sendStatus(200);
      });
  } else {
    res.sendStatus(401);
  }
}

// Delete a single expression
function singleDelete(req, res) {
  if (req.user) {
    const id = req.params.expression;
    Expression.remove({ user: req.user.uid, _id: id }, (error, response) => {
      if (error) res.status(500).send(error);
      else res.sendStatus(200);
    });
  } else {
    res.sendStatus(401);
  }
}
