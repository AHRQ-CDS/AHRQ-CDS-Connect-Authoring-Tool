/**
 * Migrates patients that don't have version field, applying the following changes:
 * - adds 'fhirVersion' of 'DSTU2' to 'patients'
 */
'use strict';

module.exports.id = 'patient-to-patientwithversion';

module.exports.up = function (done) {
  this.log('Migrating: patient-to-patientwithversion');
  var coll = this.db.collection('patients');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find({ fhirVersion: { $exists: false } }).forEach(
    patient => {
      const p = new Promise((resolve, reject) => {
        // Update the artifact with all the changes made.
        coll.updateOne({ _id: patient._id }, { $set: { fhirVersion: 'DSTU2' } }, (err, result) => {
          if (err) {
            this.log(`${patient._id}: error:`, err);
            reject(err);
          } else {
            this.log(`${patient._id}: successfully updated.`);
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
            this.log(`Migrated ${results.length} patients (only applicable patients are counted)`);
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
