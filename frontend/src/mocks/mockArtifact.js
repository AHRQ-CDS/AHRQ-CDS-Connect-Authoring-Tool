const mockArtifact = {
  _id: null,
  name: 'Untitled Artifact',
  version: '1',
  uniqueIdCounter: 0,
  expTreeInclude: {
    id: 'And',
    uniqueId: 'And-TEST-1',
    name: 'And',
    conjunction: true,
    returnType: 'boolean',
    path: '',
    childInstances: [],
    parameters: []
  },
  expTreeExclude: {
    id: 'Or',
    uniqueId: 'Or-TEST-1',
    name: 'Or',
    conjunction: true,
    returnType: 'boolean',
    path: '',
    childInstances: [],
    parameters: []
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
      parameters: [],
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
