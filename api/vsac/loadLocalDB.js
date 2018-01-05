const fs = require('fs');
const process = require('process');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const XLSX = require('xlsx');
const config = require('../config');
const ValueSet = require('../models/valueSet');
const ValueSetLog = require('../models/valueSetLog');

// First parse the value sets from the excel file

const file = config.get('valueSets.localFile');
let workbook;
try {
  workbook = XLSX.readFile(file);
} catch (e) {
  console.error(`Failed to read value sets file: ${file} (${e.message}).`);
  process.exit(1);
}
const output = XLSX.utils.sheet_to_json(
  workbook.Sheets['Value Sets'],
  {
    range: 2,
    header: ['name', 'codeSystem', 'type', 'steward', 'oid', 'codeCount']
  }
);

if (output.length === 0) {
  console.error('Could not extract any value sets from file.  Aborting value set import.');
  process.exit(1);
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
      console.log(log.error);
    }
    if (db) db.close();
  });



