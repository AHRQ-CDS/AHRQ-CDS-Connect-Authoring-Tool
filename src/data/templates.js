
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
          { id: 'observation', type: 'observation', name: 'Observation' }
        ],
      },
      {
        id: 'TotalCholesterol',
        name: 'Total Cholesterol',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: "TotalCholesterol"},
          { id: 'observation', static: true, value: "total_cholesterol"}
        ]
      },
      {
        id: 'HDLCholesterol',
        name: 'HDL Cholesterol',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: "HDLCholesterol"},
          { id: 'observation', static: true, value: "hdl_cholesterol"}
        ]
      },
      {
        id: 'LDLCholesterol',
        name: 'LDL Cholesterol',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: "LDLCholesterol"},
          { id: 'observation', static: true, value: "ldl_cholesterol"}
        ]
      },
      {
        id: 'SystolicBloodPressure',
        name: 'Systolic Blood Pressure',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: "SystolicBloodPressure"},
          { id: 'observation', static: true, value: "systolic_blood_pressure"}
        ]
      },
      {
        id: 'MostRecentObservation',
        name: 'Most Recent Observation',
        returnType: 'observation',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'observation', type: 'observation', name: 'Observation' },
          { id: 'valid', type: 'integer', name: 'Look back (years)'}
        ],
      },
      {
        id: 'LabValueRange',
        name: 'Lab Value Range',
        category: 'RangeOfObservation',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'lower_bound', type: 'integer', name: 'Lower Bound', exclusive: false },
          { id: 'upper_bound', type: 'integer', name: 'Upper Bound', exclusive: false },
          { id: 'observation', type: 'list', subType: 'observation', value: [undefined], name: 'Observation' }
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
      }
    ]
  },
  {
    id: 4,
    icon: 'stethoscope',
    name: 'Conditions',
    entries: [
      {
        id: 'Condition',
        name: 'Diabetes',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'condition', type: 'condition', value:{id: 'diabetes'}, name: 'Diabetes' }
        ]
      },
      {
        id: 'Condition',
        name: 'Essential Hypertension',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'condition', type: 'condition', value:{id: 'essential_hypertension'}, name: 'Essential Hypertension' }
        ]
      },
      {
        id: 'Condition',
        name: 'ASCVD',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'condition', type: 'condition', value:{id: 'has_ascvd'}, name: 'hasASCVD', inactive: true} // C3F.ActiveCondition() is applied unless inactive is set
        ],
      },
      {
        id: 'Condition',
        name: 'Hypercholesterolemia',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'condition', type: 'condition', value:{id: 'hypercholesterolemia'}, name: 'Hypercholesterolemia' }
        ]
      },
      {
        id: 'Condition',
        name: 'Pregnancy dx',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'condition', type: 'condition', value:{id: 'pregnancy_dx'}, name: 'Pregnancy dx' }
        ]
      },
      {
        id: 'Condition',
        name: 'Breastfeeding',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'condition', type: 'condition', value:{id: 'breastfeeding'}, name: 'Breastfeeding' }
        ]
      },
      {
        id: 'Condition',
        name: 'End Stage Renal Disease',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'condition', type: 'condition', value:{id: 'end_stage_renal_disease'}, name: 'End Stage Renal Disease' }
        ]
      },
      {
        id: 'Condition',
        name: 'Liver Disease',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'condition', type: 'condition', value:{id: 'liver_disease'}, name: 'Liver Disease' }
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
        id: 'Medication',
        name: 'On Statin Therapy',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'medication', type: 'medication', value:{id: 'on_statin_therapy'}, name: 'On Statin Therapy' }
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
        id: 'Procedure', // TODO this matches the template that will be used - might change to more useful id when extending templates
        name: 'ASCVD Procedures',
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'procedure', type: 'procedure', name: 'Procedure', value: {id: 'ascvd_procedures'}}, // TODO eventually extension
          { id: 'in_last_weeks', type: 'integer', name: 'How Recent (weeks)'} // TODO - make this "Look Back" idea more general? -> a filter you can apply to anything?
        ],
      },
      {
        id: 'Procedure',
        name: 'Palliative Care',
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'procedure', type: 'procedure', name: 'Procedure', value: {id: 'palliative_care'} }, //TODO with template extensions - this would be preset?
          { id: 'in_last_weeks', type: 'integer', name: 'How Recent (weeks)'}
        ],
      },
      {
        id: 'Procedure',
        name: 'Dialysis',
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'procedure', type: 'procedure', name: 'Procedure', value: { id: 'dialysis' } }, //TODO will use extension
          { id: 'in_last_weeks', type: 'integer', name: 'How Recent (weeks)'}
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
