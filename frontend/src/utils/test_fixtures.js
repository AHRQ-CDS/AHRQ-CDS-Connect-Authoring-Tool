/* eslint-disable object-curly-newline */
const elementLists = ['list_of_observations', 'list_of_conditions', 'list_of_medication_statements',
  'list_of_medication_requests', 'list_of_procedures', 'list_of_allergy_intolerances', 'list_of_encounters'];

/**
 * Example TemplateInstances
 */
const instanceTree = {
  id: 'And',
  name: 'And',
  conjunction: true,
  returnType: 'boolean',
  path: '',
  uniqueId: 'And-1',
  fields: [
    { id: 'element_name', type: 'string', name: 'Group Name', value: 'MeetsInclusionCriteria' }
  ],
  childInstances: [
    {
      id: 'AgeRange',
      name: 'Age Range',
      returnType: 'boolean',
      fields: [
        {
          id: 'element_name',
          type: 'string',
          name: 'Element Name',
          value: 'name1'
        },
        {
          id: 'min_age',
          type: 'number',
          typeOfNumber: 'integer',
          name: 'Minimum Age',
          value: 30
        },
        {
          id: 'max_age',
          type: 'number',
          typeOfNumber: 'integer',
          name: 'Maximum Age',
          value: 45
        },
        {
          id: 'unit_of_time',
          type: 'valueset',
          select: 'demographics/units_of_time',
          name: 'Unit of Time',
          value: {
            id: 'a',
            name: 'years',
            value: 'AgeInYears()'
          }
        }
      ],
      modifiers: [],
      suppressedModifiers: ['BooleanNot', 'BooleanComparison'],
      uniqueId: 'AgeRange-3'
    },
    {
      id: 'LDLTest',
      name: 'LDL Test',
      extends: 'GenericObservation',
      type: 'element',
      returnType: 'list_of_observations',
      fields: [
        {
          id: 'element_name',
          name: 'Element Name',
          type: 'string',
          value: 'LDL_Test'
        },
        {
          id: 'observation',
          name: 'Observation',
          static: true,
          type: 'observation',
          value: 'ldl_test'
        }
      ],
      modifiers: [],
      suppressedModifiers: ['ConceptValue'],
      uniqueId: 'LDLTest-4'
    }
  ]
};

const emptyInstanceTree = {
  id: 'And',
  name: 'And',
  conjunction: true,
  returnType: 'boolean',
  path: '',
  uniqueId: 'And-1',
  fields: [
    { id: 'element_name', type: 'string', name: 'Group Name', value: 'MeetsInclusionCriteria' }
  ],
  childInstances: []
};

