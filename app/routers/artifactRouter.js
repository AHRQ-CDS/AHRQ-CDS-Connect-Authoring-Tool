const express = require('express');
const artifact = require('../handlers/artifactHandler');
const ArtifactRouter = express.Router();

// Routes for /api/artifact
ArtifactRouter.route('/')
  .get(artifact.allGet)
  .post(artifact.singlePost)
  .put(artifact.singlePut);

// Routes for /api/artifact/:artifact
ArtifactRouter.route('/:artifact')
  .get(artifact.singleGet)
  .delete(artifact.singleDelete);

module.exports = ArtifactRouter;