
module.exports = [
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
