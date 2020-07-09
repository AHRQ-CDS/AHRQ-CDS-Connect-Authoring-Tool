import convertToExpression from '../convertToExpression';
import modifierList from '../../../data/modifiers';

function getModifier(name, values) {
  let modifier = modifierList.find(m => m.id === name);
  if (modifier && values) {
    modifier = Object.assign({}, modifier, { values });
  }
  return modifier;
}

test('Simple modifiers Active, Confirmed, Exists builds expected phrase', () => {
  const modifiers = [
    getModifier('ActiveConiditon'),
    getModifier('ConfirmedCondition'),
    getModifier('BooleanExists')
  ];
  const name = 'Condition';
  const valueSets = [{ name: 'Diabetes', oid: '1.2.3' }];
  const codes = [];
  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  const expectedOutput = [
    { expressionText: 'There', isExpression: false },
    { expressionText: 'exists', isExpression: true },
    { expressionText: 'an', isExpression: false },
    { expressionText: 'active', isExpression: true },
    { expressionText: 'confirmed', isExpression: true },
    { expressionText: 'condition', isExpression: false, isType: true },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'Diabetes', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

// MostRecent starts the list, Qualifier added correctly, LookBack added correctly, ConceptValue not added to phrase
test('More complicated modifiers, including Qualifier, builds expected phrase', () => {
  const modifiers = [
    getModifier('VerifiedObservation'),
    getModifier('LookBackObservation', { value: 14, unit: 'years' }),
    getModifier('MostRecentObservation'),
    getModifier('ConceptValue'),
    getModifier('Qualifier', {
      qualifier: 'value is a code from',
      valueSet: {
        name: 'Smoker',
        oid: '1.2.3'
      },
      code: null
    })
  ];

  const name = 'Observation';
  const valueSets = [{ name: 'LDL', oid: '1.2.3' }];
  const codes = [];

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  const expectedOutput = [
    { expressionText: 'There exists', isExpression: false },
    { expressionText: 'a', isExpression: false },
    { expressionText: 'most recent', isExpression: true },
    { expressionText: 'verified', isExpression: true },
    { expressionText: 'observation', isExpression: false, isType: true },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'LDL', isExpression: true },
    { expressionText: 'which occurred', isExpression: false },
    { expressionText: 'within the last 14 years', isExpression: true },
    { expressionText: 'whose value is a code from Smoker', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

// MostRecent starts the list, ValueComparison, WithUnit, ConvertUnits all added correctly
test('More complicated modifiers, including Value Comparison, builds correct phrase', () => {
  const modifiers = [
    getModifier('VerifiedObservation'),
    getModifier('WithUnit', { unit: 'mg/dL' }),
    getModifier('MostRecentObservation'),
    getModifier('QuantityValue'),
    getModifier('ConvertObservation', {
      value: 'Convert.mg_per_dL',
      templateName: 'Convert.mg_per_dL',
      description: 'mmol/L to mg/dL for blood cholesterol'
    }),
    getModifier('ValueComparisonObservation', {
      minOperator: '>=',
      minValue: '120',
      maxOperator: '<',
      maxValue: '300',
      unit: 'mg/dL'
    })
  ];

  const name = 'Observation';
  const valueSets = [{ name: 'LDL', oid: '1.2.3' }];
  const codes = [];

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  const expectedOutput = [
    { expressionText: 'There exists', isExpression: false },
    { expressionText: 'a', isExpression: false },
    { expressionText: 'most recent', isExpression: true },
    { expressionText: 'verified', isExpression: true },
    { expressionText: 'observation', isExpression: false, isType: true },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'LDL', isExpression: true },
    { expressionText: 'with unit', isExpression: false },
    { expressionText: 'mg/dL', isExpression: true },
    { expressionText: 'with', isExpression: false },
    { expressionText: 'units converted from mmol/L to mg/dL for blood cholesterol', isExpression: true },
    { expressionText: 'whose value', isExpression: false },
    { expressionText: 'is greater than or equal to 120 mg/dL and is less than 300 mg/dL', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

// Highest starts the list, Not is at the beginning of expression, is null added to end
test('More complicated expression, with Highest, Not, and Is Null, builds correct phrase', () => {
  const modifiers = [
    getModifier('VerifiedObservation'),
    getModifier('HighestObservationValue'),
    getModifier('CheckExistence', { value: 'is null' }),
    getModifier('BooleanNot')
  ];

  const name = 'Observation';
  const valueSets = [];
  const codes = [{ code: '123-4', codeSystem: { name: 'CodeSystemName', id: '123' }, display: 'test code' }];

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  const expectedOutput = [
    { expressionText: 'It is', isExpression: false },
    { expressionText: 'not', isExpression: true },
    { expressionText: 'the case that', isExpression: false },
    { expressionText: 'the', isExpression: false },
    { expressionText: 'highest', isExpression: true },
    { expressionText: 'verified', isExpression: true },
    { expressionText: 'observation', isExpression: false, isType: true },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'test code', isExpression: true },
    { expressionText: 'is null', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

test('Only validated modifiers are added to the phrase', () => {
  const modifiers = [
    getModifier('CheckExistence', { value: undefined }) // not filled in
  ];

  const name = 'Observation';
  const valueSets = [{ name: 'LDL', oid: '1.2.3' }];
  const codes = [];

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'list_of_observations');

  // Only modifiers that are validated are added
  const expectedOutput = [
    { expressionText: 'Observations', isExpression: false, isType: true },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'LDL', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

// Multiple value sets and codes (with and without a display) are added correctly to phrase and tooltip text
test('All value sets and codes are added to phrase, but only first three are displayed, rest in tooltip text', () => {
  const modifiers = [
    getModifier('BooleanExists')
  ];

  const name = 'Observation';
  const valueSets = [{ name: 'LDL', oid: '1.2.3' }, { name: 'HDL', oid: '3.2.1' }];
  const codes = [
    { code: '123-4', codeSystem: { name: 'CS1', id: '123' }, display: 'Test code' },
    { code: '432-1', codeSystem: { name: 'CS2', id: '321' } },
  ];

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  const expectedOutput = [
    { expressionText: 'There', isExpression: false },
    { expressionText: 'exists', isExpression: true },
    { expressionText: 'an', isExpression: false },
    { expressionText: 'observation', isExpression: false, isType: true },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'LDL', isExpression: true },
    { expressionText: ',', isExpression: false },
    { expressionText: 'HDL', isExpression: true },
    { expressionText: ',', isExpression: false },
    { expressionText: 'Test code', isExpression: true },
    { expressionText: ',', isExpression: false },
    { expressionText: 'or', isExpression: false },
    { expressionText: '...', isExpression: true, tooltipText: '...or 432-1 (CS2)' }
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
    { expressionText: 'Observations', isExpression: false, isType: true },
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
      { id: 'max_age', name: 'Maximum Age', type: 'number', typeOfNumber: 'integer', value: 70 },
      {
        id: 'unit_of_time',
        name: 'Unit of Time',
        type: 'valueset',
        select: 'demographics/units_of_time',
        value: {
          id: 'a',
          name: 'years',
          value: 'AgeInYears()'
        }
      },
    ];

    const expressionPhrase = convertToExpression(modifiers, name, [], [], 'boolean', ages);

    const expectedOutput = [
      { expressionText: 'The patient\'s', isExpression: false },
      { expressionText: 'age', isExpression: false, isType: true },
      { expressionText: 'is', isExpression: false },
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
      { expressionText: 'The patient\'s', isExpression: false },
      { expressionText: 'gender', isExpression: false, isType: true },
      { expressionText: 'is', isExpression: false },
      { expressionText: 'Male', isExpression: true }
    ];

    expect(expressionPhrase).toEqual(expectedOutput);
  });
});

test('Base Element Lists create a phrase with individual element\'s phrases in a tooltip', () => {
  const modifiers = [
    getModifier('BooleanExists')
  ];

  const name = 'Union';
  const valueSets = [];
  const codes = [];
  const returnType = 'boolean';
  const otherFields = [];
  const elementNamesInPhrase = [
    { name: 'Test Name', tooltipText: 'Phrase for Test Name' },
    { name: 'Other', tooltipText: 'Another phrase' }
  ];

  const expressionPhrase = convertToExpression(
    modifiers,
    name,
    valueSets,
    codes,
    returnType,
    otherFields,
    elementNamesInPhrase
  );

  const expectedOutput = [
    { expressionText: 'There', isExpression: false },
    { expressionText: 'exists', isExpression: true },
    { expressionText: 'a', isExpression: false },
    { expressionText: 'union', isExpression: false, isType: true },
    { expressionText: 'of', isExpression: false },
    { expressionText: 'Test Name', isExpression: true, tooltipText: 'Phrase for Test Name', isName: true },
    { expressionText: 'and', isExpression: false },
    { expressionText: 'Other', isExpression: true, tooltipText: 'Another phrase', isName: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

test('Conjunction Groups create a phrase with the group\'s children 1 level deep and its type', () => {
  const modifiers = [];

  const name = 'Or';
  const valueSets = [];
  const codes = [];
  const returnType = 'boolean';
  const otherFields = [];
  const elementNamesInPhrase = [
    { name: 'Child 1' },
    { name: 'Child 2' },
    { name: 'Group Child' }
  ];

  const expressionPhrase = convertToExpression(
    modifiers,
    name,
    valueSets,
    codes,
    returnType,
    otherFields,
    elementNamesInPhrase
  );

  const expectedOutput = [
    { expressionText: 'Child 1', isExpression: true, isName: true },
    { expressionText: ',', isExpression: false },
    { expressionText: 'Child 2', isExpression: true, isName: true },
    { expressionText: ',', isExpression: false },
    { expressionText: 'or', isExpression: false, isType: true },
    { expressionText: 'Group Child', isExpression: true, isName: true },
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

test('Parameters with BooleanNot create a phrase with the parameter name', () => {
  const modifiers = [
    getModifier('BooleanNot')
  ];

  const name = 'parameter';
  const valueSets = [];
  const codes = [];
  const returnType = 'boolean';
  const otherFields = [];
  const elementNamesInPhrase = [];
  const parameterName = 'Original Param';

  const expressionPhrase = convertToExpression(
    modifiers,
    name,
    valueSets,
    codes,
    returnType,
    otherFields,
    elementNamesInPhrase,
    false,
    parameterName
  );

  const expectedOutput = [
    { expressionText: 'Not', isExpression: true },
    { expressionText: 'the', isExpression: false },
    { expressionText: 'parameter', isExpression: false, isType: true },
    { expressionText: 'Original Param', isExpression: true },
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

test('Quantity parameters with Value Comparison create a phrase with the parameter name and comparison', () => {
  const modifiers = [
    getModifier('ValueComparisonObservation', {
      minOperator: '>=',
      minValue: '120',
      maxOperator: '<',
      maxValue: '300',
      unit: 'mg/dL'
    })
  ];

  const name = 'parameter';
  const valueSets = [];
  const codes = [];
  const returnType = 'boolean';
  const otherFields = [];
  const elementNamesInPhrase = [];
  const parameterName = 'Original Param';

  const expressionPhrase = convertToExpression(
    modifiers,
    name,
    valueSets,
    codes,
    returnType,
    otherFields,
    elementNamesInPhrase,
    false,
    parameterName
  );

  const expectedOutput = [
    { expressionText: 'The', isExpression: false },
    { expressionText: 'parameter', isExpression: false, isType: true },
    { expressionText: 'Original Param', isExpression: true },
    { expressionText: 'is greater than or equal to 120 mg/dL and is less than 300 mg/dL', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

test('Count expression builds phrase that uses the count as the subject of the phrase', () => {
  const modifiers = [
    getModifier('Count'),
    getModifier('ValueComparisonNumber', {
      minOperator: '>',
      minValue: '10',
      maxOperator: undefined,
      maxValue: '',
      unit: ''
    })
  ];

  const name = 'Observation';
  const valueSets = [{ name: 'LDL', oid: '1.2.3' }];
  const codes = [];
  const returnType = 'boolean';

  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, returnType);

  const expectedOutput = [
    { expressionText: 'The', isExpression: false },
    { expressionText: 'count', isExpression: true },
    { expressionText: 'of', isExpression: false },
    { expressionText: 'observations', isExpression: false, isType: true },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'LDL', isExpression: true },
    { expressionText: 'is greater than 10', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});

test('Immunization Phrases', () => {
  const modifiers = [
    getModifier('LookBackImmunization', { value: 6, unit: 'years' }),
    getModifier('CompletedImmunization'),
    getModifier('MostRecentImmunization'),
    getModifier('CheckExistence', { value: 'is not null' })
  ];
  const name = 'Immunization';
  const valueSets = [{ name: 'FluVaccines', oid: '1.2.3' }];
  const codes = [];
  const expressionPhrase = convertToExpression(modifiers, name, valueSets, codes, 'boolean');

  const expectedOutput = [
    { expressionText: 'A', isExpression: false },
    { expressionText: 'most recent', isExpression: true },
    { expressionText: 'completed', isExpression: true },
    { expressionText: 'immunization', isExpression: false, isType: true },
    { expressionText: 'with a code from', isExpression: false },
    { expressionText: 'FluVaccines', isExpression: true },
    { expressionText: 'which occurred', isExpression: false },
    { expressionText: 'within the last 6 years', isExpression: true },
    { expressionText: 'is not null', isExpression: true }
  ];

  expect(expressionPhrase).toEqual(expectedOutput);
});
