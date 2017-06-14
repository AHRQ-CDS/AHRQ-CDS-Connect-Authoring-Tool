
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
        returnType: 'observation',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'observation', type: 'observation', name: 'Observation' },
          { id: 'valid', type: 'number', typeOfNumber: 'integer', name: 'Look back (years)' }
        ],
      },
      {
        id: 'TotalCholesterol',
        name: 'Total Cholesterol',
        extends: 'GenericObservation',
        returnType: 'number', // TODO: these are all numbers because of the GenericObservation template - when it gets made more general, this might change back to observation
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
        returnType: 'number',
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
        returnType: 'number',
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
        returnType: 'number',
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
        returnType: 'number',
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
        returnType: 'boolean',
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
        returnType: 'observation',
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
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'lower_bound', type: 'number', typeOfNumber: 'integer', name: 'Lower Bound', exclusive: false },
          { id: 'upper_bound', type: 'number', typeOfNumber: 'integer', name: 'Upper Bound', exclusive: false },
          { id: 'observation', type: 'list', subType: 'number', value: [undefined], name: 'Observation' }
        ]
      },
      {
        id: 'templateModifier',
        name: 'Template Modifier',
        modifiers: null, /* Any default modifiers can be applied here */
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name', value : 'Modified Templates' },
        ],
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
        returnType: 'boolean',
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
          { id: 'element_name', value: 'HasASCVD' },
          { id: 'condition', static: true, value: 'has_ascvd', inactive: true } // C3F.ActiveCondition() is applied unless inactive is set
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
        returnType: 'boolean',
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
        returnType: 'procedure',
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
        returnType: 'boolean',
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
        returnType: 'boolean',
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
        returnType: 'boolean',
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
        returnType: 'allergyIntolerance',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'allergyIntolerance', type: 'allergyIntolerance', name: 'Allergy Intolerance' },
        ],
      },
      {
        id: 'StatinAllergen',
        name: 'Statin Allergen',
        returnType: 'boolean',
        extends: 'GenericAllergyIntolerance',
        parameters: [
          { id: 'element_name', value: 'HasStatinAllergen' },
          { id: 'allergyIntolerance', static: true, value: 'statin_allergen' }
        ]
      }
    ]
  }
  //   'Gender',
  //   'Ethnicity',
  //   'Race'],
  // },
  // {
  //   id: 2,
  //   icon: 'stethoscope',
  //   name: 'Diagnoses',
  //   entries: [
  //    'Myocardial Infarction', 'Cerebrovascular disease, Stroke, TIA',
  //    'Atherosclerosis and Peripheral Arterial Disease',
  //    'Ischemic heart disease or coronary occlusion, rupture, or thrombosis',
  //    'Stable and Unstable Angina', 'Hypertension', 'Diabetes',
  //    'Familial Hypercholesterolemia'
  //   ],
  // },
  // {
  //   id: 3,
  //   icon: 'flask',
  //   name: 'Lab Results',
  //   entries: [
  //     'Total Cholesterol', 'HDL Cholesterol', 'Systolic Blood Pressure', 'LDL Cholesterol'
  //   ],
  // },
  // {
  //   id: 4,
  //   icon: 'medkit',
  //   name: 'Medications',
  //   entries: ['Antihypertensive', 'Statin', 'Aspirin Therapy', 'Smoking Cessation'],
  // },
  // {
  //   id: 5,
  //   icon: 'eye',
  //   name: 'Observations',
  //   entries: ['Smoker Status', 'Months abstinent from smoking'],
  // },
  // {
  //   id: 6,
  //   icon: 'scissors',
  //   name: 'Procedures',
  //   entries: ['CABG Surgeries', 'Carotid Intervention'],
  // },
];