const elementGroups = [
  {
    id: 0,
    icon: 'user',
    name: 'Demographics',
    entries: [
      {
        id: 'AgeRange',
        name: 'Age Range',
        returnType: 'boolean',
        suppressedModifiers: ['BooleanNot', 'BooleanComparison'],
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'min_age', type: 'number', typeOfNumber: 'integer', name: 'Minimum Age' },
          { id: 'max_age', type: 'number', typeOfNumber: 'integer', name: 'Maximum Age' },
        ],
      },
      {
        id: 'Gender',
        name: 'Gender',
        returnType: 'boolean',
        cannotHaveModifiers: true,
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'gender', type: 'valueset', select: 'demographics/gender', name: 'Gender' },
        ],
      }
    ]
  },
  {
    id: 1,
    icon: 'eye',
    name: 'Observations',
    entries: [
      {
        id: 'TotalCholesterol',
        name: 'Total Cholesterol',
        extends: 'GenericObservation',
        returnType: 'list_of_observations',
        suppressedModifiers: ['ConceptValue'],
        fields: [
          { id: 'element_name', value: 'TotalCholesterol' },
          { id: 'observation', static: true, value: 'total_cholesterol' },
        ]
      },
      {
        id: 'HDLCholesterol',
        name: 'HDL Cholesterol',
        extends: 'GenericObservation',
        returnType: 'list_of_observations',
        suppressedModifiers: ['ConceptValue'],
        fields: [
          { id: 'element_name', value: 'HDLCholesterol' },
          { id: 'observation', static: true, value: 'hdl_cholesterol' },
        ]
      },
      {
        id: 'LDLTest',
        name: 'LDL Test',
        extends: 'GenericObservation',
        returnType: 'list_of_observations',
        suppressedModifiers: ['ConceptValue'],
        fields: [
          { id: 'element_name', value: 'LDL_Test' },
          { id: 'observation', static: true, value: 'ldl_test' },
        ]
      },
      {
        id: 'Base',
        name: 'Base Template',
        type: 'element',
        fields: [{ id: 'element_name', type: 'string', name: 'Element Name' }]
      },
      {
        id: 'GenericObservation',
        name: 'Observation',
        returnType: 'list_of_observations',
        suppress: true,
        extends: 'Base',
        fields: [
          { id: 'element_name', type: 'string' },
          { id: 'observation', type: 'observation', name: 'Observation' }
        ],
        type: 'element'
      }
    ]
  },
  {
    id: 2,
    icon: 'gear',
    name: 'Operations',
    entries: [
      {
        id: 'And',
        name: 'And',
        conjunction: true,
        returnType: 'boolean',
        fields: [
          { id: 'element_name', type: 'string', name: 'Group Name' }
        ]
      },
      {
        id: 'Or',
        name: 'Or',
        conjunction: true,
        returnType: 'boolean',
        fields: [
          { id: 'element_name', type: 'string', name: 'Group Name' }
        ]
      }
    ]
  },
  {
    id: 3,
    icon: 'gear',
    name: 'List Operations',
    entries: [
      {
        id: 'Intersect',
        name: 'Intersect',
        conjunction: true,
        returnType: 'list_of_any',
        fields: [
          { id: 'element_name', type: 'string', name: 'Group Name' }
        ]
      },
      {
        id: 'Union',
        name: 'Union',
        conjunction: true,
        returnType: 'list_of_any',
        fields: [
          { id: 'element_name', type: 'string', name: 'Group Name' }
        ]
      },
    ]
  }
];

const genericElementTypes = [
  {
    value: 'allergy_intolerance',
    label: 'Allergy Intolerance',
    vsacAuthRequired: true,
    template: 'GenericAllergyIntolerance_vsac'
  },
  { value: 'baseElements', label: 'Base Elements', vsacAuthRequired: false },
  { value: 'condition', label: 'Condition', vsacAuthRequired: true, template: 'GenericCondition_vsac' },
  { value: 'demographics', label: 'Demographics', vsacAuthRequired: false },
  { value: 'encounter', label: 'Encounter', vsacAuthRequired: true, template: 'GenericEncounter_vsac' },
  { value: 'externalCqlElement', label: 'External CQL', vsacAuthRequired: false },
  {
    value: 'medicationStatement',
    label: 'Medication Statement',
    vsacAuthRequired: true,
    template: 'GenericMedicationStatement_vsac'
  },
  {
    value: 'medicationRequest',
    label: 'Medication Request',
    vsacAuthRequired: true,
    template: 'GenericMedicationRequest_vsac'
  },
  { value: 'observation', label: 'Observation', vsacAuthRequired: true, template: 'GenericObservation_vsac' },
  { value: 'booleanParameter', label: 'Parameters', vsacAuthRequired: false },
  { value: 'procedure', label: 'Procedure', vsacAuthRequired: true, template: 'GenericProcedure_vsac' }
];

