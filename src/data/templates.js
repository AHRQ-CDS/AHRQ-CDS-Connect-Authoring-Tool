
module.exports = [
  {
    id: 1,
    icon: 'user',
    name: 'Demographics',
    entries: [
      {
        id: 'AgeRange',
        name: 'Age Range',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'min_age', type: 'integer', name: 'Minimum Age' },
          { id: 'max_age', type: 'integer', name: 'Maximum Age' },
        ],
      },
      {
        id: 'Gender',
        name: 'Gender',
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
        category: 'Observations',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'observation', type: 'observation', name: 'Observation' }
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
  //   entries: ['Myocardial Infarction', 'Cerebrovascular disease, Stroke, TIA', 'Atherosclerosis and Peripheral Arterial Disease', 'Ischemic heart disease or coronary occlusion, rupture, or thrombosis', 'Stable and Unstable Angina', 'Hypertension', 'Diabetes', 'Familial Hypercholesterolemia'],
  // },
  // {
  //   id: 3,
  //   icon: 'flask',
  //   name: 'Lab Results',
  //   entries: ['Total Cholesterol', 'HDL Cholesterol', 'Systolic Blood Pressure', 'LDL Cholesterol'],
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
