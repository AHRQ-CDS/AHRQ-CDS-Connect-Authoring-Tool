const mockArtifact = {
  _id: null,
  name: 'Untitled Artifact',
  version: '1',
  fhirVersion: '',
  uniqueIdCounter: 0,
  expTreeInclude: {
    id: 'And',
    uniqueId: 'And-TEST-1',
    name: 'And',
    conjunction: true,
    returnType: 'boolean',
    path: '',
    childInstances: [],
    fields: [{ id: 'element_name', value: 'AND' }]
  },
  expTreeExclude: {
    id: 'Or',
    uniqueId: 'Or-TEST-1',
    name: 'Or',
    conjunction: true,
    returnType: 'boolean',
    path: '',
    childInstances: [],
    fields: [{ id: 'element_name', value: 'OR' }]
  },
  recommendations: [],
  baseElements: [],
  subpopulations: [
    {
      uniqueId: 'default-subpopulation-1',
      subpopulationName: 'Doesn\'t Meet Inclusion Criteria',
      special: true,
      special_subpopulationName: 'not "MeetsInclusionCriteria"'
    },
    {
      special: true,
      special_subpopulationName: '"MeetsExclusionCriteria"',
      subpopulationName: 'Meets Exclusion Criteria',
      uniqueId: 'default-subpopulation-2',
    },
    {
      childInstances: [],
      conjunction: true,
      expanded: true,
      id: 'And',
      name: '',
      fields: [],
      path: '',
      returnType: 'boolean',
      subpopulationName: 'Subpopulation 1',
      uniqueId: 'And-TEST-1',
    }
  ],
  parameters: [],
  errorStatement: { statements: [] }
};

export default mockArtifact;
