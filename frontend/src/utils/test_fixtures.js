/* eslint-disable object-curly-newline */
const elementLists = [
  'list_of_observations',
  'list_of_conditions',
  'list_of_medication_statements',
  'list_of_medication_requests',
  'list_of_procedures',
  'list_of_allergy_intolerances',
  'list_of_encounters'
];

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
    { id: 'element_name', type: 'string', name: 'Group Name', value: 'MeetsInclusionCriteria' },
    { id: 'comment', type: 'string', name: 'Comment', value: 'Includes a comment' }
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
    { id: 'element_name', type: 'string', name: 'Group Name', value: 'MeetsInclusionCriteria' },
    { id: 'comment', type: 'string', name: 'Comment', value: 'Includes a comment' }
  ],
  childInstances: []
};

const simpleObservationInstanceTree = {
  id: 'And',
  name: 'And',
  conjunction: true,
  returnType: 'boolean',
  path: '',
  uniqueId: 'And-65',
  fields: [
    { id: 'element_name', type: 'string', name: 'Group Name', value: 'MeetsInclusionCriteria' },
    { id: 'comment', type: 'textarea', name: 'Comment', value: 'Includes a comment' }
  ],
  childInstances: [
    {
      id: 'GenericObservation_vsac',
      name: 'Observation',
      returnType: 'list_of_observations',
      suppress: true,
      extends: 'Base',
      template: 'GenericObservation',
      suppressedModifiers: ['ConvertToMgPerdL'],
      fields: [
        {
          id: 'element_name',
          type: 'string',
          name: 'Element Name',
          value: 'LDL Cholesterol'
        },
        {
          id: 'comment',
          type: 'textarea',
          name: 'Comment'
        },
        {
          id: 'observation',
          type: 'observation_vsac',
          name: 'Observation',
          valueSets: [
            {
              name: 'LDL Cholesterol',
              oid: '2.16.840.1.113883.3.526.3.1573'
            }
          ],
          static: true
        }
      ],
      type: 'element',
      uniqueId: 'GenericObservation_vsac-23',
      modifiers: []
    }
  ]
};

const simpleConditionInstanceTree = {
  id: 'And',
  name: 'And',
  conjunction: true,
  returnType: 'boolean',
  path: '',
  uniqueId: 'And-34',
  fields: [
    { id: 'element_name', type: 'string', name: 'Group Name', value: 'MeetsInclusionCriteria' },
    { id: 'comment', type: 'textarea', name: 'Comment', value: 'Includes a comment' }
  ],
  childInstances: [
    {
      id: 'GenericCondition_vsac',
      name: 'Condition',
      returnType: 'list_of_conditions',
      suppress: true,
      extends: 'Base',
      template: 'GenericCondition',
      fields: [
        {
          id: 'element_name',
          type: 'string',
          name: 'Element Name',
          value: 'All Infections'
        },
        {
          id: 'comment',
          type: 'textarea',
          name: 'Comment'
        },
        {
          id: 'condition',
          type: 'condition_vsac',
          name: 'Condition',
          valueSets: [
            {
              name: 'All Infections',
              oid: '2.16.840.1.113762.1.4.1200.143'
            }
          ],
          static: true
        }
      ],
      type: 'element',
      uniqueId: 'GenericCondition_vsac-23',
      modifiers: []
    }
  ]
};

const simpleProcedureInstanceTree = {
  id: 'And',
  name: 'And',
  conjunction: true,
  returnType: 'boolean',
  path: '',
  uniqueId: 'And-32',
  fields: [
    {
      id: 'element_name',
      type: 'string',
      name: 'Group Name',
      value: 'MeetsInclusionCriteria'
    },
    {
      id: 'comment',
      type: 'textarea',
      name: 'Comment'
    }
  ],
  childInstances: [
    {
      id: 'GenericProcedure_vsac',
      name: 'Procedure',
      returnType: 'list_of_procedures',
      suppress: true,
      extends: 'Base',
      template: 'GenericProcedure',
      fields: [
        {
          id: 'element_name',
          type: 'string',
          name: 'Element Name',
          value: 'ADHD'
        },
        {
          id: 'comment',
          type: 'textarea',
          name: 'Comment'
        },
        {
          id: 'procedure',
          type: 'procedure_vsac',
          name: 'Procedure',
          valueSets: [
            {
              name: 'ADHD',
              oid: '2.16.840.1.113883.3.67.1.101.1.314'
            }
          ],
          static: true
        }
      ],
      type: 'element',
      uniqueId: 'GenericProcedure_vsac-23',
      modifiers: []
    }
  ]
};

