
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
          { id: 'observation', type: 'observation', name: 'Observation' }
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
    ]
  },
  {
    id: 4,
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
