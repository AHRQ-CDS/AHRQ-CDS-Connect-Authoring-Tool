const nestedDuplicateElementNamesGroups = [
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
            id: 'Gender',
            name: 'Gender',
            returnType: 'boolean',
            cannotHaveModifiers: true,
            validator: {
              type: 'require',
              fields: ['gender'],
              args: null
            },
            fields: [
              {
                id: 'element_name',
                type: 'string',
                name: 'Element Name',
                value: 'Gender1'
              },
              {
                id: 'gender',
                type: 'valueset',
                select: 'demographics/gender',
                name: 'Gender',
                value: {
                  id: 'male',
                  name: 'Male',
                  value: "'male'"
                }
              }
            ],
            uniqueId: 'Gender-223',
            modifiers: []
          },
          {
            id: 'Gender',
            name: 'Gender',
            returnType: 'boolean',
            cannotHaveModifiers: true,
            validator: {
              type: 'require',
              fields: ['gender'],
              args: null
            },
            fields: [
              {
                id: 'element_name',
                type: 'string',
                name: 'Element Name',
                value: 'Gender1'
              },
              {
                id: 'gender',
                type: 'valueset',
                select: 'demographics/gender',
                name: 'Gender',
                value: {
                  id: 'female',
                  name: 'Female',
                  value: "'female'"
                }
              }
            ],
            uniqueId: 'Gender-233',
            modifiers: []
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

export default nestedDuplicateElementNamesGroups;
