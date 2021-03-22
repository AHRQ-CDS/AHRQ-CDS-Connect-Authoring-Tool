/**
 * Migrates artifacts that have a parameters field, applying the following changes:
 * - changes each parameter of type 'time' to have value object instead of value string
 *   - Sets 'str' field to existing string
 *   - Sets 'time' field to existing string removing first two characters
 *   - Makes no change if parameter value is null
 */
"use strict";

module.exports.id = "time-parameters-to-object";

module.exports.up = function (done) {
  this.log("Migrating: time-parameters-to-object");
  var coll = this.db.collection("artifacts");
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find({ parameters: { $exists: true } }).forEach(
    (artifact) => {
      const p = new Promise((resolve, reject) => {
        artifact.parameters = artifact.parameters.map((p) => {
          if (p.type === 'time' && p.value && (typeof p.value === 'string')) {
            p.value = { time: p.value.slice(2), str: p.value }
          }
          return p;
        });
        // update the document
        coll.updateOne(
          { _id: artifact._id },
          { $set: artifact },
          (err, result) => {
            if (err) {
              this.log(`${artifact._id}: error:`, err);
              reject(err);
            } else {
              this.log(`${artifact._id}: updated successfully.`);
              resolve(result);
            }
          }
        );
      });
      promises.push(p);
    },
    (err) => {
      if (err) {
        this.log("Migration Error:", err);
        done(err);
      } else {
        Promise.all(promises)
          .then((results) => {
            this.log(
              `Migrated ${results.length} artifacts (only applicable artifacts are counted)`
            );
            done();
          })
          .catch((err) => {
            this.log("Migration Error:", err);
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
