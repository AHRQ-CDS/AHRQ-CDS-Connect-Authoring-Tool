

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
        id: 'GenericObservation',
        name: 'Observation',
        returnType: 'list_of_observations',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'observation', type: 'observation', name: 'Observation' },
        ],
      },
      {
        id: 'TotalCholesterol',
        name: 'Total Cholesterol',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: "TotalCholesterol"},
          { id: 'observation', static: true, value: "total_cholesterol"},
        ]
      },
      {
        id: 'HDLCholesterol',
        name: 'HDL Cholesterol',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: "HDLCholesterol"},
          { id: 'observation', static: true, value: "hdl_cholesterol"},
        ]
      },
      {
        id: 'LDLCholesterol',
        name: 'LDL Cholesterol',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: "LDLCholesterol"},
          { id: 'observation', static: true, value: "ldl_cholesterol"},
        ]
      },
      {
        id: 'SystolicBloodPressure',
        name: 'Systolic Blood Pressure',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: "SystolicBloodPressure"},
          { id: 'observation', static: true, value: "systolic_blood_pressure"},
        ]
      },
      {
        id: 'ASCVDRiskAssessment',
        name: 'ASCVD Risk Assessment',
        extends: 'GenericObservation',
        template: 'ObservationByConcept',
        parameters: [
          { id: 'element_name', value: "MostRecentASCVDRiskAssessmentResult"},
          { id: 'observation', static: true, value: "ascvd_risk_assessment"},
        ]
      },
      {
        id: 'IsSmoker',
        name: 'Is Smoker',
        template: 'ObservationByConcept',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: "IsSmoker"},
          { id: 'observation',  static: true, value: "smoker"},
        ]
      },
      {
        id: 'Breastfeeding',
        name: 'Breastfeeding',
        template: 'Breastfeeding',
        returnType: 'boolean',
        extends: 'Base',
        parameters: [
          { id: 'element_name', value: "IsBreastfeeding"},
          { id: 'observation', type:'breastfeeding', static: true, value: "breastfeeding"}
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
        returnType: 'boolean',
        extends: 'Base',
        template: 'And',
        parameters: [
          { id: 'element_name', name: 'Element Name' },
          { id: 'components', type: 'list', subType: 'boolean', value: [undefined, undefined], name: 'Elements' }
        ],
      },
      {
        id: 'Or',
        name: 'Or',
        returnType: 'boolean',
        extends: 'Base',
        template: 'Or',
        parameters: [
          { id: 'element_name', name: 'Element Name' },
          { id: 'components', type: 'list', subType: 'boolean', value: [undefined, undefined], name: 'Elements' }
        ],
      },
      {
        id: 'String',
        name: 'String',
        extends: 'Base',
        returnType: 'string',
        template: 'String',
        parameters: [
          { id: 'element_value', type: 'string', name: 'Value' }
        ],
      },
      {
        id: 'Comparison',
        name: 'Comparison',
        returnType: 'boolean',
        template: 'Comparison',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'observation', type: 'list', category: 'comparison', subType: 'system_quantity', value: [undefined], name: 'Observation' },
          { id: 'comparison', type: 'dropdown', value: null, name: 'Operator', option:'comparisonOption'}, // Specify desires options at top of TemplateInstance.js
          { id: 'comparison_bound', type: 'number', typeOfNumber: 'float', name: 'Comparison Bound'},
          { id: 'checkbox', type: 'checkbox', name: 'Double Sided?', checked: false}
        ]
      },
      {
        id: 'If',
        name: 'If',
        returnType: 'if',
        extends: 'Base',
        template: 'If',
        parameters: [
          { id: 'components', type: 'if', name: 'Elements', value: [{},{else: true, block: ''}]}
        ],
      },
      {
        id: 'Not',
        name: 'Not',
        returnType: 'boolean',
        extends: 'Base',
        template: 'Not',
        parameters: [
          { id: 'components', type: 'list',subType: 'boolean',value: [undefined], name: 'Elements' }
        ],
      },
      {
        id: 'BooleanComparison',
        name: 'Boolean Comparison',
        returnType: 'boolean',
        extends: 'Base',
        template: 'isComparison',
        parameters: [
          { id: 'components', type: 'list',subType: 'boolean', value: [undefined], name: 'Elements' },
          { id: 'dropdown', type: 'dropdown', value: null, name: 'Comparison', option:'booleanCheckingOption' }, // Specify desires options at top of TemplateInstance.js
        ],
      },
      {
        id: 'checkIfNull',
        name: 'Check if Null',
        returnType: 'boolean',
        extends: 'Base',
        template: 'isComparison',
        parameters: [
          { id: 'components', type: 'nullCheckingParameter', value: [undefined], name: 'Elements' },
          { id: 'dropdown', type: 'dropdown', value: null, name: 'Comparison', option: 'nullCheckingOption' }, // Specify desires options at top of TemplateInstance.js
        ],
      },
      {
        id: 'Case',
        name: 'Case',
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          {
            id: 'components',
            type: 'case',
            value: {
              cases: [{ case: null, result: null }],
              default: null,
              variable: null
            },
            name: 'Elements' }
        ],
      }
    ]
  },
  {
    id: 4,
    icon: 'stethoscope',
    name: 'Conditions',
    entries: [
      {
        id: 'GenericCondition',
        name: 'Condition',
        returnType: 'list_of_conditions',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'condition', type: 'condition', name: 'Condition' }
        ]
      },
      {
        id: 'Diabetes',
        name: 'Diabetes',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasDiabetes' },
          { id: 'condition', static: true, value: 'diabetes' }
        ]
      },
      {
        id: 'Hypertension',
        name: 'Hypertension',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasHypertension' },
          { id: 'condition', static: true, value: 'hypertension' }
        ]
      },
      {
        id: 'ASCVD',
        name: 'ASCVD',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: "HasASCVD"},
          { id: 'condition', static: true, value: "has_ascvd"}
        ],
      },
      {
        id: 'Hypercholesterolemia',
        name: 'Hypercholesterolemia',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasFamilialHypercholesterolemia' },
          { id: 'condition', static: true, value: 'hypercholesterolemia' }
        ]
      },
      {
        id: 'Pregnancydx',
        name: 'Pregnancy dx',
        template: 'Pregnancydx',
        returnType: 'boolean',
        extends: 'Base',
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', value: 'IsPregnant' },
          { id: 'pregnancy', type: 'pregnancy', static: true, value: 'pregnancy_dx' }
        ]
      },
      {
        id: 'EndStageRenalDisease',
        name: 'End Stage Renal Disease',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasEndStageRenalDisease' },
          { id: 'condition', static: true, value: 'end_stage_renal_disease' }
        ]
      },
      {
        id: 'LiverDisease',
        name: 'Liver Disease',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasCirrhosis' },
          { id: 'condition', static: true, value: 'liver_disease' }
        ]
      },
      {
        id: 'Rhabdomyolysis',
        name: 'Rhabdomyolysis',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasRhabdomyolysis' },
          { id: 'condition', static: true, value: 'rhabdomyolysis' }
        ]
      },
      {
        id: 'HepatitisA',
        name: 'Hepatitis A',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasHepatitisA' },
          { id: 'condition', static: true, value: 'hepatitis_a' }
        ]
      },
      {
        id: 'HepatitisB',
        name: 'Hepatitis B',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasHepatitisB' },
          { id: 'condition', static: true, value: 'hepatitis_b' }
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
        id: 'GenericMedication',
        name: 'Medication',
        returnType: 'list_of_medications',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'medication', type: 'medication', name: 'Medication' }
        ]
      },
      {
        id: 'OnStatinTherapy',
        name: 'On Statin Therapy',
        extends: 'GenericMedication',
        template: 'GenericStatement', // See GenericStatement template for explanation
        parameters: [
          { id: 'element_name', value: 'OnStatinTherapy' },
          { id: 'medication', static: true, value: 'on_statin_therapy' }
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
        id: 'GenericProcedure',
        name: 'Procedure',
        returnType: 'list_of_procedures',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'procedure', type: 'procedure', name: 'Procedure' },
        ],
      },
      {
        id: 'ASCVD_Procedures',
        name: 'ASCVD Procedures',
        extends: 'GenericProcedure',
        parameters: [
          { id: 'element_name', value: 'HasHadASCVDProcedures' },
          { id: 'procedure', static: true, value: "ascvd_procedures" },
        ],
      },
      {
        id: 'Palliative_Care',
        name: 'Palliative Care',
        extends: 'GenericProcedure',
        parameters: [
          { id: 'element_name', value: 'IsInPalliativeCare' },
          { id: 'procedure', static: true, value: "palliative_care" },
        ],
      },
      {
        id: 'Dialysis',
        name: 'Dialysis',
        extends: 'GenericProcedure',
        parameters: [
          { id: 'element_name', value: 'OnDialysis' },
          { id: 'procedure', static: true, value: "dialysis" },
        ],
      }
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
        id: 'GenericEncounter',
        name: 'Encounter',
        returnType: 'encounter',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'encounter', type: 'encounter', name: 'Encounter' },
        ],
      },
      {
        id: 'OutpatientEncounters',
        name: 'Outpatient Encounter',
        returnType: 'encounter',
        extends: 'GenericEncounter',
        parameters: [
          { id: 'element_name', value: 'OutpatientEncounter' },
          { id: 'encounter', static: true, value: 'outpatient_encounter' }
        ]
      }
    ]
  },
  {
    id: 9,
    icon: 'thermometer-3',
    name: 'Allergy Intolerances',
    entries: [
      {
        id: 'GenericAllergyIntolerance',
        name: 'Allergy Inteolerance',
        returnType: 'allergy_intolerance',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'allergyIntolerance', type: 'allergyIntolerance', name: 'Allergy Intolerance' },
        ],
      },
      {
        id: 'StatinAllergen',
        name: 'Statin Allergen',
        extends: 'GenericAllergyIntolerance',
        parameters: [
          { id: 'element_name', value: 'StatinAllergen' },
          { id: 'allergyIntolerance', static: true, value: 'statin_allergen' }
        ]
      }
    ]
  }
];
