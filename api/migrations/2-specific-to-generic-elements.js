/**
 * Migrates artifacts that have a booleanParameters field, applying the following changes:
 * - adds { type: 'Boolean' } to each parameter
 * - renames 'booleanParameters' to 'parameters'
 */
'use strict';
const _ = require('lodash');
const ValueSets = require('../data/valueSets');
const pregnancyObjects = require('./utils/pregnancy-objects');

module.exports.id = "specific-to-generic-elements";

// Modifier transformation functions

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

// ChildInstance transformation functions

function transformObservation(childInstance) {
  // Update suppressedModifiers
  if (childInstance.suppressedModifiers) {
    childInstance.suppressedModifiers = ['ConvertToMgPerdL'];
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
    switch (modifier.id) {
      case 'ValueComparisonObservation': {
        if (parameter.value) {
          modifier.values.unit = observationValueSets.units.code.replace(/'/g, '');
          if (modifier.validator) modifier.validator.fields.push('unit');
        }
        break;
      }
      case 'ConceptValue': {
        modifier.returnType = 'system_concept';
        break;
      }
      case 'CheckInclusionInVS': {
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
            fields: ["qualifier"],
            args: ["valueSet", "code"]
          },
          returnType: "boolean",
          inputTypes: ["system_concept"],
          name: "Qualifier",
          id: "Qualifier"
        }
        childInstance.modifiers.splice(i, 1, updatedModier);
        break;
      }
      case 'ConvertToMgPerdL': {
        modifier.id = 'ConvertObservation';
        modifier.name = 'Convert Units';
        modifier.values = {
          value: "Convert.to_mg_per_dL",
          templateName: "Convert.to_mg_per_dL"
        };
        modifier.validator = {
          type: "require",
          fields: ["value"],
          args: null
        };
        delete modifier.cqlLibraryFunction;
        break;
      }
      case 'CheckExistence': {
        modifier = updateCheckExistenceModifier(modifier);
        break;
      }
      case 'BooleanExists': {
        modifier = updateBooleanExistsModifier(modifier);
        break;
      }
    }
  });

  // Update parameters
  if (parameter.type === 'observation') {
    parameter.type = 'observation_vsac';
    let observationValueSets = ValueSets.observations[parameter.value];
    parameter.valueSets = observationValueSets.observations ? observationValueSets.observations : [];
    if (observationValueSets.concepts) {
      // Add concepts on as well
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
    delete parameter.value;
  }

  // Update template and suppress values
  childInstance.template = 'GenericObservation';
  childInstance.suppress = true;
  childInstance.name = 'Observation';
  childInstance.id = 'GenericObservation_vsac';

  // Remove the unneeded flag
  if (childInstance.checkInclusionInVS) {
    delete childInstance.checkInclusionInVS;
  }

  // Change extention to Base
  childInstance.extends = 'Base';

  return childInstance;
}

