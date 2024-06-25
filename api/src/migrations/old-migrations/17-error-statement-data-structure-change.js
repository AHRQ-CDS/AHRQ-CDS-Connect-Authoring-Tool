'use strict';

// NOTE: This dependency was removed from the api module in Jun 2024.
// If this migration needs to be run, first run `npm install uuid`
// to add the dependency back, and then uncomment the line below.
// const { v4: uuid } = require('uuid');

module.exports.id = 'error-statement-data-structure-change';

const convertNestedStatement = ({ condition, child, thenClause }) => ({
  ifCondition: condition,
  statements: child
    ? [
        {
          // eslint-disable-next-line no-undef
          id: uuid(),
          ifThenClauses: child.statements.map(statement => convertNestedStatement(statement)),
          elseClause: child.elseClause || ''
        }
      ]
    : [],
  thenClause: thenClause || ''
});

const convertArtifactErrorStatement = ({ errorStatement }) => ({
  id: 'root',
  ifThenClauses:
    errorStatement.statements.length > 0
      ? errorStatement.statements.map(statement => convertNestedStatement(statement))
      : [
          {
            ifCondition: { label: null, value: null },
            statements: [],
            thenClause: ''
          }
        ],
  elseClause: errorStatement.elseClause || ''
});

module.exports.convertArtifactErrorStatement = convertArtifactErrorStatement;

module.exports.up = function (done) {
  this.log('Migrating: error-statement-data-structure-change');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find({ errorStatement: { $exists: true } }).forEach(
    artifact => {
      const p = new Promise((resolve, reject) => {
        artifact.errorStatement = convertArtifactErrorStatement(artifact);

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
