// NOTE -- Any cqlTemplates/cqlLibraryFunctions that are `null` are currently in development

let elementLists = ['list_of_observations', 'conditions', 'medications', 'procedures'];
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
    cqlTemplate: null,
    cqlLibraryFunction: null
  },
  {
    id: 'ValueComparison',
    name: 'Value Comparison',
    inputTypes: ['list_of_observations'],
    returnType: 'list_of_observations',
    values: {min: undefined, max: undefined, minInclusive: undefined, maxInclusive: undefined},
    cqlTemplate: 'ValueComparion',
    cqlLibraryFunction: ''
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
    id: 'ConvertMgToDL',
    name: 'Convert mg to dL',
    inputTypes: ['system_quantity'],
    returnType: 'system_quantity',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'Convert.to_mg_per_dL'
  },
  // conditions
  {
    id: 'ConfirmedCondition',
    name: 'Confirmed',
    inputTypes: ['conditions'],
    returnType: 'conditions',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.Confirmed'
  },
  {
    id: 'ActiveConiditon',
    type: 'Active',
    name: 'Active',
    inputTypes: ['conditions'],
    returnType: 'conditions',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.Active'
  },
  //procedures
  {
    id: 'CompletedProcedure',
    name: 'Completed',
    inputTypes: ['procedures'],
    returnType: 'procedures',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.Completed'
  },
  // medications
  {
    id: 'ActiveMedication',
    name: 'Active',
    inputTypes: ['medications'],
    returnType: 'medications',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.Active'
  },
  // ALL
  // Most Recent
  { id: 'MostRecentObservation', name: 'Most Recent', inputTypes: ['list_of_observations'], returnType: 'observation',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  { id: 'MostRecentCondition', name: 'Most Recent', inputTypes: ['conditions'], returnType: 'condition',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  { id: 'MostRecentMedication', name: 'Most Recent', inputTypes: ['medications'], returnType: 'medication',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  { id: 'MostRecentProcedure', name: 'Most Recent', inputTypes: ['procedures'], returnType: 'procedure',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  // Look Back
  { id: 'LookBackObservation', type: 'LookBack', name: 'Look Back', inputTypes: ['list_of_observations'], returnType: 'list_of_observations', values: {value: undefined, unit: undefined}, cqlTemplate: 'twoArgumentModifier', cqlLibraryFunction: 'C3F.ObservationLookBack' },
  { id: 'LookBackCondition', type: 'LookBack', name: 'Look Back', inputTypes: ['list_of_conditions'], returnType: 'list_of_conditions',       values: {value: undefined, unit: undefined}, cqlTemplate: 'twoArgumentModifier', cqlLibraryFunction: 'C3F.ConditionLookBack' },
  { id: 'LookBackMedication', type: 'LookBack', name: 'Look Back', inputTypes: ['list_of_medications'], returnType: 'list_of_medications',    values: {value: undefined, unit: undefined}, cqlTemplate: 'twoArgumentModifier', cqlLibraryFunction: 'C3F.MedicationLookBack' },
  { id: 'LookBackProcedure', type: 'LookBack', name: 'Look Back', inputTypes: ['list_of_procedures'], returnType: 'list_of_procedures',       values: {value: undefined, unit: undefined}, cqlTemplate: 'twoArgumentModifier', cqlLibraryFunction: 'C3F.ProcedureLookBack' },
  {
    id: 'BooleanExists',
    name: 'Exists',
    inputTypes: elementLists,
    returnType: 'boolean',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.Exists'
  },
]