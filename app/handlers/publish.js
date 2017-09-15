const Config = require('../../config');
const cqlHandler = require('./cqlHandler');
const request = require('request');
const glob = require('glob');
const fs = require('fs');
const archiver = require('archiver');
const tmp = require('tmp');
const Busboy = require('busboy');
const Path = require('path');
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

// This is a wrapper because I wanted to split the requests into discrete callbacks
function publish(req, res) {
  convertToElm(req, res, {});
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

function convertToElm(req, res, context) {
  const artifact = cqlHandler.buildCQL(req.body.data);

  const path = `${__dirname}/../data/library_helpers/`;

  // Load all the supplementary CQL files and open file streams to them
  glob(`${path}/*.cql`, (err, files) => {
    const fileStreams = files.map(f => fs.createReadStream(f));

    const cqlReq = request.post(Config.repo.CQLToElmURL, (err2, resp, body) => {
      splitELM(artifact.toJson(), { resp, body }, req, res, context);
    });
    const artifactJson = artifact.toJson();
    const form = cqlReq.form();
    form.append(artifactJson.filename, `${artifact.toString()}`, {
      filename: artifactJson.filename,
      contentType: artifactJson.type
    });
    fileStreams.forEach((f) => {
      form.append(Path.basename(f.path, '.cql'), f);
    });
  });
}

function splitELM(artifact, elm, req, res, context) {
  // Because ELM comes back as a multipart response we use busboy to split it up
  const contentType = elm.resp.headers['Content-Type'] || elm.resp.headers['content-type'];
  const elmFiles = [];

  const bb = new Busboy({ headers: { 'content-type': contentType } })
  .on('field', (fieldname, val) => {
    elmFiles.push({ name: fieldname, content: val });
  })
  .on('finish', () => {
    pushToRepo(artifact, elmFiles, req, res, context);
  })
  .on('error', (err) => {
    console.log('failed', err);
  });

  bb.end(elm.body);
}

function pushToRepo(artifact, elm, req, res, context) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const fd = tmp.fileSync({ postfix: '.zip' });
  const output = fs.createWriteStream(fd.name);
  archive.pipe(output);

  archive.on('error', (err) => {
    res.status(500).send({ error: err.message });
  });
  archive.append(artifact.text, { name: `${artifact.filename}.cql` });

  elm.forEach((e, i) => {
    archive.append(e.content, { name: `${e.name}.json` });
  });
  // Add helper Library
  const path = `${__dirname}/../data/library_helpers/`;
  archive.directory(path, '/');

  archive.finalize();
  output.on('close', () => {
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