function transformMedication(childInstance) {
  // Copy is for adding a parallel MedicationStatement. Original will become a MedicationOrder.
  const childInstanceForStatement = JSON.parse(JSON.stringify(childInstance));
  childInstanceForStatement.uniqueId = `${childInstance.uniqueId}-a`;

  let parameter = {};
  let parameterForStatement = {};
  let containingOrName = 'Medication';
  if (childInstance.parameters && childInstance.parameters[0]) {
    containingOrName = childInstance.parameters[0].value;
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
    let modifier = modifierParam;
    let modifierForStatement = childInstanceForStatement.modifiers[i];
    switch (modifier.id) {
      case 'ActiveMedication': {
        modifier.id = 'ActiveMedicationOrder';
        modifierForStatement.id = 'ActiveMedicationStatement';

        modifier.inputTypes = ['list_of_medication_orders'];
        modifierForStatement.inputTypes = ['list_of_medication_statements'];

        modifier.returnType = 'list_of_medication_orders';
        modifierForStatement.returnType = 'list_of_medication_statements';

        modifier.cqlLibraryFunction = 'C3F.ActiveMedicationOrder';
        modifierForStatement.cqlLibraryFunction = 'C3F.ActiveMedicationStatement';

        break;
      }
      case 'CheckExistence': {
        modifier = updateCheckExistenceModifier(modifier);
        modifierForStatement = updateCheckExistenceModifier(modifierForStatement);
        break;
      }
      case 'BooleanExists': {
        modifier = updateBooleanExistsModifier(modifier);
        modifierForStatement = updateBooleanExistsModifier(modifierForStatement);
        break;
      }
      case 'LookBackMedication': {
        modifier.id = 'LookBackMedicationOrder';
        modifierForStatement.id = 'LookBackMedicationStatement';

        modifier.inputTypes = ['list_of_medication_orders'];
        modifierForStatement.inputTypes = ['list_of_medication_statements'];

        modifier.returnType = 'list_of_medication_orders';
        modifierForStatement.returnType = 'list_of_medication_statements';

        modifier.cqlLibraryFunction = 'C3F.MedicationOrderLookBack';
        modifierForStatement.cqlLibraryFunction = 'C3F.MedicationStatementLookBack';

        break;
      }
      case 'MostRecentMedication': {
        // MostRecentMedication is not valid any more.
        modifierIndexesToRemove.push(i);
        break;
      }
    }
  });
  if (modifierIndexesToRemove.length > 0) {
    // Due to the fact that only one artifact has only one element with this modifier, hardcoded [0] is okay.
    childInstance.modifiers.splice(modifierIndexesToRemove[0], 1);
    childInstanceForStatement.modifiers.splice(modifierIndexesToRemove[0], 1);
  }

  if (parameter.type === 'medication') {
    parameter.type = 'medicationOrder_vsac';
    parameterForStatement.type = 'medicationStatement_vsac';

    parameter.name = 'Medication Order';
    parameterForStatement.name = 'Medication Statement';

    let medicationValueSets = ValueSets.medications[parameter.value];
    if (!medicationValueSets.medications) {
      medicationValueSets.medications = [];
    }
    // Filter out Orders and Statements from the list in valueSets.js
    parameter.valueSets = medicationValueSets.medications.filter(med => med.type === 'MedicationOrder');
    parameterForStatement.valueSets = medicationValueSets.medications.filter(med => med.type === 'MedicationStatement');

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

  let containingOr = {
    id: 'Or',
    name: 'Or',
    conjunction: true,
    returnType: 'boolean',
    parameters: [
      {
        id: 'element_name',
        type: 'string',
        name: 'Group Name',
        value: containingOrName
      }
    ],
    "uniqueId": _.uniqueId('Or'),
    "childInstances": [ childInstance, childInstanceForStatement ]
  }

  return containingOr;
}

