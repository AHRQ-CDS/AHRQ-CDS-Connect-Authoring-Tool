/**
 * Migrates artifacts that have a booleanParameters field, applying the following changes:
 * - adds { type: 'Boolean' } to each parameter
 * - renames 'booleanParameters' to 'parameters'
 */
'use strict';
const ValueSets = require('../data/valueSets');

module.exports.id = "specific-to-generic-elements";

module.exports.up = function (done) {
  this.log('Migrating: specific-to-generic-elements');
  var coll = this.db.collection('artifacts');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  console.log("In new migration")
  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  // coll.find({ 'expTreeInclude': { $exists: true} }).forEach((artifact) => {
  coll.find().forEach((artifact) => {
    const p = new Promise((resolve, reject) => {
      console.log(artifact.name)
      let subelements = artifact.subelements;
      if (!subelements) {
        artifact.subelements = [];
      }
      let inclusionChildInstances = artifact.expTreeInclude ? artifact.expTreeInclude.childInstances : [];
      if (inclusionChildInstances) {
        // TODO maybe make all of this a function because it applies to inclusion, exclusion, subpops, etc
        inclusionChildInstances.forEach(childInstance => { //TODO need to handle nesting

          // Updates for observations
          if (childInstance.extends === 'GenericObservation') {
            // Update suppressedModifiers
            if (childInstance.suppressedModifiers) {
              childInstance.suppressedModifiers = [ 'ConvertToMgPerdL' ];
            }

            let parameter = {};
            if (childInstance.parameters && childInstance.parameters[1]) {
              parameter = childInstance.parameters[1];
            }

            // Update modifiers
            childInstance.modifiers.forEach((modifier, i) => {
              let observationValueSets = ValueSets.observations[parameter.value];
              // TODO Should this be a switch statement?
              if (modifier.id === 'ValueComparisonObservation') {
                if (parameter.value) {
                  modifier.values.unit = observationValueSets.units.code.replace(/'/g, '');
                  modifier.validator.fields.push('unit');
                }
              }
              if (modifier.id === 'ConceptValue') {
                modifier.returnType = 'system_concept';
              }
              if (modifier.id === 'CheckInclusionInVS') {
                let updatedModier = {
                  cqlLibraryFunction: null,
                  cqlTemplate: null,
                  values: {
                    code: null,
                    valueSet: observationValueSets.checkInclusionInVS,
                    qualifier: "value is a code from"
                  },
                  validator: {
                    type: "requiredIfThenOne",
                    fields: [ "qualifier" ],
                    args: [ "valueSet", "code" ]
                  },
                  returnType: "boolean",
                  inputTypes: [ "system_concept" ],
                  name: "Qualifier",
                  id: "Qualifier"
                }
                childInstance.modifiers.splice(i, 1, updatedModier);
              }
              if (modifier.id === 'ConvertToMgPerdL') {
                modifier.id = 'ConvertObservation';
                modifier.name = 'Convert Units';
                modifier.values = {
                  value : "Convert.to_mg_per_dL",
                  templateName : "Convert.to_mg_per_dL"
                };
                modifier.validator = {
                  type : "require",
                  fields : [ "value" ],
                  args : null
                };
                delete modifier.cqlLibraryFunction;
              }
              if (modifier.id === 'CheckExistence') {
                let medicationIndex = modifier.inputTypes.indexOf('medication');
                modifier.inputTypes.splice(medicationIndex, 1, 'medication_order', 'medication_statement');
                let medicationListIndex = modifier.inputTypes.indexOf('list_of_medications');
                modifier.inputTypes.splice(
                  medicationListIndex, 1, 'list_of_medication_orders', 'list_of_medication_statements');
                modifier.inputTypes.push('system_concept');
              }
              if (modifier.id === 'BooleanExists') {
                let medicationListIndex = modifier.inputTypes.indexOf('list_of_medications');
                modifier.inputTypes.splice(
                  medicationListIndex, 1, 'list_of_medication_orders', 'list_of_medication_statements');
              }
            });

            // Update parameters
            if (parameter.type === 'observation') { // TODO is there any case where this isn't true?
              parameter.type = 'observation_vsac';
              let observationValueSets = ValueSets.observations[parameter.value];
              parameter.valueSets = observationValueSets.observations ? observationValueSets.observations : [];
              if (observationValueSets.concepts) {
                // Add concepts on as well
                // TODO TODO Double check that this works with multiple codes (pregnancy, breastfeeding)
                let codes = [];
                observationValueSets.concepts.forEach(concept => concept.codes.forEach(code =>
                    codes.push({
                      code: code.code,
                      codeSystem: code.codeSystem,
                      display: code.display
                    })
                ));
                parameter.codes = codes;
              }
              // TODO TODO handle the concepts case as well.
              // TODO other things to consider: checkInclusionInVS, units, anything else in that ValueSets file and the observation case in cqlhandler
              delete parameter.value;
            }

            // Update template and suppress values
            childInstance.template = 'GenericObservation';
            childInstance.suppress = true;

            // Remove the unneeded flag
            if (childInstance.checkInclusionInVS) {
              delete childInstance.checkInclusionInVS;
            }

            // Change extention to Base
            childInstance.extends = 'Base';
          }
        });
      }
      // console.dir(inclusionChildInstances, {depth: null})
      console.dir(artifact, {depth: null})
      // Update only the old artifact
      // console.log(artifact._id)
      // console.log(artifact._id.toString() === '5b02c8f4493c160f858588d5')
      // if (artifact._id.toString() === '5b17efdebec7e5254a90dc5c') {
      //   console.log("updating")
      //   artifact.expTreeInclude.childInstances = inclusionChildInstances;
      //   console.dir(artifact, {depth: null})
      //   coll.updateOne(
      //     { _id: artifact._id },
      //     { '$set': artifact }, // TODO figure out how to conditinally update element - only really want to update subelements if they've changed. Right now it just resets them
      //     (err, result) => {
      //       if (err) {
      //         console.log("ERROR")
      //         this.log(`${artifact._id}: error:`, err);
      //         reject(err);
      //       } else {
      //         console.log("SUCCESS")
      //         this.log(`${artifact._id} (${artifact.name}): added { subelements: [] } to artifact`);
      //         resolve(result);
      //       }
      //     }
      //   );
      // } else {
      //   done();
      // }
      // update the document, adding the new parameters and removing the old booleanParameters
      // coll.updateOne(
      //   { _id: artifact._id },
      //   { '$set': { subelements } }, // TODO figure out how to conditinally update element - only really want to update subelements if they've changed. Right now it just resets them
      //   (err, result) => {
      //     if (err) {
      //       this.log(`${artifact._id}: error:`, err);
      //       reject(err);
      //     } else {
      //       this.log(`${artifact._id} (${artifact.name}): added { subelements: [] } to artifact`);
      //       resolve(result);
      //     }
      //   }
      // );
      done();
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
