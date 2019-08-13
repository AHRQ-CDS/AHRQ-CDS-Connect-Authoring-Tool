/**
 * Migrates artifacts that have a parameter array on template instances, applying the following changes:
 * - renames 'parameters' to 'fields'
 */
'use strict';

module.exports.id = "parameters-to-fields";

function parseTree(element) {
  // Replace 'parameters' with 'fields'
  if (element.parameters) {
    const fields = element.parameters;
    element.fields = fields;
    delete element.parameters;
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

// Replace 'parameters' with 'fields'
function parseElement(element) {
  if (element.parameters) {
    const fields = element.parameters;
    element.fields = fields;
    delete element.parameters;
  }
  return element;
}

module.exports.up = function (done) {
  this.log('Migrating: parameters-to-fields');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find().forEach((artifact) => {
    const p = new Promise((resolve, reject) => {
      if (artifact.expTreeInclude) {
        parseTree(artifact.expTreeInclude);
      }
      if (artifact.expTreeExclude) {
        parseTree(artifact.expTreeExclude);
      }
      artifact.subpopulations.forEach((subpopulation) => {
        if (!subpopulation.special) {
          parseTree(subpopulation);
        }
      });
      artifact.baseElements.forEach((baseElement) => {
        if (baseElement.childInstances) {
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

