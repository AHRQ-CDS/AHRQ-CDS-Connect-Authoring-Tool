const express = require('express');
const artifact = require('../handlers/artifactHandler');

const ArtifactRouter = express.Router();

// Routes for /authoring/api/artifacts
ArtifactRouter.route('/')
  .get(artifact.allGet)
  .post(artifact.singlePost)
  .put(artifact.singlePut);

// Routes for /authoring/api/artifacts/:artifact
ArtifactRouter.route('/:artifact')
  .get(artifact.singleGet)
  .delete(artifact.singleDelete);

module.exports = ArtifactRouter;
