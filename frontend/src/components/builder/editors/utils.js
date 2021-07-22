export const isSupportedEditorType = editorType => {
  if (!editorType) return false;

  const supportedEditorTypes = [
    'boolean',
    'datetime',
    'decimal',
    'integer',
    'interval_of_datetime',
    'interval_of_decimal',
    'interval_of_integer',
    'interval_of_quantity',
    'string',
    'system_code',
    'system_concept',
    'system_quantity',
    'time'
  ];

  return supportedEditorTypes.includes(editorType);
};

export function getTypeByCqlArgument(cqlArgument) {
  // Supported non-interval types

  // Note: there is a large overlap between this type map and one stored
  // in the backend in the file api/handlers/cqlHandler.js
  // If you update something here, be sure to update it there
  const argumentTypeMap = {
    '{urn:hl7-org:elm-types:r1}Boolean': 'boolean',
    '{urn:hl7-org:elm-types:r1}Code': 'system_code',
    '{urn:hl7-org:elm-types:r1}Concept': 'system_concept',
    '{urn:hl7-org:elm-types:r1}DateTime': 'datetime',
    '{urn:hl7-org:elm-types:r1}Decimal': 'decimal',
    '{urn:hl7-org:elm-types:r1}Integer': 'integer',
    '{urn:hl7-org:elm-types:r1}Quantity': 'system_quantity',
    '{urn:hl7-org:elm-types:r1}String': 'string',
    '{urn:hl7-org:elm-types:r1}Time': 'time'
  };

  // Supported interval types
  const intervalArgumentTypeMap = {
    '{urn:hl7-org:elm-types:r1}DateTime': 'interval_of_datetime',
    '{urn:hl7-org:elm-types:r1}Decimal': 'interval_of_decimal',
    '{urn:hl7-org:elm-types:r1}Integer': 'interval_of_integer',
    '{urn:hl7-org:elm-types:r1}Quantity': 'interval_of_quantity'
  };

  // Supported FHIR types
  const fhirTypeMap = {
    '{http://hl7.org/fhir}AllergyIntolerance': 'allergy_intolerance',
    '{http://hl7.org/fhir}Condition': 'condition',
    '{http://hl7.org/fhir}Device': 'device',
    '{http://hl7.org/fhir}Encounter': 'encounter',
    '{http://hl7.org/fhir}Immunization': 'immunization',
    '{http://hl7.org/fhir}MedicationRequest': 'medication_request',
    '{http://hl7.org/fhir}MedicationStatement': 'medication_statement',
    '{http://hl7.org/fhir}MedicationOrder': 'medication_order',
    '{http://hl7.org/fhir}Observation': 'observation',
    '{http://hl7.org/fhir}Procedure': 'procedure',
    '{http://hl7.org/fhir}ServiceRequest': 'service_request'
  };

  const isInterval = Boolean(cqlArgument.operandTypeSpecifier?.pointType?.resultTypeName);
  const operandTypeSpecifier = cqlArgument.operandTypeSpecifier;
  const typeName =
    operandTypeSpecifier.pointType?.resultTypeName ||
    operandTypeSpecifier.resultTypeName ||
    operandTypeSpecifier.resultTypeSpecifier.elementType.name;
  if (typeName.startsWith('{http://hl7.org/fhir}'))
    return operandTypeSpecifier?.resultTypeSpecifier?.type !== 'ListTypeSpecifier'
      ? fhirTypeMap[typeName]
      : `list_of_${fhirTypeMap[typeName]}s`;
  else return isInterval ? intervalArgumentTypeMap[typeName] : argumentTypeMap[typeName];
}

// errors

const isBlank = value => value === '' || value == null;
const isValidDecimal = value => /^-?\d+(\.\d+)?$/.test(value);
const isValidInteger = value => /^-?\d+$/.test(value);

const editorErrors = (type, value) => {
  switch (type) {
    case 'datetime':
      return { incompleteInput: Boolean(value?.time && !value?.date) };

    case 'interval_of_datetime':
      return {
        incompleteInput: Boolean((value?.firstTime && !value?.firstDate) || (value?.secondTime && !value?.secondDate))
      };

    case 'decimal':
      return { invalidInput: !isBlank(value?.decimal) && !isValidDecimal(value?.decimal) };

    case 'interval_of_decimal':
      return {
        invalidInput:
          (!isBlank(value?.firstDecimal) && !isValidDecimal(value?.firstDecimal)) ||
          (!isBlank(value?.secondDecimal) && !isValidDecimal(value?.secondDecimal))
      };

    case 'integer':
      return { invalidInput: !isBlank(value) && !isValidInteger(value) };

    case 'interval_of_integer':
      return {
        invalidInput:
          (!isBlank(value?.firstInteger) && !isValidInteger(value?.firstInteger)) ||
          (!isBlank(value?.secondInteger) && !isValidInteger(value?.secondInteger))
      };

    case 'system_quantity':
      return {
        invalidInput: Boolean(value) && !isBlank(value?.quantity) && !isValidDecimal(value?.quantity),
        incompleteInput: Boolean(value?.unit) && isBlank(value?.quantity)
      };

    case 'interval_of_quantity':
      return {
        invalidInput:
          Boolean(value) &&
          ((!isBlank(value?.firstQuantity) && !isValidDecimal(value?.firstQuantity)) ||
            (!isBlank(value?.secondQuantity) && !isValidDecimal(value?.secondQuantity))),
        incompleteInput: Boolean(value?.unit) && isBlank(value?.firstQuantity) && isBlank(value?.secondQuantity)
      };

    default:
      return {};
  }
};

const hasErrors = (type, errors) => {
  switch (type) {
    case 'datetime':
    case 'interval_of_datetime':
      return errors.incompleteInput;

    case 'decimal':
    case 'integer':
    case 'interval_of_decimal':
    case 'interval_of_integer':
      return errors.invalidInput;

    case 'system_quantity':
    case 'interval_of_quantity':
      return errors.invalidInput || errors.incompleteInput;

    default:
      return false;
  }
};

export const getEditorErrors = (type, value) => {
  const errors = editorErrors(type, value);

  return {
    errors,
    hasErrors: hasErrors(type, errors)
  };
};
