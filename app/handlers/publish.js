const Config = require('../../config');
const cqlHandler = require('./cqlHandler');
const fs = require('fs');
const tmp = require('tmp');
const upload = require('cds-upload');

module.exports = {
  publish,
  getArtifacts
};

function getArtifacts(req, res) {
  upload.requestArtifacts(Config.repo.baseUrl).then((art) => {
    res.send(art);
  });
}

function publish(req, res) {
  const artifact = cqlHandler.buildCQL(req.body.data);
  const fd = tmp.fileSync({ postfix: '.zip' });
  const output = fs.createWriteStream(fd.name);
  cqlHandler.writeZip(artifact, output, (err) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    // The upload API requires the file to be base64-encoded
    const base64 = fs.readFileSync(fd.name).toString('base64');
    const name = req.body.auth.username;
    const pass = req.body.auth.password;
    const authData = { name, pass };
    const NID = req.body.nid;
    upload.submitArtifactFileToRepo(Config.repo.baseUrl, authData, NID, artifact.name, artifact.version, base64)
    .then((uploaded) => {
      res.send(uploaded);
    });
  });
}

// function getArtifactDetails(req, res) {
//   request.get(`${Config.repo.baseUrl}/rest/session/token`, {auth:req.auth}, function(err, resp, body) {
//     if(err) { res.sendStatus(500); return;}
//     let headers = {'Accept':'application/vnd.api+json',
//                     'Content-type':'application/vnd.api+json'};
//     request.get(`${Config.repo.baseUrl}/node/${req.body.nid}?_format=hal_json`,
//                 {auth: req.auth, headers: headers}, function(err, resp, body){
//
//       let responseBody = JSON.parse(body);
//       // Eventually, this will extract the exact node
// eslint-disable-next-line max-len
//       let paragraphUuid = null //responseBody._embedded[`${Config.repo.baseUrl}/rest/relation/node/artifact/field_artifact_representation`][0].uuid[0].value;
//       request.get(`${Config.repo.baseUrl}/rest/session/token`, function(err, response, body){
//           convertToElm(req, res, {paragraph: paragraphUuid, csrf: body});
//       })
//
//     })
//   })
// }
