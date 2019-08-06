module.exports = [
  {
    id: 0,
    icon: 'user',
    suppress: true,
    name: 'Generic',
    entries: [
      {
        id: 'Base',
        name: 'Base Template',
        type: 'element',
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'comment', type: 'textarea', name: 'Comment' }
        ],
      }
    ]
  },
  {
    id: 1,
    icon: 'user',
    name: 'Demographics',
    entries: [
      {
        id: 'AgeRange',
        name: 'Age Range',
        returnType: 'boolean',
        validator: {type: 'requiredIfThenOne', fields: ['unit_of_time', 'min_age', 'max_age']},
        suppressedModifiers: ['BooleanNot', 'BooleanComparison'],
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'comment', type: 'textarea', name: 'Comment' },
          { id: 'min_age', type: 'number', typeOfNumber: 'integer', name: 'Minimum Age' },
          { id: 'max_age', type: 'number', typeOfNumber: 'integer', name: 'Maximum Age' },
          { id: 'unit_of_time', type: 'valueset', select: 'demographics/units_of_time', name: 'Unit of Time' },
        ],
      },
      {
        id: 'Gender',
        name: 'Gender',
        returnType: 'boolean',
        cannotHaveModifiers: true,
        validator: {type: 'require', fields: ['gender'], args: null},
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'comment', type: 'textarea', name: 'Comment' },
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
        id: 'GenericObservation_vsac',
        name: 'Observation',
        returnType: 'list_of_observations',
        suppress: true,
        extends: 'Base',
        template: 'GenericObservation',
        suppressedModifiers: ['ConvertToMgPerdL'], // checkInclusionInVS is assumed to be suppressed
        fields: [
          { id: 'observation', type: 'observation_vsac', name: 'Observation' }
        ]
      },
    ]
  },
  {
    id: 3,
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
          { id: 'comment', type: 'textarea', name: 'Comment' }
        ]
      },
      {
        id: 'Or',
        name: 'Or',
        conjunction: true,
        returnType: 'boolean',
        fields: [
          { id: 'element_name', type: 'string', name: 'Group Name' },
          { id: 'comment', type: 'textarea', name: 'Comment' }
        ]
      },
    ]
  },
  {
    id: 4,
    icon: 'stethoscope',
    name: 'Conditions',
    entries: [
      {
        id: 'GenericCondition_vsac',
        name: 'Condition',
        returnType: 'list_of_conditions',
        suppress: true,
        extends: 'Base',
        template: 'GenericCondition',
        fields: [
          { id: 'condition', type: 'condition_vsac', name: 'Condition' }
        ]
      },
    ]
  },
  {
    id: 5,
    icon: 'medkit',
    name: 'Medications',
    entries: [
      {
        id: 'GenericMedicationStatement_vsac',
        name: 'Medication Statement',
        returnType: 'list_of_medication_statements',
        suppress: true,
        extends: 'Base',
        template: 'GenericMedicationStatement',
        fields: [
          { id: 'medicationStatement', type: 'medicationStatement_vsac', name: 'Medication Statement' }
        ]
      },
      {
        id: 'GenericMedicationOrder_vsac',
        name: 'Medication Order',
        returnType: 'list_of_medication_orders',
        suppress: true,
        extends: 'Base',
        template: 'GenericMedicationOrder',
        fields: [
          { id: 'medicationOrder', type: 'medicationOrder_vsac', name: 'Medication Order' }
        ]
      },
    ]
  },
  {
    id: 6,
    icon: 'scissors',
    name: 'Procedures',
    entries: [
      {
        id: 'GenericProcedure_vsac',
        name: 'Procedure',
        returnType: 'list_of_procedures',
        suppress: true,
        extends: 'Base',
        template: 'GenericProcedure',
        fields: [
          { id: 'procedure', type: 'procedure_vsac', name: 'Procedure' }
        ]
      },
    ]
  },
  {
    id: 7,
    icon: 'sign-in',
    name: 'Parameters',
    entries: [
      {
        id: 'Boolean',
        name: 'Boolean',
        type: 'parameter',
        returnType: 'boolean',
        extends: 'Base',
        fields: [
          { id: 'default', type: 'boolean', value: 'true', name: 'Default' }
        ],
      },
    ]
  },
  {
    id: 8,
    icon: 'ambulance',
    name: 'Encounters',
    entries: [
      {
        id: 'GenericEncounter_vsac',
        name: 'Encounter',
        returnType: 'list_of_encounters',
        suppress: true,
        extends: 'Base',
        template: 'GenericEncounter',
        fields: [
          { id: 'encounter', type: 'encounter_vsac', name: 'Encounter' }
        ]
      },
    ]
  },
  {
    id: 9,
    icon: 'thermometer-3',
    name: 'Allergy Intolerances',
    entries: [
      {
        id: 'GenericAllergyIntolerance_vsac',
        name: 'Allergy Intolerance',
        returnType: 'list_of_allergy_intolerances',
        suppress: true,
        extends: 'Base',
        template: 'GenericAllergyIntolerance',
        fields: [
          { id: 'allergyIntolerance', type: 'allergyIntolerance_vsac', name: 'Allergy Intolerance' }
        ]
      },
    ]
  },
  {
    id: 10,
    icon: 'sign-in',
    name: 'Base Elements',
    entries: []
  },
  {
    id: 11,
    icon: 'gear',
    name: 'List Operations',
    entries: [
      {
        id: 'Intersect',
        name: 'Intersect',
        conjunction: true,
        returnType: 'list_of_any',
        fields: [
          { id: 'element_name', type: 'string', name: 'Group Name' },
          { id: 'comment', type: 'textarea', name: 'Comment' }
        ]
      },
      {
        id: 'Union',
        name: 'Union',
        conjunction: true,
        returnType: 'list_of_any',
        fields: [
          { id: 'element_name', type: 'string', name: 'Group Name' },
          { id: 'comment', type: 'textarea', name: 'Comment' }
        ]
      },
    ]
  },
  {
    id: 12,
    icon: 'sign-in',
    name: 'External CQL',
    entries: []
  },
];
