const CQLLibrary = require('../models/cqlLibrary');
const convertToELM = require('../handlers/cqlHandler').convertToElm;

module.exports = {
  singlePost,
};

const testCQLFileContent =
`library "CQL-Upload" version '1'

using FHIR version '1.0.2'

include FHIRHelpers version '1.0.2' called FHIRHelpers 

include CDS_Connect_Commons_for_FHIRv102 version '1.3.0' called C3F 

include CDS_Connect_Conversions version '1' called Convert 


valueset "LDL-c VS": '2.16.840.1.113883.3.117.1.7.1.215'



context Patient

define "Age":
  AgeInMonths() >= 14

define "LDL-c":
  exists([Observation: "LDL-c VS"])

define "MeetsInclusionCriteria":
  "Age"
  and "LDL-c"

define "InPopulation":
   "MeetsInclusionCriteria" 

define "Recommendation":
  null

define "Rationale":
  null
define "Errors":
  null
`;

// Post a single external CQL library
function singlePost(req, res) {
  if (req.user) {
    /**
     *  TODO at the start:
     * 1. check if it's a zip file and unzip.
     * 2. Check for duplicate/disallowed artifacts (name and version are same as an existing) and prevent upload
     * 
     * Request needs to send: file name, file content, current artifact id.
     * req.body = { cqlFile: '...' };
     * const cqlFile = req.body.cqlFile;
     */

    const cqlFileText = testCQLFileContent;
    const cqlFileName = 'My Uploaded File';
    const linkedArtifactId = '13234';

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
