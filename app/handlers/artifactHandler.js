const Artifact = require('../models/artifact');

module.exports = {
  allGet,
  singleGet,
  singlePost,
  singlePut,
  singleDelete
};

// Get all artifacts
function allGet(req, res) {
  // eslint-disable-next-line array-callback-return
  Artifact.find((error, artifacts) => {
    if (error) res.status(500).send(error);
    else res.json(artifacts);
  });
}

// Get a single artifact
function singleGet(req, res) {
  const id = req.params.artifact;
  Artifact.find({ _id: id }, (error, artifact) => {
    if (error) res.status(500).send(error);
    else res.json(artifact);
  });
}

// Post a single artifact
function singlePost(req, res) {
  Artifact.create(req.body,
    (error, response) => {
      if (error) res.status(500).send(error);
      else res.status(201).json(response);
    });
}

// Update a single artifact
function singlePut(req, res) {
  const id = req.body._id;
  const artifact = req.body;
  Artifact.update(
    { _id: id },
    { $set: artifact },
    (error, response) => {
      if (error) res.status(500).send(error);
      else res.sendStatus(200);
    });
}

// Delete a single artifact
function singleDelete(req, res) {
  const id = req.params.artifact;
  Artifact.remove({ _id: id }, (error, response) => {
    if (error) res.status(500).send(error);
    else res.sendStatus(200);
  });
}
