import { convertToExpression } from '../../utils/artifacts';

const elementLists = ['list_of_observations', 'list_of_conditions', 'list_of_medication_statements',
  'list_of_medication_orders', 'list_of_procedures', 'list_of_allergy_intolerances', 'list_of_encounters'];
const everyElement = elementLists.concat(['boolean', 'system_quantity', 'system_concept', 'observation', 'condition',
  'medication_statement', 'medication_order', 'procedure']);

test('Simple modifiers Active, Confirmed, Exists builds expected phrase', () => {
  const modifiers = [
    {
      id: 'ActiveConiditon',
      type: 'Active',
      name: 'Active',
      inputTypes: ['list_of_conditions'],
      returnType: 'list_of_conditions',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.ActiveCondition'
    },
    {
      id: 'ConfirmedCondition',
      name: 'Confirmed',
      inputTypes: ['list_of_conditions'],
      returnType: 'list_of_conditions',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.Confirmed'
    },
    {
      id: 'BooleanExists',
      name: 'Exists',
      inputTypes: elementLists,
      returnType: 'boolean',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'exists'
    }
  ];
  const name = 'Condition';
  const valueSets = [{ name: 'Diabetes', oid: '1.2.3' }];
  const codes = [];
  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  const expectedOutput = [
    { expressionText: 'An', isExpression: false },
    { expressionText: 'active', isExpression: true },
    { expressionText: 'confirmed', isExpression: true },
    { expressionText: 'condition', isExpression: false },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'Diabetes', isExpression: true },
    { expressionText: 'that', isExpression: false },
    { expressionText: 'exists', isExpression: true },
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

// MostRecent starts the list, Qualifier added correctly, LookBack added correctly, ConceptValue not added to phrase
test('More complicated modifiers, including Qualifier, builds expected phrase', () => {
  const modifiers = [
    {
      id: 'VerifiedObservation',
      name: 'Verified',
      inputTypes: ['list_of_observations'],
      returnType: 'list_of_observations',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.Verified'
    },
    {
      id: 'LookBackObservation',
      type: 'LookBack',
      name: 'Look Back',
      inputTypes: ['list_of_observations'],
      returnType: 'list_of_observations',
      values: { value: 14, unit: 'years' },
      validator: { type: 'require', fields: ['value', 'unit'], args: null },
      cqlTemplate: 'LookBackModifier',
      cqlLibraryFunction: 'C3F.ObservationLookBack'
    },
    {
      id: 'MostRecentObservation',
      name: 'Most Recent',
      inputTypes: ['list_of_observations'],
      returnType: 'observation',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.MostRecent'
    },
    {
      id: 'ConceptValue',
      name: 'Concept Value',
      inputTypes: ['observation'],
      returnType: 'system_concept',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.ConceptValue'
    },
    {
      id: 'Qualifier',
      name: 'Qualifier',
      inputTypes: ['system_concept'],
      returnType: 'boolean',
      validator: { type: 'requiredIfThenOne', fields: ['qualifier'], args: ['valueSet', 'code'] },
      values: { qualifier: 'value is a code from', valueSet: { name: 'Smoker', oid: '1.2.3' }, code: null },
      cqlTemplate: null,
      cqlLibraryFunction: null
    }
  ];

  const name = 'Observation';
  const valueSets = [{ name: 'LDL', oid: '1.2.3' }];
  const codes = [];

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  const expectedOutput = [
    { expressionText: 'A', isExpression: false },
    { expressionText: 'most recent', isExpression: true },
    { expressionText: 'verified', isExpression: true },
    { expressionText: 'observation', isExpression: false },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'LDL', isExpression: true },
    { expressionText: 'which occurred', isExpression: false },
    { expressionText: 'within the last 14 years', isExpression: true },
    { expressionText: 'whose value is a code from', isExpression: false },
    { expressionText: 'Smoker', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

// MostRecent starts the list, ValueComparison, WithUnit, ConvertUnits all added correctly
test('More complicated modifiers, including Value Comparison, builds correct phrase', () => {
  const modifiers = [
    {
      id: 'VerifiedObservation',
      name: 'Verified',
      inputTypes: ['list_of_observations'],
      returnType: 'list_of_observations',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.Verified'
    },
    {
      id: 'WithUnit',
      name: 'With Unit',
      inputTypes: ['list_of_observations'],
      returnType: 'list_of_observations',
      values: { unit: 'mg/dL' },
      validator: { type: 'require', fields: ['unit'], args: null },
      cqlTemplate: 'WithUnit',
      cqlLibraryFunction: 'C3F.WithUnit',
    },
    {
      id: 'MostRecentObservation',
      name: 'Most Recent',
      inputTypes: ['list_of_observations'],
      returnType: 'observation',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.MostRecent'
    },
    {
      id: 'QuantityValue',
      name: 'Quantity Value',
      inputTypes: ['observation'],
      returnType: 'system_quantity',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.QuantityValue'
    },
    {
      id: 'ConvertObservation',
      name: 'Convert Units',
      inputTypes: ['system_quantity'],
      returnType: 'system_quantity',
      values: {
        value: 'Convert.mg_per_dL',
        templateName: 'Convert.mg_per_dL',
        description: 'mmol/L to mg/dL for blood cholesterol'
      },
      validator: { type: 'require', fields: ['value'], args: null },
      cqlTemplate: 'BaseModifier',
    },
    {
      id: 'ValueComparisonObservation',
      name: 'Value Comparison',
      inputTypes: ['system_quantity'],
      returnType: 'boolean',
      validator: { type: 'require', fields: ['minValue', 'minOperator', 'unit'], args: null },
      values: { minOperator: '>=', minValue: '120', maxOperator: '<', maxValue: '300', unit: 'mg/dL' },
      cqlTemplate: 'ValueComparisonObservation',
      comparisonOperator: null
    }
  ];

  const name = 'Observation';
  const valueSets = [{ name: 'LDL', oid: '1.2.3' }];
  const codes = [];

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  const expectedOutput = [
    { expressionText: 'A', isExpression: false },
    { expressionText: 'most recent', isExpression: true },
    { expressionText: 'verified', isExpression: true },
    { expressionText: 'observation', isExpression: false },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'LDL', isExpression: true },
    { expressionText: 'with unit mg/dL', isExpression: true },
    { expressionText: 'with', isExpression: false },
    { expressionText: 'units converted from mmol/L to mg/dL for blood cholesterol', isExpression: true },
    { expressionText: 'whose value is', isExpression: false },
    { expressionText: 'greater than or equal to 120 mg/dL and less than 300 mg/dL', isExpression: true },
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

// Highest starts the list, Not is at the beginning of expression, is null added to end
test('More complicated expression, with Highest, Not, and Is Null, builds correct phrase', () => {
  const modifiers = [
    {
      id: 'VerifiedObservation',
      name: 'Verified',
      inputTypes: ['list_of_observations'],
      returnType: 'list_of_observations',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.Verified'
    },
    {
      id: 'HighestObservationValue',
      name: 'Highest Observation Value',
      inputTypes: ['list_of_observations'],
      returnType: 'system_quantity',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.HighestObservation'
    },
    {
      id: 'CheckExistence',
      name: 'Is (Not) Null?',
      inputTypes: everyElement,
      returnType: 'boolean',
      values: { value: 'is null' },
      cqlTemplate: 'postModifier',
      comparisonOperator: null,
      validator: { type: 'require', fields: ['value'], args: null },
    },
    {
      id: 'BooleanNot',
      name: 'Not',
      inputTypes: ['boolean'],
      returnType: 'boolean',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'not'
    }
  ];

  const name = 'Observation';
  const valueSets = [];
  const codes = [{ code: '123-4', codeSystem: { name: 'CodeSystemName', id: '123' }, display: 'test code' }];

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  const expectedOutput = [
    { expressionText: 'Not', isExpression: true },
    { expressionText: 'a', isExpression: false },
    { expressionText: 'highest', isExpression: true },
    { expressionText: 'verified', isExpression: true },
    { expressionText: 'observation', isExpression: false },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'test code', isExpression: true },
    { expressionText: 'which', isExpression: false },
    { expressionText: 'is null', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

test('Only validated modifiers are added the the phrase', () => {
  const modifiers = [
    {
      id: 'WithUnit',
      name: 'With Unit',
      inputTypes: ['list_of_observations'],
      returnType: 'list_of_observations',
      values: { unit: undefined }, // Not filled in by user means it will not be validated successfully
      validator: { type: 'require', fields: ['unit'], args: null },
      cqlTemplate: 'WithUnit',
      cqlLibraryFunction: 'C3F.WithUnit',
    },
    {
      id: 'LookBackObservation',
      type: 'LookBack',
      name: 'Look Back',
      inputTypes: ['list_of_observations'],
      returnType: 'list_of_observations',
      values: { value: undefined, unit: undefined }, // Not filled in by user means it will not be validated successfully
      validator: { type: 'require', fields: ['value', 'unit'], args: null },
      cqlTemplate: 'LookBackModifier',
      cqlLibraryFunction: 'C3F.ObservationLookBack'
    },
    {
      id: 'MostRecentObservation',
      name: 'Most Recent',
      inputTypes: ['list_of_observations'],
      returnType: 'observation',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.MostRecent'
    },
    {
      id: 'QuantityValue',
      name: 'Quantity Value',
      inputTypes: ['observation'],
      returnType: 'system_quantity',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.QuantityValue'
    },
    {
      id: 'ValueComparisonObservation',
      name: 'Value Comparison',
      inputTypes: ['system_quantity'],
      returnType: 'boolean',
      validator: { type: 'require', fields: ['minValue', 'minOperator', 'unit'], args: null },
      values: { minOperator: undefined, minValue: '', maxOperator: undefined, maxValue: '', unit: '' }, // Not filled in
      cqlTemplate: 'ValueComparisonObservation',
      comparisonOperator: null
    },
    {
      id: 'CheckExistence',
      name: 'Is (Not) Null?',
      inputTypes: everyElement,
      returnType: 'boolean',
      values: { value: undefined }, // Not filled in
      cqlTemplate: 'postModifier',
      comparisonOperator: null,
      validator: { type: 'require', fields: ['value'], args: null },
    },
    {
      id: 'BooleanNot',
      name: 'Not',
      inputTypes: ['boolean'],
      returnType: 'boolean',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'not'
    }
  ];

  const name = 'Observation';
  const valueSets = [{ name: 'LDL', oid: '1.2.3' }];
  const codes = [];

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  // Only modifiers that are validated are added
  const expectedOutput = [
    { expressionText: 'Not', isExpression: true },
    { expressionText: 'a', isExpression: false },
    { expressionText: 'most recent', isExpression: true },
    { expressionText: 'observation', isExpression: false },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'LDL', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

// Multiple value sets and codes (with and without a display) are added correctly to phrase and tooltip text
test('All value sets and codes are added to phrase, but only first three are displayed, rest in tooltip text', () => {
  const modifiers = [
    {
      id: 'BooleanExists',
      name: 'Exists',
      inputTypes: elementLists,
      returnType: 'boolean',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'exists'
    }
  ];

  const name = 'Observation';
  const valueSets = [{ name: 'LDL', oid: '1.2.3' }, { name: 'HDL', oid: '3.2.1' }];
  const codes = [
    { code: '123-4', codeSystem: { name: 'CS1', id: '123' }, display: 'Test code' },
    { code: '432-1', codeSystem: { name: 'CS2', id: '321' } },
  ];

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  const expectedOutput = [
    { expressionText: 'An', isExpression: false },
    { expressionText: 'observation', isExpression: false },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'LDL', isExpression: true },
    { expressionText: ',', isExpression: false },
    { expressionText: 'HDL', isExpression: true },
    { expressionText: ',', isExpression: false },
    { expressionText: 'Test code', isExpression: true },
    { expressionText: ',', isExpression: false },
    { expressionText: 'or', isExpression: false },
    { expressionText: '...', isExpression: true, tooltipText: '... or 432-1 (CS2)' },
    { expressionText: 'that', isExpression: false },
    { expressionText: 'exists', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

test('Elements that have a return type of a list indicates plurality in the phrase', () => {
  const modifiers = [];

  const name = 'Observation';
  const valueSets = [{ name: 'LDL', oid: '1.2.3' }];
  const codes = [];

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'list_of_observations');

  const expectedOutput = [
    { expressionText: 'A', isExpression: false },
    { expressionText: 'list of', isExpression: false },
    { expressionText: 'observations', isExpression: false },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'LDL', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

describe('Demographics elements support special case phrases', () => {
  test('Age Range supports min and max age', () => {
    const modifiers = [];
    const name = 'Age Range';
    const ages = [
      { id: 'min_age', name: 'Minimum Age', type: 'number', typeOfNumber: 'integer', value: 18 },
      { id: 'max_age', name: 'Maximum Age', type: 'number', typeOfNumber: 'integer', value: 70 }
    ];

    const expressionPhrase = convertToExpression(modifiers, name, [], [], 'boolean', ages);

    const expectedOutput = [
      { expressionText: 'A patient whose age is', isExpression: false },
      { expressionText: 'between', isExpression: false },
      { expressionText: '18 years', isExpression: true },
      { expressionText: 'and', isExpression: false },
      { expressionText: '70 years', isExpression: true }
    ];

    expect(expressionPhrase).toEqual(expectedOutput);
  });
  test('Gender supports gender selection', () => {
    const modifiers = [];
    const name = 'Gender';
    const gender = [{
      id: 'gender',
      name: 'Gender',
      select: 'demographics/gender',
      type: 'valueset',
      value: { id: 'male', name: 'Male', value: 'male' }
    }];

    const expressionPhrase = convertToExpression(modifiers, name, [], [], 'boolean', gender);

    const expectedOutput = [
      { expressionText: 'A patient whose gender is', isExpression: false },
      { expressionText: 'Male', isExpression: true }
    ];

    expect(expressionPhrase).toEqual(expectedOutput);
  });
});