const simpleImmunizationInstanceTree = {
  id: 'And',
  name: 'And',
  conjunction: true,
  returnType: 'boolean',
  path: '',
  fields: [
    {
      id: 'element_name',
      type: 'string',
      name: 'Group Name',
      value: 'MeetsInclusionCriteria'
    },
    {
      id: 'comment',
      type: 'textarea',
      name: 'Comment'
    }
  ],
  uniqueId: 'And-45',
  childInstances: [
    {
      id: 'GenericImmunization_vsac',
      name: 'Immunization',
      returnType: 'list_of_immunizations',
      suppress: true,
      extends: 'Base',
      template: 'GenericImmunization',
      fields: [
        {
          id: 'element_name',
          type: 'string',
          name: 'Element Name',
          value: 'CVX Vaccines Administered Vaccine Set'
        },
        {
          id: 'comment',
          type: 'textarea',
          name: 'Comment'
        },
        {
          id: 'immunization',
          type: 'immunization_vsac',
          name: 'Immunization',
          valueSets: [
            {
              name: 'CVX Vaccines Administered Vaccine Set',
              oid: '2.16.840.1.113762.1.4.1010.6'
            }
          ],
          static: true
        }
      ],
      type: 'element',
      uniqueId: 'GenericImmunization_vsac-23',
      modifiers: []
    }
  ]
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
          { id: 'max_age', type: 'number', typeOfNumber: 'integer', name: 'Maximum Age' }
        ]
      },
      {
        id: 'Gender',
        name: 'Gender',
        returnType: 'boolean',
        cannotHaveModifiers: true,
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'gender', type: 'valueset', select: 'demographics/gender', name: 'Gender' }
        ]
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
          { id: 'observation', static: true, value: 'total_cholesterol' }
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
          { id: 'observation', static: true, value: 'hdl_cholesterol' }
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
          { id: 'observation', static: true, value: 'ldl_test' }
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
          { id: 'element_name', type: 'string', name: 'Group Name' },
          { id: 'comment', type: 'string', name: 'Comment' }
        ]
      },
      {
        id: 'Or',
        name: 'Or',
        conjunction: true,
        returnType: 'boolean',
        fields: [
          { id: 'element_name', type: 'string', name: 'Group Name' },
          { id: 'comment', type: 'string', name: 'Comment' }
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
        fields: [{ id: 'element_name', type: 'string', name: 'Group Name' }]
      },
      {
        id: 'Union',
        name: 'Union',
        conjunction: true,
        returnType: 'list_of_any',
        fields: [{ id: 'element_name', type: 'string', name: 'Group Name' }]
      }
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
  { value: 'device', label: 'Device', vsacAuthRequired: true, template: 'GenericDevice_vsac' },
  { value: 'encounter', label: 'Encounter', vsacAuthRequired: true, template: 'GenericEncounter_vsac' },
  { value: 'externalCqlElement', label: 'External CQL', vsacAuthRequired: false },
  { value: 'immunization', label: 'Immunization', vsacAuthRequired: true, template: 'GenericImmunization_vsac' },
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
          { id: 'max_age', type: 'number', typeOfNumber: 'integer', name: 'Maximum Age' }
        ]
      },
      {
        id: 'Gender',
        name: 'Gender',
        returnType: 'boolean',
        cannotHaveModifiers: true,
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'gender', type: 'valueset', select: 'demographics/gender', name: 'Gender' }
        ]
      }
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
        fields: [{ id: 'observation', type: 'observation', name: 'Observation' }]
      },
      {
        id: 'GenericObservation_vsac',
        name: 'Observation',
        returnType: 'list_of_observations',
        suppress: true,
        extends: 'Base',
        template: 'GenericObservation',
        suppressedModifiers: ['WithUnit', 'ConvertToMgPerdL'], // checkInclusionInVS is assumed to be suppressed
        fields: [{ id: 'observation', type: 'observation_vsac', name: 'Observation' }]
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
      valueSets: [
        { name: 'VS', oid: '1.2.3' },
        { name: 'VS2', oid: '2.3.4' }
      ],
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
      valueSets: [
        { name: 'VS', oid: '1.2.3' },
        { name: 'VS2', oid: '2.3.4' }
      ],
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
  ]
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
      valueSets: [
        { name: 'VS', oid: '1.2.3' },
        { name: 'VS2', oid: '2.3.4' }
      ],
      codes: [
        { code: '123-4', codeSystem: { name: 'TestName', id: 'TestId' } },
        { code: '456-7', codeSystem: { name: 'TestNameA', id: 'TestIdA' } }
      ]
    }
  ],
  modifiers: []
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
      valueSets: [
        { name: 'VS', oid: '1.2.3' },
        { name: 'VS2', oid: '2.3.4' }
      ],
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
  ]
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
    { id: 'element_name', type: 'string', name: 'Group Name', value: 'UnionListName' },
    { id: 'comment', type: 'string', name: 'Comment', value: 'UnionListName Comment' }
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
      value: { id: 'element-1', type: 'Observation' }
    }
  ],
  modifiers: []
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
  navigation: {
    activeTab: 0,
    scrollToId: null
  },
  templates: {
    templates: elementGroups
  },
  vsac: {
    isAuthenticating: false,
    authStatus: null,
    authStatusText: '',
    isValidatingCode: false,
    isValidCode: null,
    codeData: null,
    apiKey: null
  }
};

export { default as artifact } from '../mocks/artifacts/mockArtifact';
export {
  instanceTree,
  emptyInstanceTree,
  simpleObservationInstanceTree,
  simpleConditionInstanceTree,
  simpleProcedureInstanceTree,
  simpleImmunizationInstanceTree,
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