const genericElementGroups = [
  {
    id: 1,
    icon: 'user',
    name: 'Demographics',
    entries: [
      {
        id: 'AgeRange',
        name: 'Age Range',
        returnType: 'boolean',
        suppressedModifiers: ['BooleanNot', 'BooleanComparison'],
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'min_age', type: 'number', typeOfNumber: 'integer', name: 'Minimum Age' },
          { id: 'max_age', type: 'number', typeOfNumber: 'integer', name: 'Maximum Age' },
        ],
      },
      {
        id: 'Gender',
        name: 'Gender',
        returnType: 'boolean',
        cannotHaveModifiers: true,
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'gender', type: 'valueset', select: 'demographics/gender', name: 'Gender' },
        ],
      },
    ]
  },
  {
    id: 2,
    icon: 'eye',
    name: 'Observations',
    entries: [
      {
        id: 'GenericObservation',
        name: 'Observation',
        returnType: 'list_of_observations',
        suppress: true,
        extends: 'Base',
        fields: [
          { id: 'observation', type: 'observation', name: 'Observation' },
        ],
      },
      {
        id: 'GenericObservation_vsac',
        name: 'Observation',
        returnType: 'list_of_observations',
        suppress: true,
        extends: 'Base',
        template: 'GenericObservation',
        suppressedModifiers: ['WithUnit', 'ConvertToMgPerdL'], // checkInclusionInVS is assumed to be suppressed
        fields: [
          { id: 'observation', type: 'observation_vsac', name: 'Observation' },
        ]
      }
    ]
  }
];

const genericInstance = {
  id: 'GenericObservation_vsac',
  name: 'Observation',
  returnType: 'list_of_observations',
  suppress: true,
  extends: 'Base',
  type: 'element',
  template: 'GenericObservation',
  suppressedModifiers: ['WithUnit', 'ConvertToMgPerdL'], // checkInclusionInVS is assumed to be suppressed
  fields: [
    { id: 'element_name', name: 'Element Name', type: 'string', value: 'VSAC Observation' },
    {
      id: 'observation',
      type: 'observation_vsac',
      name: 'Observation',
      valueSets: [{ name: 'VS', oid: '1.2.3' }, { name: 'VS2', oid: '2.3.4' }],
      codes: [
        { code: '123-4', codeSystem: { name: 'TestName', id: 'TestId' } },
        { code: '456-7', codeSystem: { name: 'TestNameA', id: 'TestIdA' } }
      ]
    }
  ],
  modifiers: [],
  uniqueId: 'uuid'
};

const genericInstanceWithModifiers = {
  id: 'GenericObservation_vsac',
  name: 'Observation',
  returnType: 'list_of_observations',
  suppress: true,
  extends: 'Base',
  type: 'element',
  template: 'GenericObservation',
  suppressedModifiers: ['WithUnit', 'ConvertToMgPerdL'], // checkInclusionInVS is assumed to be suppressed
  fields: [
    { id: 'element_name', name: 'Element Name', type: 'string', value: 'VSAC Observation' },
    {
      id: 'observation',
      type: 'observation_vsac',
      name: 'Observation',
      valueSets: [{ name: 'VS', oid: '1.2.3' }, { name: 'VS2', oid: '2.3.4' }],
      codes: [
        { code: '123-4', codeSystem: { name: 'TestName', id: 'TestId' } },
        { code: '456-7', codeSystem: { name: 'TestNameA', id: 'TestIdA' } }
      ]
    }
  ],
  modifiers: [
    {
      id: 'VerifiedObservation',
      name: 'Verified',
      inputTypes: ['list_of_observations'],
      returnType: 'list_of_observations',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.Verified'
    },
    {
      id: 'BooleanExists',
      name: 'Exists',
      inputTypes: elementLists,
      returnType: 'boolean',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'exists'
    },
    {
      id: 'BooleanNot',
      name: 'Not',
      inputTypes: ['boolean'],
      returnType: 'boolean',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'not'
    }
  ],
};

const genericBaseElementInstance = {
  id: 'GenericObservation_vsac',
  name: 'Observation',
  returnType: 'list_of_observations',
  suppress: true,
  extends: 'Base',
  type: 'element',
  template: 'GenericObservation',
  usedBy: ['testId1'],
  suppressedModifiers: ['ConvertToMgPerdL'], // checkInclusionInVS is assumed to be suppressed
  fields: [
    { id: 'element_name', name: 'Element Name', type: 'string', value: 'VSAC Observation' },
    {
      id: 'observation',
      type: 'observation_vsac',
      name: 'Observation',
      valueSets: [{ name: 'VS', oid: '1.2.3' }, { name: 'VS2', oid: '2.3.4' }],
      codes: [
        { code: '123-4', codeSystem: { name: 'TestName', id: 'TestId' } },
        { code: '456-7', codeSystem: { name: 'TestNameA', id: 'TestIdA' } }
      ]
    }
  ],
  modifiers: [],
};

