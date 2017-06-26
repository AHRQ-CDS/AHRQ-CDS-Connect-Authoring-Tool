
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
          { id: 'element_name', value: 'TotalCholesterol' },
          { id: 'observation', static: true, value: 'total_cholesterol' },
          { id: 'valid', static: true }
        ]
      },
      {
        id: 'HDLCholesterol',
        name: 'HDL Cholesterol',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: 'HDLCholesterol' },
          { id: 'observation', static: true, value: 'hdl_cholesterol' },
          { id: 'valid', value: 6 }
        ]
      },
      {
        id: 'LDLCholesterol',
        name: 'LDL Cholesterol',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: 'LDLCholesterol' },
          { id: 'observation', static: true, value: 'ldl_cholesterol' },
          { id: 'valid', value: 6 }
        ]
      },
      {
        id: 'SystolicBloodPressure',
        name: 'Systolic Blood Pressure',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: 'SystolicBloodPressure' },
          { id: 'observation', static: true, value: 'systolic_blood_pressure' },
          { id: 'valid', static: true }
        ]
      },
      {
        id: 'ascvd_risk_assessment',
        name: 'ASCVD Risk Assessment',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: 'MostRecentASCVDRiskAssessmentResult' },
          { id: 'observation', static: true, value: 'ascvd_risk_assessment' },
          { id: 'valid', value: 6 }
        ]
      },
      {
        id: 'smoker',
        name: 'Is Smoker',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: 'IsSmoker' },
          { id: 'observation', static: true, value: 'smoker' },
          { id: 'valid', value: 6 }
        ]
      },
      {
        id: 'MostRecentObservation',
        name: 'Most Recent Observation',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'observation', type: 'observation', name: 'Observation' },
          { id: 'valid' }
        ],
      },
      {
        id: 'LabValueRange',
        name: 'Lab Value Range',
        returnType: 'boolean',
        category: 'RangeOfObservation',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'lower_bound', type: 'number', typeOfNumber: 'integer', name: 'Lower Bound', exclusive: false },
          { id: 'upper_bound', type: 'number', typeOfNumber: 'integer', name: 'Upper Bound', exclusive: false },
          { id: 'observation', type: 'list', subType: 'number', value: [undefined], name: 'Observation' }
        ]
      }
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
        parameters: [
          { id: 'element_value', type: 'string', name: 'Value' }
        ],
      },
      {
        id: 'Comparison',
        name: 'Comparison',
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'observation', type: 'list', category: 'comparison', subType: 'number', value: [undefined], name: 'Observation' },
          { id: 'comparison', type: 'comparison', value: null, name: 'Operator' },
          { id: 'comparison_bound', type: 'number', typeOfNumber: 'float', name: 'Comparison Bound'},
          { id: 'checkbox', type: 'checkbox', name: 'Double Sided?', checked: false}
        ]
      },
      {
        id: 'If',
        name: 'If',
        returnType: 'if',
        extends: 'Base',
        parameters: [
          { id: 'components', type: 'if', name: 'Elements', value: [{},{else: true, block: ''}]}
        ],
      },
      {
        id: 'Not',
        name: 'Not',
        returnType: 'boolean',
        extends: 'Base',
        parameters: [
          { id: 'components', type: 'list',subType: 'boolean',value: [undefined], name: 'Elements' }
        ],
      },
      {
        id: 'Case',
        name: 'Case',
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
        returnType: 'conditions',
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
        extends: 'Base',
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', value: 'IsPregnant' },
          { id: 'pregnancy', type: 'pregnancy', static: true, value: 'pregnancy_dx' }
        ]
      },
      {
        id: 'Breastfeeding',
        name: 'Breastfeeding',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'IsBreastfeeding' },
          { id: 'condition', static: true, value: 'breastfeeding' }
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
        returnType: 'medications',
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
        returnType: 'procedures',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'procedure', type: 'procedure', name: 'Procedure' },
          { id: 'in_last_weeks', type: 'number', typeOfNumber: 'integer', name: 'How Recent (weeks)' }
        ],
      },
      {
        id: 'ASCVD_Procedures',
        name: 'ASCVD Procedures',
        extends: 'GenericProcedure',
        parameters: [
          { id: 'element_name', value: 'HasHadASCVDProcedures' },
          { id: 'procedure', static: true, value: 'ascvd_procedures' },
          { id: 'in_last_weeks', static: true } // This procedure doesn't use a LookBack so this parameter is static with no value
        ],
      },
      {
        id: 'Palliative_Care',
        name: 'Palliative Care',
        extends: 'GenericProcedure',
        parameters: [
          { id: 'element_name', value: 'IsInPalliativeCare' },
          { id: 'procedure', static: true, value: 'palliative_care' },
          { id: 'in_last_weeks', static: true }, // This procedure doesn't use a LookBack so this parameter is static with no value

        ],
      },
      {
        id: 'Dialysis',
        name: 'Dialysis',
        extends: 'GenericProcedure',
        parameters: [
          { id: 'element_name', value: 'OnDialysis' },
          { id: 'procedure', static: true, value: 'dialysis' },
          { id: 'in_last_weeks', value: 1 }
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
];
