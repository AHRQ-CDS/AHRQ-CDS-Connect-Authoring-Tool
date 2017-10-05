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
  if (req.user) {
    // eslint-disable-next-line array-callback-return
    Artifact.find({ user: req.user.uid }, (error, artifacts) => {
      if (error) res.status(500).send(error);
      else res.json(artifacts);
    });
  } else {
    res.sendStatus(401);
  }
}

// Get a single artifact
function singleGet(req, res) {
  if (req.user) {
    const id = req.params.artifact;
    Artifact.find({ user: req.user.uid, _id: id }, (error, artifact) => {
      if (error) res.status(500).send(error);
      else if (artifact.length === 0) res.sendStatus(404);
      else res.json(artifact);
    });
  } else {
    res.sendStatus(401);
  }
}

// Post a single artifact
function singlePost(req, res) {
  if (req.user) {
    const newArtifact = req.body;
    newArtifact.user = req.user.uid;
    Artifact.create(newArtifact,
      (error, response) => {
        if (error) res.status(500).send(error);
        else res.status(201).json(response);
      });
  } else {
    res.sendStatus(401);
  }
}

// Update a single artifact
function singlePut(req, res) {
  if (req.user) {
    const id = req.body._id;
    const artifact = req.body;
    Artifact.update(
      { user: req.user.uid, _id: id },
      { $set: artifact },
      (error, response) => {
        if (error) res.status(500).send(error);
        else if (response.n === 0) res.sendStatus(404);
        else res.sendStatus(200);
      });
  } else {
    res.sendStatus(401);
  }
}

// Delete a single artifact
function singleDelete(req, res) {
  if (req.user) {
    const id = req.params.artifact;
    Artifact.remove({ user: req.user.uid, _id: id }, (error, response) => {
      if (error) res.status(500).send(error);
      else if (response.result.n === 0) res.sendStatus(404);
      else res.sendStatus(200);
    });
  } else {
    res.sendStatus(401);
  }
}
