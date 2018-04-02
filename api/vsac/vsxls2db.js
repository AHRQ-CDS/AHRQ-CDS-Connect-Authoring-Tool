/**
 * This is a simple command-line class for refreshing the searchable VSAC value set database.
 * Usage: node vsxls2db.js [username] [password]
 * If username/password are passed in, then a new spreadsheet will be downloaded from VSAC.
 * If no username/password is passed in, the spreadsheet at the configured location will be used.
 */
const process = require('process');
const fs = require('fs-extra');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const XLSX = require('xlsx');
const request = require('request');
const config = require('../config');
const ValueSet = require('../models/valueSet');
const ValueSetLog = require('../models/valueSetLog');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function downloadVSXLS(user, pass, file, callback) {
  // They provided a username / password, so attempt to download the VSAC XLS
  console.log(`Downloading XLS from VSAC using basic auth w/ user '${user}'.`);

  if (fs.existsSync(file)) {
    fs.copyFileSync(file, file.replace('.xls', `-replaced-${(new Date()).toISOString()}.xls`));
  }

  // Build up the request to get the XLS
  const options = {
    method: 'GET',
    url: 'https://vsac.nlm.nih.gov/vsac/pc/vs/report/excel/summaries',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Authorization': `Basic ${new Buffer(`${user}:${pass}`).toString('base64')}`
    },
    // eslint-disable-next-line max-len
    body: '{"query":"***ListAll***","cms":null,"category":null,"developers":null,"codeSystems":null,"program":"all","releaseLabel":"Latest"}'
  };
  // Note: request-promise-native discourages use of pipe, so we must use normal request instead
  request.post(options)
    .on('error', callback)
    .pipe(fs.createWriteStream(file))
    .on('finish', callback);
}

function storeVSXLS(file, callback) {
  // First parse the value sets from the excel file
  let workbook;
  try {
    workbook = XLSX.readFile(file);
  } catch (e) {
    return(callback(new Error(`Failed to read value sets file: ${file} (${e.message}).`)));
  }
  const output = XLSX.utils.sheet_to_json(
    workbook.Sheets['Value Sets'],
    {
      range: 2,
      header: ['name', 'codeSystem', 'type', 'steward', 'oid', 'codeCount']
    }
  );

  if (output.length === 0) {
    return(callback(new Error('Could not extract any value sets from file.  Aborting value set import.')));
  }

  output.forEach(vs => {
    vs.codeSystem = vs.codeSystem ? vs.codeSystem.split(/\s+/) : [];
    vs.codeCount = vs.codeCount ? parseInt(vs.codeCount) : 0;
  });

  // Then drop the old value sets from the DB and insert the new

  const fileDate = new Date(fs.statSync(file).mtime);
  const log = { date: new Date(), file, fileDate, count: 0 };

  let db;
  mongoose.connect(config.get('mongo.url'), { useMongoClient: true })
    .then(connectedDB => db = connectedDB)
    .then(() => ValueSet.collection.drop())
    .then(() => ValueSet.insertMany(output))
    .then(docs => {
      log.count = docs.length;
      if (docs.length !== output.length) {
        log.error = `WARNING: Attempted to insert ${output.length} items, but actually inserted ${docs.length} items.`;
      }
    })
    .catch(err => log.error = err.toString())
    .then(() => ValueSetLog.create(log))
    .catch(err => console.log(err.toString()))
    .then(() => {
      console.log(`Loaded file: ${file} (updated: ${log.fileDate})`);
      console.log(`Inserted ${log.count} items.`);
      if (log.error) {
        return(callback(new Error(log.error)));
      }
      if (db) db.close();
      return callback();
    });
}

const file = config.get('valueSets.localFile');
if (process.argv.length < 4) {
  console.log(`No username/password provided.  Using stored XLS at ${file}.`);
  console.log('To automatically download XLS before storing: node vsxls2db.js vsacUser vsacPassword');
  storeVSXLS(file, (err) => {
    if (err) {
      console.error(err);
    }
  });
} else {
  // They provided a username / password, so attempt to download the VSAC XLS
  const [user, pass] = process.argv.slice(2);
  downloadVSXLS(user, pass, file, (err) => {
    if (err) {
      console.error(err);
    } else {
      storeVSXLS(file, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  });

}

