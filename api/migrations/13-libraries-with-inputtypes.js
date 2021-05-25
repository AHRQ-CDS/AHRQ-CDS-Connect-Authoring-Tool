/**
 * Migrates all cqllibraries, applying the following changes:
 * - calculates and adds calculatedInputTypes and displayInputTypes to details.functions
 *   based on details.functions.operands
 */
'use strict';
const _ = require('lodash');

module.exports.id = 'libraries-with-inputtypes';

const singularTypeMap = {
  Boolean: 'boolean',
  Code: 'system_code',
  Concept: 'system_concept',
  Integer: 'integer',
  DateTime: 'datetime',
  Decimal: 'decimal',
  Quantity: 'system_quantity',
  String: 'string',
  Time: 'time',
  Observation: 'observation',
  Condition: 'condition',
  MedicationStatement: 'medication_statement',
  MedicationOrder: 'medication_request',
  MedicationRequest: 'medication_request',
  Procedure: 'procedure',
  AllergyIntolerance: 'allergy_intolerance',
  Encounter: 'encounter',
  Immunization: 'immunization',
  Device: 'device',
  Any: 'any'
};

const listTypeMap = {
  Observation: 'list_of_observations',
  Condition: 'list_of_conditions',
  MedicationStatement: 'list_of_medication_statements',
  MedicationOrder: 'list_of_medication_requests',
  MedicationRequest: 'list_of_medication_requests',
  Procedure: 'list_of_procedures',
  AllergyIntolerance: 'list_of_allergy_intolerances',
  Encounter: 'list_of_encounters',
  Immunization: 'list_of_immunizations',
  Device: 'list_of_devices',
  Any: 'list_of_any',
  Boolean: 'list_of_booleans',
  Code: 'list_of_system_codes',
  Concept: 'list_of_system_concepts',
  Integer: 'list_of_integers',
  DateTime: 'list_of_datetimes',
  Decimal: 'list_of_decimals',
  Quantity: 'list_of_system_quantities',
  String: 'list_of_strings',
  Time: 'list_of_times'
};

const intervalTypeMap = {
  Integer: 'interval_of_integer',
  DateTime: 'interval_of_datetime',
  Decimal: 'interval_of_decimal',
  Quantity: 'interval_of_quantity'
};

const getTypeFromELMString = string => string.substring(string.indexOf('}') + 1);

const areChoicesKnownTypes = choices => {
  let allChoicesKnown = true;
  const typesOfChoices = [];
  choices.forEach(choice => {
    if (choice.type === 'NamedTypeSpecifier') {
      const returnTypeOfChoice = getTypeFromELMString(choice.name);
      const convertedType = singularTypeMap[returnTypeOfChoice];
      if (!convertedType) {
        allChoicesKnown = false;
      }
      let typeToDisplay = convertedType ? convertedType : returnTypeOfChoice;
      if (returnTypeOfChoice === 'MedicationOrder') typeToDisplay = 'Medication Order';
      typesOfChoices.push(_.startCase(typeToDisplay));
    } else {
      // Default to marking as unknown.
      allChoicesKnown = false;
      typesOfChoices.push('Unknown');
    }
  });
  return { allChoicesKnown, typesOfChoices };
};

