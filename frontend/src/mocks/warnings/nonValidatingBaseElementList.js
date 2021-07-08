const nonValidatingBaseElementList = [
  {
    id: 'Union',
    name: 'Union',
    conjunction: true,
    returnType: 'list_of_any',
    fields: [
      {
        id: 'element_name',
        type: 'string',
        name: 'Group Name',
        value: 'Base Element 1'
      }
    ],
    uniqueId: 'Union-283',
    childInstances: [
      {
        modifiers: [],
        uniqueId: 'GenericObservation_vsac-250',
        type: 'element',
        fields: [
          {
            value: 'LDL Code',
            name: 'Element Name',
            type: 'string',
            id: 'element_name'
          },
          {
            static: true,
            valueSets: [
              {
                oid: '2.16.840.1.113883.3.600.872',
                name: 'LDL Code'
              }
            ],
            name: 'Observation',
            type: 'observation_vsac',
            id: 'observation'
          }
        ],
        suppressedModifiers: ['ConvertToMgPerdL'],
        template: 'GenericObservation',
        extends: 'Base',
        suppress: true,
        returnType: 'list_of_observations',
        name: 'Observation',
        id: 'GenericObservation_vsac'
      },
      {
        modifiers: [],
        uniqueId: 'GenericCondition_vsac-386',
        type: 'element',
        fields: [
          {
            value: 'Diabetes',
            name: 'Element Name',
            type: 'string',
            id: 'element_name'
          },
          {
            static: true,
            valueSets: [
              {
                oid: '2.16.840.1.113883.3.464.1003.103.12.1001',
                name: 'Diabetes'
              }
            ],
            name: 'Condition',
            type: 'condition_vsac',
            id: 'condition'
          }
        ],
        template: 'GenericCondition',
        extends: 'Base',
        suppress: true,
        returnType: 'list_of_conditions',
        name: 'Condition',
        id: 'GenericCondition_vsac'
      }
    ],
    path: '',
    usedBy: []
  }
];

export default nonValidatingBaseElementList;
