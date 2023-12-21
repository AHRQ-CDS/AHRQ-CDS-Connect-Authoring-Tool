const Artifact = require('../models/artifact');
const CQLLibrary = require('../models/cqlLibrary');
const { sendUnauthorized } = require('./common');

module.exports = {
  allGet,
  singleGet,
  singlePost,
  singlePut,
  singleDelete,
  duplicate
};

// Get all artifacts
async function allGet(req, res) {
  if (req.user) {
    try {
      const artifacts = await Artifact.find({ user: req.user.uid }).exec();
      res.json(artifacts);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    sendUnauthorized(res);
  }
}

// Get a single artifact
async function singleGet(req, res) {
  if (req.user) {
    const id = req.params.artifact;
    try {
      const artifact = await Artifact.find({ user: req.user.uid, _id: id }).exec();
      artifact.length === 0 ? res.sendStatus(404) : res.json(artifact);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    sendUnauthorized(res);
  }
}

// Post a single artifact
async function singlePost(req, res) {
  if (req.user) {
    const newArtifact = req.body;
    newArtifact.user = req.user.uid;
    try {
      const response = await Artifact.create(newArtifact);
      res.status(201).json(response);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    sendUnauthorized(res);
  }
}

// Update a single artifact
async function singlePut(req, res) {
  if (req.user) {
    const id = req.body._id;
    const artifact = req.body;
    try {
      const response = await Artifact.updateOne({ user: req.user.uid, _id: id }, { $set: artifact }).exec();
      response.n === 0 ? res.sendStatus(404) : res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    sendUnauthorized(res);
  }
}

// Delete a single artifact
async function singleDelete(req, res) {
  if (req.user) {
    const id = req.params.artifact;
    try {
      const response = await Artifact.deleteMany({ user: req.user.uid, _id: id }).exec();
      if (response.n === 0) {
        res.sendStatus(404);
      } else {
        await CQLLibrary.deleteMany({ user: req.user.uid, linkedArtifactId: id }).exec();
        res.sendStatus(200);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    sendUnauthorized(res);
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

async function duplicate(req, res, next) {
  if (req.user) {
    let artifactNames;
    try {
      artifactNames = await Artifact.find({ user: req.user.uid }).exec();
      const parentID = req.params.artifact;
      const artifact = await Artifact.findById(parentID).exec();
      if (artifact.length === 0) {
        res.sendStatus(404);
      } else {
        const duplicateToInsert = prepareDuplicateArtifact(
          artifact._doc, // eslint-disable-line
          artifactNames
        );

        const duplicateResponse = await Artifact.create(duplicateToInsert);
        const library = await CQLLibrary.find({ linkedArtifactId: parentID }).exec();
        if (library.length !== 0) {
          const promises = library.map(lib => {
            const newLib = {
              ...lib._doc, // eslint-disable-line
              linkedArtifactId: duplicateResponse._id
            };
            delete newLib['createdAt'];
            delete newLib['updatedAt'];
            delete newLib['_id'];
            return CQLLibrary.create(newLib);
          });
          await Promise.all(promises);
        }
        res.status(200).json(duplicateResponse);
      }
    } catch (err) {
      res.status(500).send(err);
      return;
    }
  } else sendUnauthorized(res);
}
