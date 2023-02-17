/**
 * Migrates artifacts that have a Medication Order:
 * - renames every reference to Medication Order in an artifact to Medication Request
 */
'use strict';

module.exports.id = 'cql-element-add-ext-args';

const resolveCQLFieldType = field => {
  // These conversions are everything that we have a picker for.
  // They come directly from src/components/builder/editors directory

  // Note: there is a large overlap between this type map and one stored
  // in the frontend in the file frontend/src/components/builder/editors/utils.js
  // If you update something here, be sure to update it there also.
  const convert = {
    '{urn:hl7-org:elm-types:r1}Integer': 'integer',
    '{urn:hl7-org:elm-types:r1}Boolean': 'boolean',
    '{urn:hl7-org:elm-types:r1}Decimal': 'decimal',
    '{urn:hl7-org:elm-types:r1}Code': 'system_code',
    '{urn:hl7-org:elm-types:r1}Concept': 'system_concept',
    '{urn:hl7-org:elm-types:r1}DateTime': 'datetime',
    '{urn:hl7-org:elm-types:r1}String': 'string',
    '{urn:hl7-org:elm-types:r1}Time': 'time',
    '{urn:hl7-org:elm-types:r1}Quantity': 'system_quantity'
  };
  const convert_interval = {
    '{urn:hl7-org:elm-types:r1}Decimal': 'interval_of_decimal',
    '{urn:hl7-org:elm-types:r1}Quantity': 'interval_of_quantity',
    '{urn:hl7-org:elm-types:r1}DateTime': 'interval_of_datetime',
    '{urn:hl7-org:elm-types:r1}Integer': 'interval_of_integer'
  };

  if (field.operandTypeSpecifier && field.operandTypeSpecifier.pointType)
    return convert_interval[field.operandTypeSpecifier.pointType.resultTypeName];
  return convert[field.operandTypeSpecifier.resultTypeName];
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
  if (element.type === 'externalCqlElement') {
    let referenceFieldIndex = -1;
    if (element.fields) {
      referenceFieldIndex = element.fields.findIndex(field => field.id === 'externalCqlReference');
      if (referenceFieldIndex != -1) {
        if (element.fields[referenceFieldIndex].value && element.fields[referenceFieldIndex].value.arguments) {
          element.fields[referenceFieldIndex].value.arguments = element.fields[referenceFieldIndex].value.arguments.map(
            arg => {
              if (arg.value) {
                return { ...arg, value: { argSource: 'editor', selected: arg.value, type: resolveCQLFieldType(arg) } };
              } else {
                return { ...arg, value: { argSource: 'editor', type: resolveCQLFieldType(arg) } };
              }
            }
          );
        }
      }
    }
  }

  if (element.modifiers) {
    element.modifiers.forEach(modifier => {
      if (modifier.type === 'ExternalModifier') {
        if (modifier.values && modifier.values.value) {
          modifier.values.value = modifier.values.value.map((argValue, index) => {
            if (index === 0) return null;
            if (argValue === null) return { argSource: 'editor', type: resolveCQLFieldType(modifier.arguments[index]) };
            return { argSource: 'editor', selected: argValue, type: resolveCQLFieldType(modifier.arguments[index]) };
          });
        }
      }
    });
  }

  return element;
}

module.exports.up = function (done) {
  this.log('Migrating: cql-element-add-ext-args');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find().forEach(
    artifact => {
      const p = new Promise((resolve, reject) => {
        if (artifact.expTreeInclude) {
          parseTree(artifact.expTreeInclude);
        }
        if (artifact.expTreeExclude) {
          parseTree(artifact.expTreeExclude);
        }
        artifact.subpopulations.forEach(subpopulation => {
          if (!subpopulation.special) {
            parseTree(subpopulation);
          }
        });
        artifact.baseElements.forEach(baseElement => {
          if (baseElement.childInstances) {
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
