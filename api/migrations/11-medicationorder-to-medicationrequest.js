/**
 * Migrates artifacts that have a Medication Order:
 * - renames every reference to Medication Order in an artifact to Medication Request
 */
'use strict';

module.exports.id = "medicationorder-to-medicationrequest";

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
  if ((element.id === 'GenericMedicationOrder_vsac')
  || (element.id && element.id.startsWith('GenericMedicationOrder_vsac') && element.type === 'baseElement')
  || (element.type === 'externalCqlElement')) {
    if (element.id === 'GenericMedicationOrder_vsac') {
      element.id = 'GenericMedicationRequest_vsac';
      element.name = 'Medication Request';
    }
    if (element.returnType === 'list_of_medication_orders') {
      element.returnType = 'list_of_medication_requests';
    } else if (element.returnType === 'medication_order') {
      element.returnType = 'medication_request';
    }
    if (element.template === 'GenericMedicationOrder') {
      element.template = 'GenericMedicationRequest';
    }

    const field = element.fields.find(f => f.id === 'medicationOrder');
    if (field) {
      field.id = 'medicationRequest';
      field.type = 'medicationRequest_vsac';
      field.name = 'Medication Request';
    }

    const baseElementField = element.fields.find(f => f.id === 'baseElementReference');
    if (baseElementField && baseElementField.value && (baseElementField.value.type === 'Medication Order')) {
      baseElementField.value.type = 'Medication Request';
    }

    element.modifiers.forEach((modifier) => {
      if (modifier.id === 'ActiveMedicationOrder') {
        modifier.id = 'ActiveMedicationRequest';
        modifier.inputTypes = ['list_of_medication_requests'];
        modifier.returnType = 'list_of_medication_requests';
        modifier.cqlLibraryFunction = 'C3F.ActiveMedicationRequest';
      } else if (modifier.id === 'LookBackMedicationOrder') {
        modifier.id = 'LookBackMedicationRequest';
        modifier.inputTypes = ['list_of_medication_requests'];
        modifier.returnType = 'list_of_medication_requests';
        modifier.cqlLibraryFunction = 'C3F.MedicationRequestLookBack';
      } else if (modifier.id === 'CheckExistence') {
        modifier.inputTypes[
          modifier.inputTypes.findIndex(t => t === 'medication_order')
        ] = 'medication_request';
        modifier.inputTypes[
          modifier.inputTypes.findIndex(t => t === 'list_of_medication_orders')
        ] = 'list_of_medication_requests';
      } else if (modifier.id === 'Count' || modifier.id === 'BooleanExists') {
        modifier.inputTypes[
          modifier.inputTypes.findIndex(t => t === 'list_of_medication_orders')
        ] = 'list_of_medication_requests';
      }
    });
  }

  return element;
}

module.exports.up = function (done) {
  this.log('Migrating: medicationorder-to-medicationrequest');
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
