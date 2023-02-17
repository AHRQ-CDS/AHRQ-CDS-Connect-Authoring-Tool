/**
 * Migrates artifacts that have a subelement field, applying the following changes:
 * - renames 'subelements' to 'baseElements'
 */
'use strict';

module.exports.id = 'subelement-to-baseElement';

module.exports.up = function (done) {
  this.log('Migrating: subelement-to-baseElement');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find({ subelements: { $exists: true } }).forEach(
    artifact => {
      const p = new Promise((resolve, reject) => {
        const baseElements = artifact.subelements;
        // update the document, adding the new baseElements and removing the old subelements
        coll.updateOne(
          { _id: artifact._id },
          { $set: { baseElements }, $unset: { subelements: '' } },
          (err, result) => {
            if (err) {
              this.log(`${artifact._id}: error:`, err);
              reject(err);
            } else {
              this.log(`${artifact._id}: updated ${baseElements.length} subelements to 'baseElements;`);
              resolve(result);
            }
          }
        );
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
