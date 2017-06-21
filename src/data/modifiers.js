// NOTE -- Any cqlTemplates/cqlLibraryFunctions that are `null` are currently in development

let elementLists = ['observations', 'conditions', 'medications', 'procedures'];
module.exports = [
  // observations
  {
    id: 'Verified',
    name: 'Verified',
    inputTypes: ['observations'],
    returnType: 'observations',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'Verified'
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
    cqlTemplate: null,
    cqlLibraryFunction: null
  },
  // conditions
  {
    id: 'Confirmed',
    name: 'Confirmed',
    inputTypes: ['conditions'],
    returnType: 'conditions',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'Confirmed'
  },
  {
    id: 'Active',
    name: 'Active',
    inputTypes: ['conditions'],
    returnType: 'conditions',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'Active'
  },
  //procedures
  {
    id: 'Completed',
    name: 'Completed',
    inputTypes: ['procedures'],
    returnType: 'procedures',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'Completed'
  },
  // medications
  {
    id: 'Active',
    name: 'Active',
    inputTypes: ['medications'],
    returnType: 'medications',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'Active'
  },
  // ALL
  // Most Recent
  { id: 'MostRecentObservation', name: 'Most Recent', inputTypes: ['observations'], returnType: 'observation',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'MostRecent' },
  { id: 'MostRecentCondition', name: 'Most Recent', inputTypes: ['conditions'], returnType: 'condition',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'MostRecent' },
  { id: 'MostRecentMedication', name: 'Most Recent', inputTypes: ['medications'], returnType: 'medication',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'MostRecent' },
  { id: 'MostRecentProcedure', name: 'Most Recent', inputTypes: ['procedures'], returnType: 'procedure',   cqlTemplate: 'BaseModifier', cqlLibraryFunction: 'MostRecent' },
  // Look Back
  { id: 'LookBackObservation', type: 'LookBack', name: 'Look Back', inputTypes: ['observations'], returnType: 'observations', values: {value: undefined, unit: undefined}, cqlTemplate: null, cqlLibraryFunction: null },
  { id: 'LookBackCondition', type: 'LookBack', name: 'Look Back', inputTypes: ['conditions'], returnType: 'conditions',       values: {value: undefined, unit: undefined}, cqlTemplate: null, cqlLibraryFunction: null },
  { id: 'LookBackMedication', type: 'LookBack', name: 'Look Back', inputTypes: ['medications'], returnType: 'medications',    values: {value: undefined, unit: undefined}, cqlTemplate: null, cqlLibraryFunction: null },
  { id: 'LookBackProcedure', type: 'LookBack', name: 'Look Back', inputTypes: ['procedures'], returnType: 'procedures',       values: {value: undefined, unit: undefined}, cqlTemplate: null, cqlLibraryFunction: null },
  {
    id: 'Exists',
    name: 'Exists',
    inputTypes: elementLists,
    returnType: 'boolean',
    cqlTemplate: 'BaseModifier',
    cqlLibraryFunction: 'Exists'
  },
]