const genericBaseElementInstanceWithModifiers = {
  id: 'GenericObservation_vsac',
  name: 'Observation',
  returnType: 'list_of_observations',
  suppress: true,
  extends: 'Base',
  type: 'element',
  template: 'GenericObservation',
  usedBy: ['testId1'],
  suppressedModifiers: ['ConvertToMgPerdL'], // checkInclusionInVS is assumed to be suppressed
  fields: [
    { id: 'element_name', name: 'Element Name', type: 'string', value: 'VSAC Observation' },
    {
      id: 'observation',
      type: 'observation_vsac',
      name: 'Observation',
      valueSets: [{ name: 'VS', oid: '1.2.3' }, { name: 'VS2', oid: '2.3.4' }],
      codes: [
        { code: '123-4', codeSystem: { name: 'TestName', id: 'TestId' } },
        { code: '456-7', codeSystem: { name: 'TestNameA', id: 'TestIdA' } }
      ]
    }
  ],
  modifiers: [
    {
      id: 'VerifiedObservation',
      name: 'Verified',
      inputTypes: ['list_of_observations'],
      returnType: 'list_of_observations',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.Verified'
    },
    {
      id: 'BooleanExists',
      name: 'Exists',
      inputTypes: elementLists,
      returnType: 'boolean',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'exists'
    },
    {
      id: 'BooleanNot',
      name: 'Not',
      inputTypes: ['boolean'],
      returnType: 'boolean',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'not'
    }
  ],
};

const genericBaseElementListInstance = {
  id: 'Union',
  name: 'Union',
  conjunction: true,
  returnType: 'list_of_observations',
  path: '',
  uniqueId: 'Union-1',
  usedBy: ['testId1'],
  fields: [
    { id: 'element_name', type: 'string', name: 'Group Name', value: 'UnionListName' }
  ],
  childInstances: [genericInstance]
};

const genericBaseElementUseInstance = {
  id: 'GenericObservation_vsac',
  name: 'BaseElement',
  returnType: 'boolean',
  type: 'baseElement',
  template: 'GenericStatement',
  fields: [
    { id: 'element_name', name: 'Element Name', type: 'string', value: 'Base Element Observation' },
    {
      id: 'baseElementReference',
      type: 'reference',
      name: 'reference',
      value: { id: 'originalBaseElementId', type: 'Observation' }
    }
  ],
  modifiers: [],
};

const reduxState = {
  artifacts: {
    artifact: {},
    artifacts: [],
    artifactSaved: true,
    downloadArtifact: {
      elmErrors: []
    },
    executeArtifact: {
      results: null,
      isExecuting: false
    },
    librariesInUse: [],
    names: []
  },
  auth: {
    isAuthenticated: true,
    isLoggingOut: false,
    username: ''
  },
  errors: {
    errorMessage: ''
  },
  externalCQL: {
    addExternalCqlLibrary: {
      isAdding: false
    },
    loadExternalCqlLibraryDetails: {
      isLoading: false
    },
    externalCQLLibraryParents: {},
    externalCqlList: []
  },
  modifiers: {},
  templates: {
    templates: elementGroups
  },
  testing: {
    patients: [],
    addPatient: {
      isAdding: false
    }
  },
  valueSets: {
    valueSets: []
  },
  vsac: {
    authStatus: '',
    detailsCodes: [],
    detailsCodesErrorMessage: '',
    isAuthenticating: false,
    isValidatingCode: false,
    isRetrievingDetails: false,
    isSearchingVSAC: false,
    searchCount: 0,
    searchResults: []
  }
};

export { default as artifact } from '../mocks/mockArtifact';
export {
  instanceTree,
  emptyInstanceTree,
  elementGroups,
  genericElementTypes,
  genericElementGroups,
  genericInstance,
  genericInstanceWithModifiers,
  genericBaseElementInstance,
  genericBaseElementInstanceWithModifiers,
  genericBaseElementListInstance,
  genericBaseElementUseInstance,
  reduxState
};
