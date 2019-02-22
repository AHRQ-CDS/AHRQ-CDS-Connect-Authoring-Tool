/**
 * Migrates artifacts that have requiredIfThenOne validators, applying the following changes:
 * - changes validator fields and args for age range to {
 *  fields: ['unit_of_time', 'min_age', 'max_age'],
 *  args: []
 * }
 * - changes validator fields and args for qualifier to {
 *  fields: ['qualifier', 'valueSet', 'code'],
 *  args: []
 * }
 */
'use strict';

module.exports.id = "requiredIfThenOne-to-fixed";

function parseTree(element) {
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
  if (element.name === 'Age Range') {
    element.validator.fields = ['unit_of_time', 'min_age', 'max_age'];
    element.validator.args = [];
  }

  if (element.modifiers) {
    element.modifiers.forEach((modifier) => {
      if (modifier.name === 'Qualifier') {
        modifier.validator.fields = ['qualifier', 'valueSet', 'code'];
        modifier.validator.args = [];
      }
    });
  }

  return element;
}

module.exports.up = function (done) {
  this.log('Migrating: requiredIfThenOne-to-fixed');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find().forEach((artifact) => {
    const p = new Promise((resolve, reject) => {
      if (artifact.expTreeInclude && artifact.expTreeInclude.childInstances.length) {
        parseTree(artifact.expTreeInclude);
      }
      if (artifact.expTreeExclude && artifact.expTreeExclude.childInstances.length) {
        parseTree(artifact.expTreeExclude);
      }
      artifact.subpopulations.forEach((subpopulation) => {
        if (!subpopulation.special && subpopulation.childInstances && subpopulation.childInstances.length) {
          parseTree(subpopulation);
        }
      });
      artifact.baseElements.forEach((baseElement) => {
        if (baseElement.childInstances && baseElement.childInstances.length) {
          parseTree(baseElement);
        } else {
          parseElement(baseElement);
        }
      });
      
      // Update the artifact with all the changes made.
      coll.updateOne(
        { _id: artifact._id },
        { '$set': artifact },
        (err, result) => {
          if (err) {
            this.log(`${artifact._id}: error:`, err);
            reject(err);
          } else {
            this.log(`${artifact._id} (${artifact.name}): successfully updated.`);
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
