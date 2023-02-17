const Artifact = require('../models/artifact');
const CQLLibrary = require('../models/cqlLibrary');

module.exports = {
  allGet,
  singleGet,
  singlePost,
  singlePut,
  singleDelete,
  duplicate
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
    Artifact.create(newArtifact, (error, response) => {
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
    Artifact.updateOne({ user: req.user.uid, _id: id }, { $set: artifact }, (error, response) => {
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
    Artifact.deleteMany({ user: req.user.uid, _id: id }, (error, response) => {
      if (error) res.status(500).send(error);
      else if (response.n === 0) res.sendStatus(404);
      else {
        CQLLibrary.deleteMany({ user: req.user.uid, linkedArtifactId: id }, (error, response) => {
          if (error) res.status(500).send(error);
          else res.sendStatus(200);
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
}

function prepareDuplicateArtifact(artifact, artifactNames) {
  let artifactCopy;
  if (artifactNames.find(a => a.name === 'Copy of ' + artifact.name)) {
    let version = 1;
    let currentName;

    do {
      version += 1;
      currentName = 'Copy of ' + artifact.name + ` (${version.toString()})`;
    } while (artifactNames.find(a => a.name === currentName));

    artifactCopy = { ...artifact, name: currentName };
  } else {
    artifactCopy = { ...artifact, name: 'Copy of ' + artifact.name };
  }

  delete artifactCopy['updatedAt'];
  delete artifactCopy['createdAt'];
  delete artifactCopy['_id'];
  return artifactCopy;
}

async function duplicate(req, res) {
  if (req.user) {
    const artifactNames = await Artifact.find({ user: req.user.uid });
    const parentID = req.params.artifact;
    Artifact.findById(parentID, (error, artifact) => {
      if (error) res.status(500).send(error);
      else if (artifact.length === 0) res.sendStatus(404);
      else {
        let duplicateToInsert = prepareDuplicateArtifact(
          artifact._doc, // eslint-disable-line
          artifactNames
        );

        Artifact.create(duplicateToInsert)
          .then(duplicateResponse => {
            CQLLibrary.find({ linkedArtifactId: parentID }, (error, library) => {
              if (!error && library.length !== 0) {
                library.map(lib => {
                  const newLib = {
                    ...lib._doc, // eslint-disable-line
                    linkedArtifactId: duplicateResponse._id
                  };
                  delete newLib['createdAt'];
                  delete newLib['updatedAt'];
                  delete newLib['_id'];
                  CQLLibrary.create(newLib, error => {
                    if (error) {
                      res.status(500).send(error);
                      return;
                    }
                  });
                });
              }
            });
            res.status(200).json(duplicateResponse);
          })
          .catch(error => {
            res.status(500).send(error);
            return;
          });
      }
    });
  } else res.sendStatus(401);
}
