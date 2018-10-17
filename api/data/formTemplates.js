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
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
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
        validator: {type: 'requiredIfThenOne', fields: ['unit_of_time'], args: ['min_age', 'max_age']},
        suppressedModifiers: ['BooleanNot', 'BooleanComparison'],
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
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
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
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
        parameters: [
          { id: 'observation', type: 'observation_vsac', name: 'Observation' },
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
        parameters: [
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
        parameters: [
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
        parameters: [
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
        parameters: [
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
        parameters: [
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
        parameters: [
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
        parameters: [
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
  }
];
