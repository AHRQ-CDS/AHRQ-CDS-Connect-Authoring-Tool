const Artifact = require('../models/artifact');
const Config = require('../../config');
const cqlHandler = require('./cqlHandler');
const request = require('request');
const glob = require('glob');
const fs = require('fs');
const archiver = require('archiver');
const tmp = require('tmp');


module.exports = {
  publish: publish
}

// This is a wrapper because I wanted to split the requests into discrete callbacks
function publish(req, res) {
  convertToElm(req, res);
}

function convertToElm(req, res) {
  let artifact = cqlHandler.buildCQL(req.body.data);
  let repoNid = req.body.nid;

  let path = __dirname + '/../data/library_helpers/';

  // Load all the supplementary CQL files and open file streams to them
  glob(`${path}/*.cql`, function(err, files){
    let fileStreams = files.map(function(f){
      return fs.createReadStream(f);
    })

    let cqlReq = request.post(Config.repo.CQLToElmURL, function(err, resp, body){
      pushToRepo(artifact.toJson(), body, req, res);
    })
    let artifactJson = artifact.toJson();
    let form = cqlReq.form();
    form.append('file', `${artifact.toString()}`, {
      filename: artifactJson.filename,
      contentType: artifactJson.type
    });
    fileStreams.map(function(f){
      form.append('file', f);
    })
  })
}

function pushToRepo(artifact, elm, req, res) {
  let archive = archiver('zip', {zlib : { level : 9 }});
  let fd = tmp.fileSync({postfix: '.zip'});
  let output = fs.createWriteStream(fd.name)
  archive.pipe(output)

  archive.on('error', (err) => {
    res.status(500).send({error : err.message});
  });
  archive.append(artifact.text, {name: `${artifact.filename}.cql`})
  archive.append(elm, { name : `${artifact.filename}.elm` });
  // Add helper Library
  let path = __dirname + '/../data/library_helpers/';
  archive.directory(path, '/');

  archive.finalize();
  output.on('close', function() {
    let base64 = fs.readFileSync(fd.name).toString('base64');
    let headerData = {'Accept':'application/vnd.api+json',
                          'Content-type':'application/vnd.api+json'};
    let date = new Date();
    var payload = {
        "data": {
            "type": "file--zip",
            "attributes": {
            "data": base64,
            "uri": `public://cds/artifact/logic/${date.getUTCFullYear() + 1}-${date.getUTCMonth() + 1}/logic-version-${artifact.version}.zip`
            }
        }
    };
    request.post(`${Config.repo.baseUrl}/jsonapi/file/zip`, payload, function(err,res, body){
      console.log(res);
    });

    res.send(200)
  });
}
