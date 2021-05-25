/**
 * Migrates artifacts that don't have comment fields, applying the following changes:
 * - adds { id: 'comment', type: 'textarea', name: 'Comment' } to parameters array on elements
 */
'use strict';

module.exports.id = 'nocomments-to-comments';

function parseTree(element) {
  const commentParameterIndex = element.parameters.findIndex(param => param.id === 'comment');
  if (commentParameterIndex === -1) {
    element.parameters.push({ id: 'comment', type: 'textarea', name: 'Comment' });
  }

  let children = element.childInstances ? element.childInstances : [];
  children = children.map((child, i) => {
    if ('childInstances' in child) {
      return parseTree(child);
    } else {
      return parseElement(child);
    }
  });
  element.childInstances = children;
  return element;
}

function parseElement(element) {
  const commentParameterIndex = element.parameters.findIndex(param => param.id === 'comment');
  if (commentParameterIndex === -1) {
    element.parameters.push({ id: 'comment', type: 'textarea', name: 'Comment' });
  }

  return element;
}

module.exports.up = function (done) {
  this.log('Migrating: nocomments-to-comments');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find().forEach(
    artifact => {
      const p = new Promise((resolve, reject) => {
        if (artifact.expTreeInclude && artifact.expTreeInclude.childInstances.length) {
          parseTree(artifact.expTreeInclude);
        }
        if (artifact.expTreeExclude && artifact.expTreeExclude.childInstances.length) {
          parseTree(artifact.expTreeExclude);
        }
        artifact.subpopulations.forEach(subpopulation => {
          if (!subpopulation.special && subpopulation.childInstances && subpopulation.childInstances.length) {
            parseTree(subpopulation);
          }
        });
        artifact.baseElements.forEach(baseElement => {
          if (baseElement.childInstances && baseElement.childInstances.length) {
            parseTree(baseElement);
          } else {
            parseElement(baseElement);
          }
        });

        // Update the artifact with all the changes made.
        coll.updateOne({ _id: artifact._id }, { $set: artifact }, (err, result) => {
          if (err) {
            this.log(`${artifact._id}: error:`, err);
            reject(err);
          } else {
            this.log(`${artifact._id} (${artifact.name}): successfully updated.`);
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
