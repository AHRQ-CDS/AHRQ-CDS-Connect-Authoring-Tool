const CQLLibrary = require('../models/cqlLibrary');
const convertToELM = require('../handlers/cqlHandler').convertToElm;

module.exports = {
  allGet,
  singlePost,
};

// Get all libraries for a given artifact
function allGet(req, res) {
  if (req.user) {
    // eslint-disable-next-line array-callback-return
    CQLLibrary.find({ user: req.user.uid, linkedArtifactId: req.body.artifactId }, (error, libraries) => {
      if (error) res.status(500).send(error);
      else res.json(libraries);
    });
  } else {
    res.sendStatus(401);
  }
}

// Post a single external CQL library
function singlePost(req, res) {
  if (req.user) {
    /**
     *  TODO at the start:
     * 1. check if it's a zip file and unzip.
     * 2. Check for duplicate/disallowed artifacts (name and version are same as an existing) and prevent upload
     * 
     * Request needs to send: file name, file content, current artifact id.
     */

    // const cqlFileText = testCQLFileContent;
    const cqlFileText = req.body.cqlFileText;
    const cqlFileName = req.body.cqlFileName;
    const linkedArtifactId = req.body.artifactId;

    const cqlJson = {
      filename: cqlFileName,
      text: cqlFileText,
      type: 'text/plain'
    };

    let elmResults = {
      linkedArtifactId,
      user: req.user.uid
    };

    convertToELM(cqlJson, (err, elmFiles) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      elmFiles.forEach((file, i) => {
        const parsedContent = JSON.parse(file.content);
        // ELM will return any helper libraries in order to not get errors - but we don't need to save those files here.
        const fileName = file.name;
        if (fileName === cqlFileName) {
          // TODO: improve null checks
          const { library } = parsedContent;
          elmResults.name = library.identifier.id;
          elmResults.version = library.identifier.version;
          elmResults.fhirVersion = library.usings.def[1].version;

          const details = {};
          details.cqlFileText = cqlFileText;
          details.fileName = cqlFileName;
          details.definitions = library.statements.def;
          // TODO: Should definitions filter out things like Patient retrieve, meets inclusion criteria, etc?

          elmResults.details = details;
        }
      });

      CQLLibrary.create(elmResults,
        (error, response) => {
          if (error) {
            res.status(500).send(error);
          }
          else res.status(201).json(response);
        });
    });

  } else {
    res.sendStatus(401);
  }
}
