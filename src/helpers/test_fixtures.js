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
  parameters: [
    { id: 'element_name', type: 'string', name: 'Group Name', value: 'MeetsInclusionCriteria' }
  ],
  childInstances: [
    {
      id: 'AgeRange',
      name: 'Age Range',
      returnType: 'boolean',
      parameters: [
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
      parameters: [
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
        parameters: [
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
        parameters: [
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
        parameters: [
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
        parameters: [
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
        parameters: [
          { id: 'element_name', value: 'LDL_Test' },
          { id: 'observation', static: true, value: 'ldl_test' },
        ]
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
        parameters: [
          { id: 'element_name', type: 'string', name: 'Group Name' }
        ]
      },
      {
        id: 'Or',
        name: 'Or',
        conjunction: true,
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Group Name' }
        ]
      }
    ]
  }
];

export {
  instanceTree,
  elementGroups
};
