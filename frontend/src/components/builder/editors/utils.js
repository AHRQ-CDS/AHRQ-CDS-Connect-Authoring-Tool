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

  const isInterval = Boolean(cqlArgument.operandTypeSpecifier?.pointType?.resultTypeName);
  const operandTypeSpecifier = cqlArgument.operandTypeSpecifier;
  const typeName = operandTypeSpecifier.pointType?.resultTypeName || operandTypeSpecifier.resultTypeName;
  return isInterval ? intervalArgumentTypeMap[typeName] : argumentTypeMap[typeName];
}
