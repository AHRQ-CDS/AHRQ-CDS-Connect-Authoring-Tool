/**
 * Migrates artifacts without a fhirVersion set to have a default value:
 * - adds { fhirVersion: '' } to all artifacts
 */
'use strict';

module.exports.id = "artifact-with-externalFhirVersion";

module.exports.up = function (done) {
  this.log('Migrating: artifact-with-externalFhirVersion');
  let coll = this.db.collection('artifacts');
  let cql = this.db.collection('cqllibraries');
  let migratedCount = 0;
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find({ 'fhirVersion': { $eq: '' } }).forEach((artifact) => {
    const logger = this.log;

    const p = new Promise((resolve,reject) => {
      resolve(cql.findOne({'linkedArtifactId': {$eq: artifact._id.toString()}}));
    }).then(result => {
      if(result) {
        //keeping the check for the fhirVersion separate as we want to tell if there are
        //external libraries without a fhirVersion, just in case.
        if (result.fhirVersion) {
          return new Promise((resolve, reject) => {
            coll.updateOne(
              {_id: artifact._id},
              {'$set': {fhirVersion: result.fhirVersion}},
              (err, res) => {
                if (err) {
                  logger(`${artifact._id}: error:`, err);
                  reject(err);
                } else {
                  logger(`Artifact: ${artifact._id}: added fhirVersion: ${result.fhirVersion }; `);
                  migratedCount += 1;
                  resolve(res);
                }
              });
          });
        } else {
          logger(`External CQL with ID ${result._id} is associated with 
            Artifact ${artifact._id} but no fhirVersion associated with it`);
        }
      }

    });

    promises.push(p);
  }, (err) => {
    if (err) {
      this.log('Migration Error:', err);
      done(err);
    } else {
      Promise.all(promises)
        .then((results) => {
          this.log(`Migrated ${migratedCount} artifacts (only applicable artifacts are counted)`);
          done();
        })
        .catch((err) => {
          this.log('Migration Error:', err);
          done(err);
        });
    }
  });
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  done();
};
