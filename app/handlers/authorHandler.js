const Author = require('../models/author');

module.exports = {
  allGet : allGet,
  singleGet : singleGet,
  singlePost : singlePost,
  singlePut : singlePut,
  singleDelete : singleDelete
}

// Get all authors
function allGet(req, res) {
  Author.find(function(error, authors) {
    if (error) res.status(500).send(error);
    else res.json(authors);
  });
};

// Get a single author
function singleGet(req, res) {
  let id = req.params.author;
  Author.find({ _id : id }, function(error, author) {
    if (error) res.status(500).send(error);
    else res.json(author);
  })
}

// Post a single author
function singlePost(req, res) {
  Author.create(req.body,
    function(error, response) {
      if (error) res.status(500).send(error);
      else res.status(201).json(response);
    })
}

// Update a single author
function singlePut(req, res) {
  console.log(req.body);
  let id = req.body._id;
  let author = req.body;
  Author.update(
    { _id : id },
    { $set : author },
    function(error, response) {
      if (error) res.status(500).send(error);
      else res.sendStatus(200);
    })
}

// Delete a single author
function singleDelete(req, res) {
  let id = req.params.author;
  Author.remove({ _id : id }, function(error, response) {
    if (error) res.status(500).send(error);
    else res.sendStatus(200);
  })
}