
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
          { id: 'min_age', type: 'integer', name: 'Minimum Age' },
          { id: 'max_age', type: 'integer', name: 'Maximum Age' },
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
      }
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
          { id: 'valid', type: 'integer', name: 'Look back (years)' }
        ],
      },
      {
        id: 'TotalCholesterol',
        name: 'Total Cholesterol',
        extends: 'GenericObservation',
        returnType: 'number', //TODO: these are all numbers because of the GenericObservation template - when it gets made more general, this might change back to observation
        parameters: [
          { id: 'element_name', value: "TotalCholesterol"},
          { id: 'observation', static: true, value: "total_cholesterol"},
          { id: 'valid', static: true }
        ]
      },
      {
        id: 'HDLCholesterol',
        name: 'HDL Cholesterol',
        extends: 'GenericObservation',
        returnType: 'number',
        parameters: [
          { id: 'element_name', value: "HDLCholesterol"},
          { id: 'observation', static: true, value: "hdl_cholesterol"},
          { id: 'valid', value: 6 }
        ]
      },
      {
        id: 'LDLCholesterol',
        name: 'LDL Cholesterol',
        extends: 'GenericObservation',
        returnType: 'number',
        parameters: [
          { id: 'element_name', value: "LDLCholesterol"},
          { id: 'observation', static: true, value: "ldl_cholesterol"},
          { id: 'valid', value: 6 }
        ]
      },
      {
        id: 'SystolicBloodPressure',
        name: 'Systolic Blood Pressure',
        extends: 'GenericObservation',
        returnType: 'number',
        parameters: [
          { id: 'element_name', value: "SystolicBloodPressure"},
          { id: 'observation', static: true, value: "systolic_blood_pressure"},
          { id: 'valid', static: true }
        ]
      },
      {
        id: 'ascvd_risk_assessment',
        name: 'ASCVD Risk Assessment',
        extends: 'GenericObservation',
        returnType: 'number',
        parameters: [
          { id: 'element_name', value: "MostRecentASCVDRiskAssessmentResult"},
          { id: 'observation', static: true, value: "ascvd_risk_assessment"},
          { id: 'valid', value: 6 }
        ]
      },
      {
        id: 'smoker',
        name: 'Is Smoker',
        extends: 'GenericObservation',
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', value: "IsSmoker"},
          { id: 'observation', static: true, value: "smoker"},
          { id: 'valid', static: true }
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
        category: 'RangeOfObservation',
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'lower_bound', type: 'integer', name: 'Lower Bound', exclusive: false },
          { id: 'upper_bound', type: 'integer', name: 'Upper Bound', exclusive: false },
          { id: 'observation', type: 'list', subType: 'number', value: [undefined], name: 'Observation' }
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
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'components', type: 'list', subType: 'boolean', value: [undefined, undefined], name: 'Elements' }
        ],
      },
      {
        id: 'Or',
        name: 'Or',
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
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
        id: 'If',
        name: 'If',
        returnType: 'recommendation', // JULIA - this is probably wrong
        // extends: 'Base',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'components', type: 'conditional', name: 'Elements', value: [{},{else: true, block: ''}]}//[{condition: 'isMale', block: 'This patient is male.'}, {condition: 'isFemale', block: 'This patient is female.'}, {condition: 'isOther', block: 'This patient is other.'}, {else: true, block: 'null'}] }
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
          { id: 'element_name', value: "HasDiabetes"},
          { id: 'condition', static: true, value: "diabetes"}
        ]
      },
      {
        id: 'Hypertension',
        name: 'Hypertension',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: "HasHypertension"},
          { id: 'condition', static: true, value: "hypertension"}
        ]
      },
      {
        id: 'ASCVD',
        name: 'ASCVD',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: "HasASCVD"},
          { id: 'condition', static: true, value: "has_ascvd", inactive: true} // C3F.ActiveCondition() is applied unless inactive is set
        ],
      },
      {
        id: 'Hypercholesterolemia',
        name: 'Hypercholesterolemia',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: "HasFamilialHypercholesterolemia"},
          { id: 'condition', static: true, value: "hypercholesterolemia"}
        ]
      },
      {
        id: 'Pregnancydx',
        name: 'Pregnancy dx',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: "IsPregnant"},
          { id: 'condition', static: true, value: "pregnancy_dx"}
        ]
      },
      {
        id: 'Breastfeeding',
        name: 'Breastfeeding',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: "IsBreastfeeding"},
          { id: 'condition', static: true, value: "breastfeeding"}
        ]
      },
      {
        id: 'EndStageRenalDisease',
        name: 'End Stage Renal Disease',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: "HasEndStageRenalDisease"},
          { id: 'condition', static: true, value: "end_stage_renal_disease"}
        ]
      },
      {
        id: 'LiverDisease',
        name: 'Liver Disease',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: "HasCirrhosis"},
          { id: 'condition', static: true, value: "liver_disease"}
        ]
      }
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
          {id:'medication',type:'medication',name:'Medication'}
        ]
      },
      {
        id: 'OnStatinTherapy',
        name: 'On Statin Therapy',
        extends: 'GenericMedication',
        parameters: [
          { id: 'element_name', value: 'OnStatinTherapy'},
          { id: 'medication', static: true, value: "on_statin_therapy"}
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
          { id: 'in_last_weeks', type: 'integer', name: 'How Recent (weeks)' }
        ],
      },
      {
        id: 'ASCVD_Procedures',
        name: 'ASCVD Procedures',
        returnType: 'boolean',
        extends: 'GenericProcedure',
        parameters: [
          { id: 'element_name', value: 'HasHadASCVDProcedures' },
          { id: 'procedure', static: true, value: "ascvd_procedures" },
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
          { id: 'procedure', static: true, value: "palliative_care" },
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
          { id: 'procedure', static: true, value: "dialysis" },
          { id: 'in_last_weeks', value: 1 }
        ],
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
