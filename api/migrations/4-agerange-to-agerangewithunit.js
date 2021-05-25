/**
 * Migrates artifacts that have age range elements, applying the following changes:
 * - adds {
 *  id: 'unit_of_time',
 *  type: 'valueset',
 *  select: 'demographics/units_of_time',
 *  name: 'Unit of Time',
 *  value: { id: 'a', name: 'years', value: "AgeInYears()" }
 * } to end of parameters array
 * - changes validator to {
 *  type: 'requiredIfThenOne',
 *  fields: ['unit_of_time'],
 *  args: ['min_age', 'max_age']
 * }
 */
'use strict';

module.exports.id = 'agerange-to-agerangewithunit';

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
    const unit = {
      id: 'unit_of_time',
      type: 'valueset',
      select: 'demographics/units_of_time',
      name: 'Unit of Time',
      value: { id: 'a', name: 'years', value: 'AgeInYears()' }
    };

    const validator = {
      type: 'requiredIfThenOne',
      fields: ['unit_of_time'],
      args: ['min_age', 'max_age']
    };

    // In case there already was an age range that was updated (which should never happen
    // on production), don't update
    if (element.parameters.length < 4) {
      element.parameters.push(unit);
      element.validator = validator;
    }
  }
  return element;
}

module.exports.up = function (done) {
  this.log('Migrating: agerange-to-agerangewithunit');
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
          parseElement(baseElement);
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
