'use strict';

module.exports.id = 'error-statement-conversion-fix';

const fixArtifactErrorStatement = ({ errorStatement }) => {
  if (errorStatement.ifThenClauses.length === 0) {
    return {
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: { label: null, value: null },
          statements: [],
          thenClause: ''
        }
      ],
      elseClause: errorStatement.elseClause || ''
    };
  } else {
    return errorStatement;
  }
};

module.exports.fixArtifactErrorStatement = fixArtifactErrorStatement;

module.exports.up = function (done) {
  this.log('Migrating: error-statement-conversion-fix');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find({ errorStatement: { $exists: true } }).forEach(
    artifact => {
      const p = new Promise((resolve, reject) => {
        artifact.errorStatement = fixArtifactErrorStatement(artifact);

        // update the document
        coll.updateOne({ _id: artifact._id }, { $set: artifact }, (err, result) => {
          if (err) {
            this.log(`${artifact._id}: error:`, err);
            reject(err);
          } else {
            this.log(`${artifact._id}: updated successfully.`);
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
