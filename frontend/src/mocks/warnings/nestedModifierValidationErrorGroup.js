const nestedModifierValidationErrorGroup = [
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

export default nestedModifierValidationErrorGroup;
