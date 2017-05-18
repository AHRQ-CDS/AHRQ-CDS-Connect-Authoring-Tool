module.exports = {
  observations: {
    total_cholesterol : {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211967000
      id: "total_cholesterol",
      name: "Total Cholesterol",
      oid: '2.16.840.1.113883.3.464.1003.104.12.1013',
      units: {values: ["'mg/dL'"], code: "'mg/dL'"}
    },
    hdl_cholesterol : {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211963000
      id: "hdl_cholesterol",
      name: "HDL Cholesterol",
      oid: '2.16.840.1.113883.3.464.1003.104.12.1012',
      units: {values: ["'mg/dL'"], code: "'mg/dL'"}
    },
    systolic_blood_pressure : {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211939000
      id: "systolic_blood_pressure",
      name: "Systolic Blood Pressure",
      oid: '2.16.840.1.113883.3.526.3.1032',
      units: {values: ["'mm[Hg]'", "'mmHg'", "'mm Hg'"], code: "'mm[Hg]'"}
    },
    ldl_cholesterol : {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=171113000
      id: "ldl_cholesterol",
      name: "LDL Cholesterol",
      oid: '2.16.840.1.113883.3.464.1003.198.12.1016',
      units: {values: ["'mg/dL'"], code: "'mg/dL'"}
    }
  },
  demographics: {
    gender: {
      id: "gender",
      name: "Gender",
      oid: '2.16.840.1.113883.4.642.3.1',
      expansion: [
        {
          id: "male",
          name: "Male",
          value: "'male'",
        },
        {
          id: "female",
          name: "Female",
          value: "'female'",
        },
        {
          id: "other",
          name: "Other",
          value: "'other'",
        },
        {
          id: "unknown",
          name: "Unknown",
          value: "'unknown'",
        },
      ]
    }
  },
  conditions: {
    diabetes : {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211617000
      id: "diabetes",
      name: "Diabetes",
      oid: '2.16.840.1.113883.3.464.1003.103.12.1001'
    }
  },
  medications: {
    anti_hypertensive_medication : {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211974000
      id: "anti_hypertensive_medication",
      name: "Anti-Hypertensive Medication",
      oid: '2.16.840.1.113883.3.600.1476'
    }
  },
  procedures: {
    palliative_care: {
      id: 'palliative_care',
      procedures: [ // TODO better way to structure this to have multiple procedures in one group?
        {
          name: 'Palliative Care',
          oid: '2.16.840.1.113883.3.600.1.1579',
        }
      ],
      units: {status: ["'in-progress'", "'completed'"]}
    },
    ascvd_procedures: {
      id: 'ascvd_procedures',
      procedures: [
        {
          name: 'CABG Surgeries',
          oid: '2.16.840.1.113883.3.666.5.694'
        },
        {
          name: 'PCI',
          oid: '2.16.840.1.113762.1.4.1045.67'
        },
        {
          name: 'Carotid intervention',
          oid: '2.16.840.1.113883.3.117.1.7.1.204'
        }
      ],
      units: {status: ["'completed'"]}
    },
    dialysis: {
      id: 'dialysis',
      procedures: [
        {
          name: 'Dialysis Services',
          oid: '2.16.840.1.113883.3.464.1003.109.12.1013'
        }
      ],
      units: {status: ["'in-progress'", "'completed'"]}
    }
  }

}