function calculateInputType(definition) {
  let elmType, elmDisplay;

  if (definition.operandType) {
    elmType = getTypeFromELMString(definition.operandType);
    const convertedType = singularTypeMap[elmType];
    if (!convertedType) elmDisplay = `Other (${elmType})`;
    if (elmType === 'MedicationOrder') elmDisplay = 'Medication Order';
    elmType = convertedType ? convertedType : 'other';
  } else if (definition.operandTypeSpecifier) {
    const typeSpecifier = definition.operandTypeSpecifier;
    switch (typeSpecifier.type) {
      case 'NamedTypeSpecifier': {
        elmType = getTypeFromELMString(typeSpecifier.name);
        const convertedType = singularTypeMap[elmType];
        if (!convertedType) elmDisplay = `Other (${elmType})`;
        if (elmType === 'MedicationOrder') elmDisplay = 'Medication Order';
        elmType = convertedType ? convertedType : 'other';
        break;
      }
      case 'IntervalTypeSpecifier': {
        elmType = getTypeFromELMString(typeSpecifier.pointType.name);
        const convertedType = intervalTypeMap[elmType];
        if (!convertedType) elmDisplay = `Interval of Others (${elmType})`;
        elmType = convertedType ? convertedType : 'interval_of_other';
        break;
      }
      case 'ListTypeSpecifier': {
        if (typeSpecifier.elementType.type === 'ChoiceTypeSpecifier') {
          const { allChoicesKnown, typesOfChoices } = areChoicesKnownTypes(typeSpecifier.elementType.choice);
          elmType = allChoicesKnown ? 'list_of_any' : 'list_of_others';
          if (!allChoicesKnown) elmDisplay = `List of Others (${typesOfChoices.join(', ')})`;
          else elmDisplay = `List of Any (${typesOfChoices.join(', ')})`;
        } else if (typeSpecifier.elementType.type === 'TupleTypeSpecifier') {
          elmType = 'list_of_others';
          elmDisplay = 'List of Others (Tuple)';
        } else if (typeSpecifier.elementType.type === 'NamedTypeSpecifier') {
          elmType = getTypeFromELMString(typeSpecifier.elementType.name);
          const convertedType = listTypeMap[elmType];
          if (!convertedType) elmDisplay = `List of Others (${elmType})`;
          if (elmType === 'MedicationRequest') elmDisplay = 'List of Medication Requests';
          elmType = convertedType ? convertedType : 'list_of_others';
        } else if (typeSpecifier.elementType.type === 'ListTypeSpecifier') {
          elmType = 'list_of_others';
          elmDisplay = 'List of Lists';
        } else if (typeSpecifier.elementType.type === 'IntervalTypeSpecifier') {
          elmType = 'list_of_others';
          elmDisplay = 'List of Intervals';
        } else {
          elmType = 'list_of_others';
          elmDisplay = 'List of Others (unknown)';
        }
        break;
      }
      case 'TupleTypeSpecifier': {
        elmType = 'other';
        elmDisplay = 'Other (Tuple)';
        break;
      }
      case 'ChoiceTypeSpecifier': {
        const { allChoicesKnown, typesOfChoices } = areChoicesKnownTypes(typeSpecifier.choice);
        elmType = allChoicesKnown ? 'any' : 'other';
        if (!allChoicesKnown) elmDisplay = `Other (Choice of ${typesOfChoices.join(', ')})`;
        break;
      }
      default: {
        elmType = 'other';
        elmDisplay = 'Other (unknown)';
        break;
      }
    }
  } else {
    elmType = 'other';
    elmDisplay = 'Other (unknown)';
  }

  return { elmType, elmDisplay };
}

function mapInputTypes(definitions) {
  const mappedDefinitions = definitions;
  mappedDefinitions.map(definition => {
    if (definition.operand && definition.operand.length > 0) {
      const argumentTypes = [];
      definition.operand.forEach(operand => {
        const { elmType, elmDisplay } = calculateInputType(operand);
        argumentTypes.push({ calculated: elmType || 'other', display: elmDisplay });
      });
      definition.argumentTypes = argumentTypes;
      // The inputTypes should only be equivalent to the input type of the first argument
      // so that external CQL modifiers can use the element return type as this input
      definition.inputTypes = definition.argumentTypes.length > 0 ? [definition.argumentTypes[0].calculated] : [];
    }
  });
  return mappedDefinitions;
}

module.exports.up = function (done) {
  this.log('Migrating: libraries-with-inputtypes');
  var coll = this.db.collection('cqllibraries');
  // NOTE: We can't use the special $[] operator since we're not yet on Mongo 3.6.
  // Instead, we need to iterate the documents and fields using forEach.

  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find().forEach(
    library => {
      const p = new Promise((resolve, reject) => {
        library.details.functions = mapInputTypes(library.details.functions);
        coll.updateOne({ _id: library._id }, { $set: library }, (err, result) => {
          if (err) {
            this.log(`${library._id}: error:`, err);
            reject(err);
          } else {
            this.log(`${library._id} (${library.name}): successfully updated.`);
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
            this.log(`Migrated ${results.length} cqllibraries`);
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
