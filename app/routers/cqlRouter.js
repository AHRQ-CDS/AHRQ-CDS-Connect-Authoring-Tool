const express = require('express');
const Artifact = require('../models/artifact');
const CQLRouter = express.Router();

// Routes for /api/cql
CQLRouter.route('/')
  .post(fromArtifactOBJ)

// Routes for /api/cql/:artifact
CQLRouter.route('/:artifact')
  .get(fromArtifactID)

module.exports = CQLRouter;

// Creates the cql file from an artifact object
function fromArtifactOBJ(req, res) {
  let text = 'Testing File';

  res.json({ 
    filename : 'TheFileName',
    text : text,

  });
}

// Creates the cql file from an artifact ID
function fromArtifactID(req, res) {

}