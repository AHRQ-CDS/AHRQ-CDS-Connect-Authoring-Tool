const nestedDuplicateGroupNamesGroups = [
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
        value: 'Group1'
      }
    ],
    uniqueId: 'Or-7216',
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
            value: 'Group1a'
          }
        ],
        uniqueId: 'Or-8257',
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
            uniqueId: 'Gender-6189',
            modifiers: []
          }
        ]
      },
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
            value: 'Group1a'
          }
        ],
        uniqueId: 'Or-10373',
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
                value: 'Gender2'
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
            uniqueId: 'Gender-9298',
            modifiers: []
          }
        ]
      }
    ]
  }
];

export default nestedDuplicateGroupNamesGroups;
