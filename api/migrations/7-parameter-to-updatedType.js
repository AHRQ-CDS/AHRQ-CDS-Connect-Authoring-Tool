/**
 * Migrates artifacts that have a parameters field, applying the following changes:
 * - changes type of each parameter based on mapping
 */
'use strict';

module.exports.id = "parameter-to-updatedType";

const parameterTypeMap = {
  'Boolean': 'boolean',
  'Code': 'system_code',
  'Concept': 'system_concept',
  'Integer': 'integer',
  'DateTime': 'datetime',
  'Decimal': 'decimal',
  'Quantity': 'system_quantity',
  'String': 'string',
  'Time': 'time',
  'Interval<Integer>': 'interval_of_integer',
  'Interval<DateTime>': 'interval_of_datetime',
  'Interval<Decimal>': 'interval_of_decimal',
  'Interval<Quantity>': 'interval_of_quantity'
};

const parameterReturnTypeMap = {
  'boolean': 'boolean',
  'code': 'system_code',
  'concept': 'system_concept',
  'integer': 'integer',
  'date time': 'datetime',
  'decimal': 'decimal',
  'quantity': 'system_quantity',
  'string': 'string',
  'time': 'time',
  'interval integer': 'interval_of_integer',
  'interval date time': 'interval_of_datetime',
  'interval decimal': 'interval_of_decimal',
  'interval quantity': 'interval_of_quantity'
};

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
  if (element.type === 'Parameter' && element.returnType) {
    element.returnType = parameterReturnTypeMap[element.returnType];
  }

  return element;
}

module.exports.up = function (done) {
  this.log('Migrating: parameter-to-updatedType');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find().forEach((artifact) => {
    const p = new Promise((resolve, reject) => {
      artifact.parameters.forEach(p => p.type = parameterTypeMap[p.type]);

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
