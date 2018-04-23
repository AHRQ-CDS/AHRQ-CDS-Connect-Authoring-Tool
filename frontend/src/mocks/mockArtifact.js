const mockArtifact = {
  _id: null,
  name: 'Untitled Artifact',
  version: '1',
  uniqueIdCounter: 0,
  expTreeInclude: {
    id: 'And',
    uniqueId: 'And-TEST-1',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    path: '',
    childInstances: [],
    parameters: []
  },
  expTreeExclude: {
    id: 'And',
    uniqueId: 'And-TEST-1',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    path: '',
    childInstances: [],
    parameters: []
  },
  recommendations: [],
  subelements: [],
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
