/**
 * Migrates artifacts that have a booleanParameters field, applying the following changes:
 * - adds { type: 'Boolean' } to each parameter
 * - renames 'booleanParameters' to 'parameters'
 */
'use strict';

module.exports.id = "booleanParameter-to-parameter";

module.exports.up = function (done) {
  this.log('Migrating: booleanParameter-to-parameter');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find({ 'booleanParameters': { $exists: true} }).forEach((artifact) => {
    const p = new Promise((resolve, reject) => {
      // add { type: 'Boolean' } to each parameter object
      const parameters = artifact.booleanParameters.map(p => Object.assign({}, p, { type: 'Boolean' }));
      // update the document, adding the new parameters and removing the old booleanParameters
      coll.updateOne(
        { _id: artifact._id },
        { '$set': { parameters }, '$unset': { booleanParameters: '' } },
        (err, result) => {
          if (err) {
            this.log(`${artifact._id}: error:`, err);
            reject(err);
          } else {
            this.log(`${artifact._id}: added { type: 'Boolean' } to ${parameters.length} parameters; `
              + `renamed 'booleanParameters' to 'parameters'`);
            resolve(result);
          }
        }
      );
    });
    promises.push(p);
  }, (err) => {
    if (err) {
      this.log('Migration Error:', err);
      done(err);
    } else {
      Promise.all(promises)
        .then((results) => {
          this.log(`Migrated ${results.length} artifacts (only applicable artifacts are counted)`);
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