function transformAllergyIntolerance(childInstance) {
  let parameter = {};
  if (childInstance.parameters && childInstance.parameters[1]) {
    parameter = childInstance.parameters[1];
  }

  // Update modifiers
  if (!childInstance.modifiers) { childInstance.modifiers = []; }
  childInstance.modifiers.forEach((modifierParam, i) => {
    let modifier = modifierParam;
    switch (modifier.id) {
      case 'CheckExistence': {
        modifier = updateCheckExistenceModifier(modifier);
        break;
      }
      case 'BooleanExists': {
        modifier = updateBooleanExistsModifier(modifier);
        break;
      }
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
  return childInstance;
}

function transformCondition(childInstance) {
  let parameter = {};
  if (childInstance.parameters && childInstance.parameters[1]) {
    parameter = childInstance.parameters[1];
  }

  // Update modifiers
  if (!childInstance.modifiers) { childInstance.modifiers = []; }
  childInstance.modifiers.forEach((modifierParam, i) => {
    let modifier = modifierParam;
    switch (modifier.id) {
      case 'CheckExistence': {
        modifier = updateCheckExistenceModifier(modifier);
        break;
      }
      case 'BooleanExists': {
        modifier = updateBooleanExistsModifier(modifier);
        break;
      }
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
  childInstance.id = 'GenericCondition_vsac';

  // Change extention to Base
  childInstance.extends = 'Base';
  return childInstance;
}

function transformEncounter(childInstance) {
  let parameter = {};
  if (childInstance.parameters && childInstance.parameters[1]) {
    parameter = childInstance.parameters[1];
  }

  // Update modifiers
  if (!childInstance.modifiers) { childInstance.modifiers = []; }
  childInstance.modifiers.forEach((modifierParam, i) => {
    let modifier = modifierParam;
    switch (modifier.id) {
      case 'CheckExistence': {
        modifier = updateCheckExistenceModifier(modifier);
        break;
      }
      case 'BooleanExists': {
        modifier = updateBooleanExistsModifier(modifier);
        break;
      }
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
  return childInstance;
}

function transformProcedure(childInstance) {
  let parameter = {};
  if (childInstance.parameters && childInstance.parameters[1]) {
    parameter = childInstance.parameters[1];
  }

  // Update modifiers
  if (!childInstance.modifiers) { childInstance.modifiers = []; }
  childInstance.modifiers.forEach((modifierParam, i) => {
    let modifier = modifierParam;
    switch (modifier.id) {
      case 'CheckExistence': {
        modifier = updateCheckExistenceModifier(modifier);
        break;
      }
      case 'BooleanExists': {
        modifier = updateBooleanExistsModifier(modifier);
        break;
      }
      case 'MostRecentProcedure': {
        modifier.cqlLibraryFunction = 'C3F.MostRecentProcedure';
        break;
      }
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
  return childInstance;
}

function transformPregnancydx(childInstance) {
  let notModifierApplied = childInstance.modifiers.find(modifier => modifier.id === 'BooleanNot');
  if (notModifierApplied) {
    return pregnancyObjects.notPregnant;
  } else {
    return pregnancyObjects.pregnant;
  }
}

function transformPregnancydxCMS(childInstance) {
  let notModifierApplied = childInstance.modifiers.find(modifier => modifier.id === 'BooleanNot');
  if (notModifierApplied) {
    return pregnancyObjects.notPregnantCMS347v1;
  } else {
    return pregnancyObjects.pregnantCMS347v1;
  }
}

// Returns the element after transformation.
function transformElement(element) {
  let childInstance = element;
  if (childInstance.extends === 'GenericObservation') {
    return transformObservation(childInstance);
  } else if (childInstance.extends === 'GenericMedication') {
    return transformMedication(childInstance);
  } else if (childInstance.extends === 'GenericAllergyIntolerance') {
    return transformAllergyIntolerance(childInstance);
  } else if (childInstance.extends === 'GenericCondition') {
    return transformCondition(childInstance);
  } else if (childInstance.extends === 'GenericEncounter') {
    return transformEncounter(childInstance);
  } else if (childInstance.extends === 'GenericProcedure') {
    return transformProcedure(childInstance);
  } else if (childInstance.id === 'Pregnancydx') {
    // Special cases for Pregnancy objects. No breastfeeding was used so not handling that case.
    return transformPregnancydx(childInstance);
  } else if (childInstance.id === 'Pregnancydx_CMS347v1') {
    return transformPregnancydxCMS(childInstance);
  }
  return childInstance;
}

function parseTree(element) {
  let children = element.childInstances ? element.childInstances : [];
  let newChildrenToAdd = [];
  children = children.map((child, i) => {
    if ('childInstances' in child) {
      return parseTree(child);
    } else if (child.type === 'element') {
      // Transform the elements and modifiers as necessary.
      let transformedElement = transformElement(child);
      return transformedElement;
    } else {
      // A few elements (Age Range, Gender, And, Or) don't have type = element. But they don't require transformation.
      return child;
    }
  });
  element.childInstances = children.concat(newChildrenToAdd);
  return element;
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
  coll.find().forEach((artifact) => {
    const p = new Promise((resolve, reject) => {
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
      // Subelements are not in master/prod yet.

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
