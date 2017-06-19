/**
 * Example TemplateInstances
 */
const templateInstances = [
  {
    id: 'age_range',
    name: 'Age Range',
    category: 'Demographics',
    parameters: [
      {
        id: 'element_name',
        type: 'string',
        name: 'Element Name',
        value: 'name1'
      },
      {
        id: 'min_age',
        type: 'integer',
        name: 'Minimum Age',
        value: 30
      },
      {
        id: 'max_age',
        type: 'integer',
        name: 'Maximum Age',
        value: 45
      }
    ],
    uniqueId: 'age_range31'
  },
  {
    id: 'most_recent_observation',
    name: 'Most Recent Observation',
    category: 'Observations',
    parameters: [
      {
        id: 'element_name',
        type: 'string',
        name: 'Element Name',
        value: 'name2'
      },
      {
        id: 'observation',
        type: 'observation',
        name: 'Observation',
        value: {
          id: 'ldl_cholesterol',
          name: 'LDL Cholesterol',
          oid: '2.16.840.1.113883.3.464.1003.198.12.1016',
          units: {
            values: [
              'mg/dL'
            ],
            code: 'mg/dL'
          }
        }
      }
    ],
    uniqueId: 'most_recent_observation67'
  }
];

const elementGroups = [
  {
    id: 0,
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
    id: 1,
    icon: 'eye',
    name: 'Observations',
    entries: [
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
        id: 'Cholesterol',
        name: 'Cholesterol',
        extends: 'GenericObservation',
        returnType: 'number',
        parameters: [
          { id: 'element_name', value: 'Cholesterol' },
          { id: 'observation', static: true, value: 'cholesterol' },
          { id: 'valid', value: 6 }
        ]
      }
    ]
  }
];

export {
  templateInstances,
  elementGroups
};
