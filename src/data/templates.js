
module.exports = [
  {
    id: 1,
    icon: 'user',
    name: 'Demographics',
    entries: [
      {
        id: 'age_range',
        name: 'Age Range',
        category: 'Demographics',
        parameters: [
        { id: 'min_age', type: 'integer', name: 'Minimum Age' },
        { id: 'max_age', type: 'integer', name: 'Maximum Age' },
        ],
        cql: 'define AgeRange: AgeInYears()>=${this.min_age} and AgeInYears()<=${this.max_age}'
      }
    ]
  },
  {
    id: 2,
    icon: 'eye',
    name: 'Observations',
    entries: [
      {
        id: 'most_recent_observation',
        name: 'Most Recent Observation',
        category: 'Observations',
        parameters: [
        { id: 'observation', type: 'observation', name: 'Observation' }
        ],
        cql: `define LastSystolicBP:
              Last (
                [Observation: \$\{this.observation.name\}] O
                  where O.status.value = 'final'
                  and (
                    O.valueQuantity.unit.value in {\$\{this.observation.units.values\}}
                    or O.valueQuantity.code.value = \$\{this.observation.units.code\}
                  )
                  sort by O.issued
              )`
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
