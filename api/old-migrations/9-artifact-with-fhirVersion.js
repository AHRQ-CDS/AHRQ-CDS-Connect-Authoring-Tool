/**
 * Migrates artifacts without a fhirVersion set to have a default value:
 * - adds { fhirVersion: '' } to all artifacts
 */
'use strict';

module.exports.id = 'artifact-with-fhirVersion';

module.exports.up = function (done) {
  this.log('Migrating: artifact-with-fhirVersion');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find({ fhirVersion: { $exists: false } }).forEach(
    artifact => {
      const p = new Promise((resolve, reject) => {
        // update the document, adding the new fhirVersion key/value
        coll.updateOne({ _id: artifact._id }, { $set: { fhirVersion: '' } }, (err, result) => {
          if (err) {
            this.log(`${artifact._id}: error:`, err);
            reject(err);
          } else {
            this.log(`${artifact._id}: added { fhirVersion: '' }; `);
            resolve(result);
          }
        });
      });
      promises.push(p);
    },
    err => {
      if (err) {
        this.log('Migration Error:', err);
        done(err);
      } else {
        Promise.all(promises)
          .then(results => {
            this.log(`Migrated ${results.length} artifacts (only applicable artifacts are counted)`);
            done();
          })
          .catch(err => {
            this.log('Migration Error:', err);
            done(err);
          });
      }
    }
  );
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  done();
};
