// NOTE -- Any cqlTemplates/cqlLibraryFunctions that are `null` are currently in development

let elementLists = ['observations', 'conditions', 'medications', 'procedures'];
module.exports = [
  // observations
  {
    id: 'VerifiedObservation',
    name: 'Verified',
    inputTypes: ['observations'],
    returnType: 'observations',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.Verified'
  },
  {
    id: 'WithUnit',
    name: 'With Unit',
    inputTypes: ['observations'],
    returnType: 'observations',
    values: {unit: undefined},
    cqlTemplate: null,
    cqlLibraryFunction: null
  },
  {
    id: 'ValueComparison',
    name: 'Value Comparison',
    inputTypes: ['observations'],
    returnType: 'observations',
    values: {min: undefined, max: undefined, minInclusive: undefined, maxInclusive: undefined},
    cqlTemplate: 'ValueComparion',
    cqlLibraryFunction: ''
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
  { id: 'MostRecentObservation', name: 'Most Recent', inputTypes: ['observations'], returnType: 'observation',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  { id: 'MostRecentCondition', name: 'Most Recent', inputTypes: ['conditions'], returnType: 'condition',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  { id: 'MostRecentMedication', name: 'Most Recent', inputTypes: ['medications'], returnType: 'medication',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  { id: 'MostRecentProcedure', name: 'Most Recent', inputTypes: ['procedures'], returnType: 'procedure',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'C3F.MostRecent' },
  // Look Back
  { id: 'LookBackObservation', name: 'Look Back', inputTypes: ['observations'], returnType: 'observations', values: {value: undefined, unit: undefined}, cqlTemplate: 'twoArgumentModifier', cqlLibraryFunction: 'C3F.ObservationLookBack' },
  { id: 'LookBackCondition', name: 'Look Back', inputTypes: ['conditions'], returnType: 'conditions',       values: {value: undefined, unit: undefined}, cqlTemplate: 'twoArgumentModifier', cqlLibraryFunction: 'C3F.ConditionLookBack' },
  { id: 'LookBackMedication', name: 'Look Back', inputTypes: ['medications'], returnType: 'medications',    values: {value: undefined, unit: undefined}, cqlTemplate: 'twoArgumentModifier', cqlLibraryFunction: 'C3F.MedicationLookBack' },
  { id: 'LookBackProcedure', name: 'Look Back', inputTypes: ['procedures'], returnType: 'procedures',       values: {value: undefined, unit: undefined}, cqlTemplate: 'twoArgumentModifier', cqlLibraryFunction: 'C3F.ProcedureLookBack' },
  {
    id: 'BooleanExists',
    name: 'Exists',
    inputTypes: elementLists,
    returnType: 'boolean',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'C3F.Exists'
  },
]