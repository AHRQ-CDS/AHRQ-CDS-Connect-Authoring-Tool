export const nestedReturnTypeErrorGroup = [
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

export const nestedModifierValidationErrorGroup = [
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
        value: 'Group 1'
      }
    ],
    uniqueId: 'Or-6121',
    childInstances: [
      {
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
                value: 'LDL Code'
              },
              {
                id: 'observation',
                type: 'observation_vsac',
                name: 'Observation',
                valueSets: [
                  {
                    name: 'LDL Code',
                    oid: '2.16.840.1.113883.3.600.872'
                  }
                ],
                static: true
              }
            ],
            type: 'element',
            uniqueId: 'GenericObservation_vsac-5116',
            modifiers: [
              {
                id: 'BooleanExists',
                name: 'Exists',
                inputTypes: [
                  'list_of_observations',
                  'list_of_conditions',
                  'list_of_medication_statements',
                  'list_of_medication_requests',
                  'list_of_procedures',
                  'list_of_allergy_intolerances',
                  'list_of_encounters',
                  'list_of_any',
                  'list_of_booleans',
                  'list_of_system_quantities',
                  'list_of_system_concepts'
                ],
                returnType: 'boolean',
                cqlTemplate: 'BaseModifier',
                cqlLibraryFunction: 'exists'
              },
              {
                id: 'CheckExistence',
                name: 'Is (Not) Null?',
                inputTypes: [
                  'list_of_observations',
                  'list_of_conditions',
                  'list_of_medication_statements',
                  'list_of_medication_requests',
                  'list_of_procedures',
                  'list_of_allergy_intolerances',
                  'list_of_encounters',
                  'list_of_any',
                  'list_of_booleans',
                  'list_of_system_quantities',
                  'list_of_system_concepts',
                  'boolean',
                  'system_quantity',
                  'system_concept',
                  'observation',
                  'condition',
                  'medication_statement',
                  'medication_request',
                  'procedure',
                  'allergy_intolerance',
                  'encounter'
                ],
                returnType: 'boolean',
                cqlTemplate: 'postModifier',
                comparisonOperator: null,
                validator: {
                  type: 'require',
                  fields: ['value'],
                  args: null
                },
                values: {}
              }
            ]
          }
        ],
        uniqueId: 'Or-219',
        fields: [
          {
            value: 'Group 1a',
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
    ]
  }
];

export const nestedElementValidationErrorGroup = [
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
                name: 'Gender'
              }
            ],
            uniqueId: 'Gender-223',
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

export const nestedDuplicateElementNamesGroups = [
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

export const nestedDuplicateGroupNamesGroups = [
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

export const nestedBaseElementUseGroups = [
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

export const nonValidatingBaseElementList = [
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
