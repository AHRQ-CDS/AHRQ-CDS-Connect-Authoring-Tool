/**
 * Migrates artifacts that have a parameters field, applying the following changes:
 * - changes type of each parameter based on mapping, or adds type 'boolean' if no type
 * - changes returnType of each parameter use based on mapping
 * - adds usedBy prop to parameter storing array of uniqueId of its references
 * - adds parameterReference parameter to elements using parameters
 * - changes case of parameter use id to paramCase
 * - changes value.type of base elements to 'parameter' if they use a parameter
 */
'use strict';

const changeCase = require('change-case');

module.exports.id = 'parameter-to-updatedType';

const parameterTypeMap = {
  Boolean: 'boolean',
  Code: 'system_code',
  Concept: 'system_concept',
  Integer: 'integer',
  DateTime: 'datetime',
  Decimal: 'decimal',
  Quantity: 'system_quantity',
  String: 'string',
  Time: 'time',
  'Interval<Integer>': 'interval_of_integer',
  'Interval<DateTime>': 'interval_of_datetime',
  'Interval<Decimal>': 'interval_of_decimal',
  'Interval<Quantity>': 'interval_of_quantity'
};

const parameterReturnTypeMap = {
  boolean: 'boolean',
  code: 'system_code',
  concept: 'system_concept',
  integer: 'integer',
  'date time': 'datetime',
  decimal: 'decimal',
  quantity: 'system_quantity',
  string: 'string',
  time: 'time',
  'interval integer': 'interval_of_integer',
  'interval date time': 'interval_of_datetime',
  'interval decimal': 'interval_of_decimal',
  'interval quantity': 'interval_of_quantity'
};

function parseTree(element, parameterUsedByMap, parameters, baseElements) {
  let children = element.childInstances ? element.childInstances : [];
  children = children.map((child, i) => {
    if ('childInstances' in child) {
      return parseTree(child, parameterUsedByMap, parameters, baseElements);
    } else {
      return parseElement(child, parameterUsedByMap, parameters, baseElements);
    }
  });
  element.childInstances = children;
  return element;
}

function parseElement(element, parameterUsedByMap, parameters, baseElements) {
  if (element.type === 'parameter') {
    element.id = changeCase['paramCase'](element.name);

    if (element.returnType) {
      element.returnType = parameterReturnTypeMap[element.returnType];
    }

    element.parameters.push({
      id: 'parameterReference',
      name: 'reference',
      static: true,
      type: 'reference',
      value: {
        id: parameters.find(p => changeCase['paramCase'](p.name) === element.id)
          ? parameters.find(p => changeCase['paramCase'](p.name) === element.id).uniqueId
          : ''
      }
    });

    element.parameters.push({ id: 'comment', type: 'textarea', name: 'Comment', value: '' });

    element.extends = undefined;
    element.template = 'GenericStatement';

    if (!parameterUsedByMap[element.id]) {
      parameterUsedByMap[element.id] = [];
    }
    parameterUsedByMap[element.id].push(element.uniqueId);
  }

  if (element.type === 'baseElement') {
    const originalBaseElement = getOriginalBaseElement(element, baseElements);

    if (originalBaseElement.type === 'parameter') {
      if (element.parameters.find(e => e.id === 'baseElementReference')) {
        element.parameters.find(e => e.id === 'baseElementReference').value.type = 'parameter';
      }
    }
  }

  return element;
}

function getOriginalBaseElement(instance, baseElements) {
  const referenceParameter = instance.parameters.find(param => param.type === 'reference');
  if (referenceParameter) {
    if (referenceParameter.id === 'parameterReference') {
      return instance;
    }
    const baseElementReferenced = baseElements.find(element => element.uniqueId === referenceParameter.value.id);
    return getOriginalBaseElement(baseElementReferenced, baseElements);
  }
  return instance;
}

module.exports.up = function (done) {
  this.log('Migrating: parameter-to-updatedType');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find().forEach(
    artifact => {
      let parameterUsedByMap = {};

      const p = new Promise((resolve, reject) => {
        if (artifact.expTreeInclude && artifact.expTreeInclude.childInstances.length) {
          parseTree(artifact.expTreeInclude, parameterUsedByMap, artifact.parameters, artifact.baseElements);
        }
        if (artifact.expTreeExclude && artifact.expTreeExclude.childInstances.length) {
          parseTree(artifact.expTreeExclude, parameterUsedByMap, artifact.parameters, artifact.baseElements);
        }
        artifact.subpopulations.forEach(subpopulation => {
          if (!subpopulation.special && subpopulation.childInstances && subpopulation.childInstances.length) {
            parseTree(subpopulation, parameterUsedByMap, artifact.parameters, artifact.baseElements);
          }
        });
        artifact.baseElements.forEach(baseElement => {
          if (baseElement.childInstances && baseElement.childInstances.length) {
            parseTree(baseElement, parameterUsedByMap, artifact.parameters, artifact.baseElements);
          } else {
            parseElement(baseElement, parameterUsedByMap, artifact.parameters, artifact.baseElements);
          }
        });

        artifact.parameters.forEach(p => {
          p.type = parameterTypeMap[p.type] || 'boolean';
          p.usedBy = parameterUsedByMap[changeCase['paramCase'](p.name)]
            ? parameterUsedByMap[changeCase['paramCase'](p.name)]
            : [];

          if (!p.comment) p.comment = null;
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
