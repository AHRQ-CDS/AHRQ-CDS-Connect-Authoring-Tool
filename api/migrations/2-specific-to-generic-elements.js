/**
 * Migrates artifacts that have a booleanParameters field, applying the following changes:
 * - adds { type: 'Boolean' } to each parameter
 * - renames 'booleanParameters' to 'parameters'
 */
'use strict';
const ValueSets = require('../data/valueSets');

module.exports.id = "specific-to-generic-elements";

function updateCheckExistenceModifier(modifier) {
  let medicationIndex = modifier.inputTypes.indexOf('medication');
  modifier.inputTypes.splice(medicationIndex, 1, 'medication_order', 'medication_statement');
  let medicationListIndex = modifier.inputTypes.indexOf('list_of_medications');
  modifier.inputTypes.splice(medicationListIndex, 1, 'list_of_medication_orders', 'list_of_medication_statements');
  modifier.inputTypes.push('system_concept');
  return modifier;
}

function updateBooleanExistsModifier(modifier) {
  let medicationListIndex = modifier.inputTypes.indexOf('list_of_medications');
  modifier.inputTypes.splice(medicationListIndex, 1, 'list_of_medication_orders', 'list_of_medication_statements');
  return modifier;
}

// Returns an array of elements to be added to the artifact.
// The original element being manipulated is the first entry in the array. Any additional elements needed will follow.
function transformElement(element) {
  let childInstance = element;
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
    if (!childInstance.modifiers) { childInstance.modifiers = []; }
    childInstance.modifiers.forEach((modifierParam, i) => {
      let modifier = modifierParam;
      let observationValueSets = ValueSets.observations[parameter.value];
      // TODO Should this be a switch statement?
      if (modifier.id === 'ValueComparisonObservation') {
        if (parameter.value) {
          modifier.values.unit = observationValueSets.units.code.replace(/'/g, '');
          if (modifier.validator) modifier.validator.fields.push('unit');
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
        modifier = updateCheckExistenceModifier(modifier); //TODO confirm this still works as expected
      }
      if (modifier.id === 'BooleanExists') {
        modifier = updateBooleanExistsModifier(modifier);
      }
    });
  
    // Update parameters
    if (parameter.type === 'observation') {
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
      // TODO other things to consider: checkInclusionInVS, units, anything else in that ValueSets file and the
      //observation case in cqlhandler
      delete parameter.value;
    }
  
    // Update template and suppress values
    childInstance.template = 'GenericObservation';
    childInstance.suppress = true;
    childInstance.name = 'Observation'; //TODO did not test this
    childInstance.id = 'GenericObservation_vsac';
  
    // Remove the unneeded flag
    if (childInstance.checkInclusionInVS) {
      delete childInstance.checkInclusionInVS;
    }
  
    // Change extention to Base
    childInstance.extends = 'Base';

    return [ childInstance ];
  } else if (childInstance.extends === 'GenericMedication') { // TODO Can the cases be consolidated at all?
    // Copy is for adding a parallel MedicationStatement. Original will become a MedicationOrder.
    const childInstanceForStatement = JSON.parse(JSON.stringify(childInstance));
    childInstanceForStatement.uniqueId = `${childInstance.uniqueId}-a`;

    let parameter = {};
    let parameterForStatement = {};
    if (childInstance.parameters && childInstance.parameters[0]) {
      childInstance.parameters[0].value = `${childInstance.parameters[0].value} Order`;
      childInstanceForStatement.parameters[0].value = `${childInstanceForStatement.parameters[0].value} Statement`;
    }
    if (childInstance.parameters && childInstance.parameters[1]) {
      parameter = childInstance.parameters[1];
      parameterForStatement = childInstanceForStatement.parameters[1];
    }

    // Update modifiers
    if (!childInstance.modifiers) { childInstance.modifiers = []; }
    let modifierIndexesToRemove = [];
    childInstance.modifiers.forEach((modifierParam, i) => {
      let modifier = modifierParam; // TODO This was to fix ESLint error. Better way?
      let modifierForStatement = childInstanceForStatement.modifiers[i];
      if (modifier.id === 'ActiveMedication') {
        modifier.id = 'ActiveMedicationOrder';
        modifierForStatement.id = 'ActiveMedicationStatement';

        modifier.inputTypes = [ 'list_of_medication_orders' ];
        modifierForStatement.inputTypes = [ 'list_of_medication_statements' ];

        modifier.returnType = 'list_of_medication_orders';
        modifierForStatement.returnType = 'list_of_medication_statements';

        modifier.cqlLibraryFunction = 'C3F.ActiveMedicationOrder';
        modifierForStatement.cqlLibraryFunction = 'C3F.ActiveMedicationStatement';
      }
      if (modifier.id === 'CheckExistence') {
        modifier = updateCheckExistenceModifier(modifier);
        modifierForStatement = updateCheckExistenceModifier(modifierForStatement);
      }
      if (modifier.id === 'BooleanExists') {
        modifier = updateBooleanExistsModifier(modifier);
        modifierForStatement = updateBooleanExistsModifier(modifierForStatement);
      }
      if (modifier.id === 'LookBackMedication') {
        modifier.id = 'LookBackMedicationOrder';
        modifierForStatement.id = 'LookBackMedicationStatement';

        modifier.inputTypes = [ 'list_of_medication_orders' ];  
        modifierForStatement.inputTypes = [ 'list_of_medication_statements' ];  

        modifier.returnType = 'list_of_medication_orders';
        modifierForStatement.returnType = 'list_of_medication_statements';

        modifier.cqlLibraryFunction = 'C3F.MedicationOrderLookBack';
        modifierForStatement.cqlLibraryFunction = 'C3F.MedicationStatementLookBack';
      }
      if (modifier.id === 'MostRecentMedication') {
        modifierIndexesToRemove.push(i);
      }
    });
    // Due to the fact that only one artifact has only one element with this modifier, hardcoded [0] is okay.
    childInstance.modifiers.splice(modifierIndexesToRemove[0], 1);
    childInstanceForStatement.modifiers.splice(modifierIndexesToRemove[0], 1);

    if (parameter.type === 'medication') {
      parameter.type = 'medicationOrder_vsac';
      parameterForStatement.type = 'medicationStatement_vsac';

      parameter.name = 'Medication Order';
      parameterForStatement.name = 'Medication Statement';

      let medicationValueSets = ValueSets.medications[parameter.value];
      parameter.valueSets = medicationValueSets.medications ? medicationValueSets.medications : [];
      parameterForStatement.valueSets = medicationValueSets.medications ? medicationValueSets.medications : [];
      
      delete parameter.value;
    }

    // Update template, returnType, name, and suppress values
    childInstance.template = 'GenericMedicationOrder';
    childInstanceForStatement.template = 'GenericMedicationStatement';
    childInstance.suppress = true;
    childInstanceForStatement.suppress = true;
    childInstance.returnType = 'list_of_medication_orders';
    childInstanceForStatement.returnType = 'list_of_medication_statements';
    childInstance.name = 'Medication Order';
    childInstanceForStatement.name = 'Medication Statement';
    childInstance.id = 'GenericMedicationOrder_vsac';
    childInstanceForStatement.id = 'GenericMedicationStatement_vsac';

    // Change extention to Base
    childInstance.extends = 'Base';
    childInstanceForStatement.extends = 'Base';

    return [ childInstance, childInstanceForStatement ];
  } else if (childInstance.extends === 'GenericAllergyIntolerance') {
    let parameter = {};
    if (childInstance.parameters && childInstance.parameters[1]) {
      parameter = childInstance.parameters[1];
    }

    // Update modifiers
    if (!childInstance.modifiers) { childInstance.modifiers = []; }
    childInstance.modifiers.forEach((modifierParam, i) => {
      let modifier = modifierParam;
      if (modifier.id === 'CheckExistence') {
        modifier = updateCheckExistenceModifier(modifier);
      }
      if (modifier.id === 'BooleanExists') {
        modifier = updateBooleanExistsModifier(modifier);
      }
    });

    // Update parameters
    if (parameter.type === 'allergyIntolerance') {
      parameter.type = 'allergyIntolerance_vsac';
      let allergyIntoleranceValueSets = ValueSets.allergyIntolerances[parameter.value];
      parameter.valueSets = allergyIntoleranceValueSets.allergyIntolerances
        ? allergyIntoleranceValueSets.allergyIntolerances : [];
      delete parameter.value;
    }

    // Update template and suppress values
    childInstance.template = 'GenericAllergyIntolerance';
    childInstance.suppress = true;
    childInstance.name = 'Allergy Intolerance';
    childInstance.id = 'GenericAllergyIntolerance_vsac';

    // Change extention to Base
    childInstance.extends = 'Base';
    return [childInstance];
  } else if (childInstance.extends === 'GenericCondition') {
    // TODO Suppressed modifiers?
    let parameter = {};
    if (childInstance.parameters && childInstance.parameters[1]) {
      parameter = childInstance.parameters[1];
    }

    // Update modifiers
    if (!childInstance.modifiers) { childInstance.modifiers = []; }
    childInstance.modifiers.forEach((modifierParam, i) => {
      let modifier = modifierParam;
      if (modifier.id === 'CheckExistence') {
        modifier = updateCheckExistenceModifier(modifier);
      }
      if (modifier.id === 'BooleanExists') {
        modifier = updateBooleanExistsModifier(modifier);
      }
    });

    // Update parameters
    if (parameter.type === 'condition') {
      parameter.type = 'condition_vsac';
      let conditionValueSets = ValueSets.conditions[parameter.value];
      parameter.valueSets = conditionValueSets.conditions ? conditionValueSets.conditions : [];

      if (conditionValueSets.concepts) {
        let codes = [];
        conditionValueSets.concepts.forEach(concept => concept.codes.forEach(code =>
          codes.push({
            code: code.code,
            codeSystem: code.codeSystem,
            display: code.display
          })
        ));
        parameter.codes = codes;
      }

      delete parameter.value;
    }

    // Update template and suppress values
    childInstance.template = 'GenericCondition';
    childInstance.suppress = true;
    childInstance.name = 'Condition';
    childInstance.id = 'GenericCondition_vsac'; // TODO is there any benefit to keeping the old id?

    // Change extention to Base
    childInstance.extends = 'Base';
    return [childInstance];
  } else if (childInstance.extends === 'GenericEncounter') {
    let parameter = {};
    if (childInstance.parameters && childInstance.parameters[1]) {
      parameter = childInstance.parameters[1];
    }

    // Update modifiers
    if (!childInstance.modifiers) { childInstance.modifiers = []; }
    childInstance.modifiers.forEach((modifierParam, i) => {
      let modifier = modifierParam;
      if (modifier.id === 'CheckExistence') {
        modifier = updateCheckExistenceModifier(modifier);
      }
      if (modifier.id === 'BooleanExists') {
        modifier = updateBooleanExistsModifier(modifier);
      }
    });

    // Update parameters
    if (parameter.type === 'encounter') {
      parameter.type = 'encounter_vsac';
      let encounterValueSets = ValueSets.encounters[parameter.value];
      parameter.valueSets = encounterValueSets.encounters ? encounterValueSets.encounters : [];
      delete parameter.value;
    }

    // Update template and suppress values
    childInstance.template = 'GenericEncounter';
    childInstance.suppress = true;
    childInstance.name = 'Encounter';
    childInstance.id = 'GenericEncounter_vsac';

    // Change extention to Base
    childInstance.extends = 'Base';
    return [childInstance];
  } else if (childInstance.extends === 'GenericProcedure') {
    let parameter = {};
    if (childInstance.parameters && childInstance.parameters[1]) {
      parameter = childInstance.parameters[1];
    }

    // Update modifiers
    if (!childInstance.modifiers) { childInstance.modifiers = []; }
    childInstance.modifiers.forEach((modifierParam, i) => {
      let modifier = modifierParam;
      if (modifier.id === 'CheckExistence') {
        modifier = updateCheckExistenceModifier(modifier);
      }
      if (modifier.id === 'BooleanExists') {
        modifier = updateBooleanExistsModifier(modifier);
      }
    });

    // Update parameters
    if (parameter.type === 'procedure') {
      parameter.type = 'procedure_vsac';
      let procedureValueSets = ValueSets.procedures[parameter.value];
      parameter.valueSets = procedureValueSets.procedures ? procedureValueSets.procedures : [];
      delete parameter.value;
    }

    // Update template and suppress values
    childInstance.template = 'GenericProcedure';
    childInstance.suppress = true;
    childInstance.name = 'Procedure';
    childInstance.id = 'GenericProcedure_vsac';

    // Change extention to Base
    childInstance.extends = 'Base';
    return [childInstance];
  }
  return [ childInstance ];
}

function parseTree(element) {
  const children = element.childInstances ? element.childInstances : [];
  let newChildrenToAdd = [];
  children.forEach((child, i) => {
    if ('childInstances' in child) {
      parseTree(child);
    } else if (child.type === 'element') {
      // Transform the elements and modifiers as necessary.
      // Original element will be the first entry in the array returned. Any additional elements to be added follow.
      let transformedElements = transformElement(child);
      if (transformedElements.length > 1) {
        // Ex: Medications were split, so add in an additional child to handle MedicationOrder and MedicationStatement
        newChildrenToAdd = newChildrenToAdd.concat(transformedElements.slice(1));
      }
    }
  });
  element.childInstances = children.concat(newChildrenToAdd);
}

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
      if (artifact._id.toString() === '5b2ce2d683a3210faa340cdc') {
      let subelements = artifact.subelements;
      if (!subelements) {
        artifact.subelements = [];
      }
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
      // TODO Shouldn't need subelements since thats not in master/prod yet
      console.dir(artifact, {depth: null})
      // Update only the old artifact
      // console.log(artifact._id)
      // console.log(artifact._id.toString() === '5b2ce2d683a3210faa340cdc')
      // if (artifact._id.toString() === '5b2ce2d683a3210faa340cdc') {
      //   console.log("updating")
      //   // artifact.expTreeInclude.childInstances = [];
      //   console.dir(artifact, {depth: null})
      //   coll.updateOne(
      //     { _id: artifact._id },
      //     { '$set': artifact },
      //     (err, result) => {
      //       console.log("HERE")
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
      //   console.log("ELSE")
      //   // done();
      // }
      // update the document, adding the new parameters and removing the old booleanParameters
      // TODO figure out how to conditinally update element - only really want to update subelements if they've
      // changed. Right now it just resets them
      // coll.updateOne(
      //   { _id: artifact._id },
      //   { '$set': { subelements } },
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
      }
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
