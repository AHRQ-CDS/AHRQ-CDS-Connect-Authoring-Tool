// NOTE -- Any cqlTemplates/cqlLibraryFunctions that are `null` are currently in development
// Any id's that are the same as cqlTemplates are pure coincidence. The id matches within src/components/builder/modifiers
// while the cqlTemplate matches the cqlTemplate in app/data/cql/modifiers

let elementLists = ['list_of_observations', 'list_of_conditions', 'list_of_medications', 'list_of_procedures', 'list_of_allergy_intolerances', 'list_of_encounters'];
let everyElement = elementLists.concat(['boolean', 'system_quantity', 'observation', 'condition', 'medication', 'procedure']);
module.exports = [
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
    values: {unit: undefined},
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
    values: {minOperator: undefined, minValue: '', maxOperator: undefined, maxValue: ''},
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
    returnType: 'system_quantity',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.ConceptValue'
  },
  {
    id: 'CheckInclusionInVS',
    name: 'Exists within Valueset?',
    inputTypes: ['system_quantity'],
    returnType: 'boolean',
    values: undefined,
    cqlTemplate: 'CheckInclusionInVS',
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
  //procedures
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
    id: 'ActiveMedication',
    name: 'Active',
    inputTypes: ['list_of_medications'],
    returnType: 'list_of_medications',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.Active'
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
  { id: 'MostRecentObservation', name: 'Most Recent', inputTypes: ['list_of_observations'], returnType: 'observation',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  { id: 'MostRecentCondition', name: 'Most Recent', inputTypes: ['list_of_conditions'], returnType: 'condition',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  { id: 'MostRecentMedication', name: 'Most Recent', inputTypes: ['list_of_medications'], returnType: 'medication',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  { id: 'MostRecentProcedure', name: 'Most Recent', inputTypes: ['list_of_procedures'], returnType: 'procedure',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  // Look Back
  { id: 'LookBackObservation', type: 'LookBack', name: 'Look Back', inputTypes: ['list_of_observations'], returnType: 'list_of_observations', values: {value: undefined, unit: undefined}, cqlTemplate: 'LookBackModifier', cqlLibraryFunction: 'C3F.ObservationLookBack' },
  { id: 'LookBackCondition', type: 'LookBack', name: 'Look Back', inputTypes: ['list_of_conditions'], returnType: 'list_of_conditions',       values: {value: undefined, unit: undefined}, cqlTemplate: 'LookBackModifier', cqlLibraryFunction: 'C3F.ConditionLookBack' },
  { id: 'LookBackMedication', type: 'LookBack', name: 'Look Back', inputTypes: ['list_of_medications'], returnType: 'list_of_medications',    values: {value: undefined, unit: undefined}, cqlTemplate: 'LookBackModifier', cqlLibraryFunction: 'C3F.MedicationLookBack' },
  { id: 'LookBackProcedure', type: 'LookBack', name: 'Look Back', inputTypes: ['list_of_procedures'], returnType: 'list_of_procedures',       values: {value: undefined, unit: undefined}, cqlTemplate: 'LookBackModifier', cqlLibraryFunction: 'C3F.ProcedureLookBack' },
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
    values: {value: undefined},
    cqlTemplate: 'postModifier',
    comparisonOperator: null
  },
  {
    id: 'CheckExistence',
    name: 'Is (Not) Null?',
    inputTypes: everyElement,
    returnType: 'boolean',
    values: {value: undefined},
    cqlTemplate: 'postModifier',
    comparisonOperator: null
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
]