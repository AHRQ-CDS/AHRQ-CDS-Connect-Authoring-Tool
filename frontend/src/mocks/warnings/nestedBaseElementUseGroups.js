const nestedBaseElementUseGroups = [
  {
    childInstances: [
      {
        childInstances: [
          {
            modifiers: [
              {
                cqlLibraryFunction: 'not',
                cqlTemplate: 'BaseModifier',
                returnType: 'boolean',
                inputTypes: ['boolean'],
                name: 'Not',
                id: 'BooleanNot'
              }
            ],
            uniqueId: 'Gender610-3616',
            fields: [
              {
                value: 'Gender1',
                name: 'Element Name',
                type: 'string',
                id: 'element_name'
              },
              {
                static: true,
                value: {
                  type: 'Gender',
                  id: 'Gender-2564'
                },
                name: 'reference',
                type: 'reference',
                id: 'baseElementReference'
              }
            ],
            returnType: 'boolean',
            template: 'GenericStatement',
            type: 'baseElement',
            name: 'Base Element',
            id: 'Gender610'
          }
        ],
        uniqueId: 'Or-4626',
        fields: [
          {
            value: 'Group1a',
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
    ],
    uniqueId: 'Or-7216',
    fields: [
      {
        value: 'Group1',
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

export default nestedBaseElementUseGroups;
