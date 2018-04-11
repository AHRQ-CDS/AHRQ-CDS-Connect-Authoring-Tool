/* eslint-disable object-curly-newline */

// NOTE -- Any cqlTemplates/cqlLibraryFunctions that are `null` are currently in development
// Any id's that are the same as cqlTemplates are pure coincidence. The id matches within
// src/components/builder/modifiers while the cqlTemplate matches the cqlTemplate in app/data/cql/modifiers

const elementLists = ['list_of_observations', 'list_of_conditions', 'list_of_medication_statements',
  'list_of_medication_orders', 'list_of_procedures', 'list_of_allergy_intolerances', 'list_of_encounters'];
const everyElement = elementLists.concat(['boolean', 'system_quantity', 'system_concept', 'observation', 'condition',
  'medication_statement', 'medication_order', 'procedure']);

export default [
  // observations
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
    values: { unit: undefined },
    validator: { type: 'require', fields: ['unit'], args: null },
    cqlTemplate: 'WithUnit',
    cqlLibraryFunction: 'C3F.WithUnit',
  },
  // {
  //   id: 'ValueComparison',
  //   name: 'Value Comparison',
  //   inputTypes: ['list_of_observations'],
  //   returnType: 'list_of_observations',
  //   values: {min: undefined, max: undefined, minInclusive: undefined, maxInclusive: undefined},
  //   cqlTemplate: null,
  //   cqlLibraryFunction: null
  // },
  {
    id: 'ValueComparisonObservation',
    name: 'Value Comparison',
    inputTypes: ['system_quantity'],
    returnType: 'boolean',
    validator: { type: 'require', fields: ['minValue', 'minOperator', 'unit'], args: null },
    values: { minOperator: undefined, minValue: '', maxOperator: undefined, maxValue: '', unit: '' },
    cqlTemplate: 'ValueComparisonObservation',
    comparisonOperator: null
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
    values: { qualifier: undefined },
    cqlTemplate: 'Qualifier',
    cqlLibraryFunction: null
  },
  {
    id: 'ConvertToMgPerdL',
    name: 'Convert to mg/dL from mmol/L',
    inputTypes: ['system_quantity'],
    returnType: 'system_quantity',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'Convert.to_mg_per_dL'
  },
  {
    id: 'ConvertObservation',
    name: 'Convert Units',
    inputTypes: ['system_quantity'],
    returnType: 'system_quantity',
    values: { value: '', templateName: '' },
    validator: { type: 'require', fields: ['value'], args: null },
    cqlTemplate: 'BaseModifier',
    // cqlLibraryFunction is left off because it gets set based on option selected.
  },
  {
    id: 'HighestObservationValue',
    name: 'Highest Observation Value',
    inputTypes: ['list_of_observations'],
    returnType: 'system_quantity',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.HighestObservation'
  },
  // conditions
  {
    id: 'ConfirmedCondition',
    name: 'Confirmed',
    inputTypes: ['list_of_conditions'],
    returnType: 'list_of_conditions',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.Confirmed'
  },
  {
    id: 'ActiveOrRecurring',
    name: 'Active Or Recurring',
    inputTypes: ['list_of_conditions'],
    returnType: 'list_of_conditions',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.ActiveOrRecurring'
  },
  {
    id: 'ActiveConiditon',
    type: 'Active',
    name: 'Active',
    inputTypes: ['list_of_conditions'],
    returnType: 'list_of_conditions',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.ActiveCondition'
  },
  // procedures
  {
    id: 'CompletedProcedure',
    name: 'Completed',
    inputTypes: ['list_of_procedures'],
    returnType: 'list_of_procedures',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.Completed'
  },
  {
    id: 'InProgressProcedure',
    name: 'In Progress',
    inputTypes: ['list_of_procedures'],
    returnType: 'list_of_procedures',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.ProcedureInProgress'
  },
  // medications
  {
    id: 'ActiveMedicationStatement',
    name: 'Active',
    inputTypes: ['list_of_medication_statements'],
    returnType: 'list_of_medication_statements',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.ActiveMedicationStatement'
  },
  {
    id: 'ActiveMedicationOrder',
    name: 'Active',
    inputTypes: ['list_of_medication_orders'],
    returnType: 'list_of_medication_orders',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.ActiveMedicationOrder'
  },
  // allergy intolerances
  {
    id: 'ActiveOrConfirmedAllergyIntolerance',
    name: 'Active Or Confirmed',
    inputTypes: ['list_of_allergy_intolerances'],
    returnType: 'list_of_allergy_intolerances',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.ActiveOrConfirmedAllergyIntolerance'
  },
  // ALL
  // Most Recent
  {
    id: 'MostRecentObservation',
    name: 'Most Recent',
    inputTypes: ['list_of_observations'],
    returnType: 'observation',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.MostRecent'
  },
  {
    id: 'MostRecentCondition',
    name: 'Most Recent',
    inputTypes: ['list_of_conditions'],
    returnType: 'condition',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.MostRecent' },
  // { // TODO: not valid
  //   id: 'MostRecentMedication',
  //   name: 'Most Recent',
  //   inputTypes: ['list_of_medications'],
  //   returnType: 'medication',
  //   cqlTemplate: 'BaseModifier',
  //   cqlLibraryFunction: 'C3F.MostRecent' },
  {
    id: 'MostRecentProcedure',
    name: 'Most Recent',
    inputTypes: ['list_of_procedures'],
    returnType: 'procedure',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.MostRecent' },
  // Look Back
  {
    id: 'LookBackObservation',
    type: 'LookBack',
    name: 'Look Back',
    inputTypes: ['list_of_observations'],
    returnType: 'list_of_observations',
    values: { value: undefined, unit: undefined },
    validator: { type: 'require', fields: ['value', 'unit'], args: null },
    cqlTemplate: 'LookBackModifier',
    cqlLibraryFunction: 'C3F.ObservationLookBack' },
  {
    id: 'LookBackCondition',
    type: 'LookBack',
    name: 'Look Back',
    inputTypes: ['list_of_conditions'],
    returnType: 'list_of_conditions',
    values: { value: undefined, unit: undefined },
    validator: { type: 'require', fields: ['value', 'unit'], args: null },
    cqlTemplate: 'LookBackModifier',
    cqlLibraryFunction: 'C3F.ConditionLookBack' },
  // { // TODO: not valid
  //   id: 'LookBackMedication',
  //   type: 'LookBack',
  //   name: 'Look Back',
  //   inputTypes: ['list_of_medications'],
  //   returnType: 'list_of_medications',
  //   values: { value: undefined, unit: undefined },
  //   cqlTemplate: 'LookBackModifier',
  //   cqlLibraryFunction: 'C3F.MedicationLookBack' },
  {
    id: 'LookBackProcedure',
    type: 'LookBack',
    name: 'Look Back',
    inputTypes: ['list_of_procedures'],
    returnType: 'list_of_procedures',
    values: { value: undefined, unit: undefined },
    validator: { type: 'require', fields: ['value', 'unit'], args: null },
    cqlTemplate: 'LookBackModifier',
    cqlLibraryFunction: 'C3F.ProcedureLookBack' },
  {
    id: 'BooleanExists',
    name: 'Exists',
    inputTypes: elementLists,
    returnType: 'boolean',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'exists'
  },
  {
    id: 'BooleanComparison',
    name: 'Is (Not) True/False?',
    inputTypes: ['boolean'],
    returnType: 'boolean',
    values: { value: undefined },
    validator: { type: 'require', fields: ['value'], args: null },
    cqlTemplate: 'postModifier',
    comparisonOperator: null
  },
  {
    id: 'CheckExistence',
    name: 'Is (Not) Null?',
    inputTypes: everyElement,
    returnType: 'boolean',
    values: { value: undefined },
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
  },
  {
    id: 'InProgress',
    name: 'In Progress',
    inputTypes: ['list_of_encounters'],
    returnType: 'list_of_encounters',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.InProgress'
  }
];
