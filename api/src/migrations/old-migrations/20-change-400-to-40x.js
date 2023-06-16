/**
 * Migrates artifacts with fhirVersion 4.0.0 to 4.0.x if they don't have any external libraries
 */
'use strict';

module.exports.id = 'change-400-to-40x';

module.exports.up = function (done) {
  this.log('Migrating: change-400-to-40x');
  let coll = this.db.collection('artifacts');
  let cql = this.db.collection('cqllibraries');
  let migratedCount = 0;

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find({ fhirVersion: { $eq: '4.0.0' } }).forEach(
    artifact => {
      const logger = this.log;

      const p = new Promise((resolve, reject) => {
        resolve(cql.findOne({ linkedArtifactId: { $eq: artifact._id.toString() } }));
      }).then(result => {
        if (result == null) {
          return new Promise((resolve, reject) => {
            coll.updateOne({ _id: artifact._id }, { $set: { fhirVersion: '4.0.x' } }, (err, res) => {
              if (err) {
                logger(`${artifact._id}: error:`, err);
                reject(err);
              } else {
                logger(`Artifact: ${artifact._id}: modified fhirVersion: 4.0.0 -> 4.0.x`);
                migratedCount += 1;
                resolve(res);
              }
            });
          });
        }
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
            this.log(`Migrated ${migratedCount} artifacts (only applicable artifacts are counted)`);
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
  done();
};
