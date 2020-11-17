/**
 * Migrates all cqllibraries, applying the following changes:
 * - Update all FHIR.Quantity external CQL definitions, parameters, and functions to be
 * reflected as such, instead of incorrectly being labeled as System.Quantity
 */
'use strict';
const _ = require('lodash');

module.exports.id = "libraries-with-quantity-fix";

function updateQuantityTypes(definitions) {
  const updatedDefinitions = definitions;
  updatedDefinitions.forEach(definition => {
    if (definition.resultTypeName === '{http://hl7.org/fhir}Quantity') {
      definition.calculatedReturnType = 'other';
      definition.displayReturnType = 'Other (Quantity)';
    }
    if ((_.get(definition, 'resultTypeSpecifier.type') === 'IntervalTypeSpecifier')
    && (_.get(definition, 'resultTypeSpecifier.pointType.name') === '{http://hl7.org/fhir}Quantity')) {
      definition.calculatedReturnType = 'interval_of_other';
      definition.displayReturnType = 'Interval of Others (Quantity)'
    }
    if ((_.get(definition, 'resultTypeSpecifier.type') === 'ListTypeSpecifier')
    && (_.get(definition, 'resultTypeSpecifier.elementType.name') === '{http://hl7.org/fhir}Quantity')) {
      definition.calculatedReturnType = 'list_of_others';
      definition.displayReturnType = 'List of Others (Quantity)'
    }
    if (definition.operand) {
      definition.operand.forEach((op, index) => {
        if (_.get(op, 'operandTypeSpecifier.resultTypeName') === '{http://hl7.org/fhir}Quantity') {
          definition.argumentTypes[index] = { display: 'Other (Quantity)', calculated: 'other' };
        }
        if ((_.get(op, 'operandTypeSpecifier.resultTypeSpecifier.type') === 'IntervalTypeSpecifier')
        && (_.get(op, 'operandTypeSpecifier.resultTypeSpecifier.pointType.name') === '{http://hl7.org/fhir}Quantity')) {
          definition.argumentTypes[index] = {
            display: 'Interval of Others (Quantity)',
            calculated: 'interval_of_other'
          };
        }
        if ((_.get(op, 'operandTypeSpecifier.resultTypeSpecifier.type') === 'ListTypeSpecifier')
        && (_.get(op, 'operandTypeSpecifier.resultTypeSpecifier.elementType.name') === '{http://hl7.org/fhir}Quantity')) {
          definition.argumentTypes[index] = {
            display: 'List of Others (Quantity)',
            calculated: 'list_of_others'
          };
        }
      });
      definition.inputTypes = [definition.argumentTypes[0].calculated];
    }
  });
  return updatedDefinitions;
}

module.exports.up = function (done) {
  this.log('Migrating: libraries-with-quantity-fix');
  var coll = this.db.collection('cqllibraries');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find().forEach((library) => {
    const p = new Promise((resolve, reject) => {
      library.details.definitions = updateQuantityTypes(library.details.definitions);
      library.details.parameters = updateQuantityTypes(library.details.parameters);
      library.details.functions = updateQuantityTypes(library.details.functions);
      coll.updateOne(
        { _id: library._id },
        { '$set': library },
        (err, result) => {
          if (err) {
            this.log(`${library._id}: error:`, err);
            reject(err);
          } else {
            this.log(`${library._id} (${library.name}): successfully updated.`);
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
          this.log(`Migrated ${results.length} cqllibraries`);
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
