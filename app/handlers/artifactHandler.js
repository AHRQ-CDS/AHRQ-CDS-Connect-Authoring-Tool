const Artifact = require('../models/artifact');

module.exports = {
  allGet : allGet,
  singleGet : singleGet,
  singlePost : singlePost,
  singlePut : singlePut,
  singleDelete : singleDelete
}

// Get all artifacts
function allGet(req, res) {
  Artifact.find(function(error, artifacts) {
    if (error) res.status(500).send(error);
    else res.json(artifacts);
  });
};

// Get a single artifact
function singleGet(req, res) {
  let id = req.params.artifact;
  Artifact.find({ _id : id }, function(error, artifact) {
    if (error) res.status(500).send(error);
    else res.json(artifact);
  })
}

// Post a single artifact
function singlePost(req, res) {
  Artifact.create(req.body,
    function(error, response) {
      if (error) res.status(500).send(error);
      else res.status(201).json(response);
    })
}

// Update a single artifact
function singlePut(req, res) {
  console.log(req.body);
  let id = req.body._id;
  let artifact = req.body;
  Artifact.update(
    { _id : id },
    { $set : artifact },
    function(error, response) {
      if (error) res.status(500).send(error);
      else res.sendStatus(200);
    })
}

// Delete a single artifact
function singleDelete(req, res) {
  let id = req.params.artifact;
  Artifact.remove({ _id : id }, function(error, response) {
    if (error) res.status(500).send(error);
    else res.sendStatus(200);
  })
}