const nestedReturnTypeErrorGroup = [
  {
    childInstances: [
      {
        id: 'Or',
        name: 'Or',
        conjunction: true,
        returnType: 'boolean',
        fields: [
          {
            id: 'element_name',
            type: 'string',
            name: 'Group Name',
            value: 'Group 1a'
          }
        ],
        uniqueId: 'Or-219',
        childInstances: [
          {
            modifiers: [],
            uniqueId: 'GenericObservation_vsac-5116',
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
          }
        ]
      }
    ],
    uniqueId: 'Or-6121',
    fields: [
      {
        value: 'Group 1',
        name: 'Group Name',
        type: 'string',
        id: 'element_name'
      }
    ],
    returnType: 'boolean',
    conjunction: true,
    name: 'Or',
    id: 'Or'
  }
];

export default nestedReturnTypeErrorGroup;
