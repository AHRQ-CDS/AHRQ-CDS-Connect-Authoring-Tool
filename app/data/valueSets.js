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
      units: {values: ["'mg/dL'"], code: "'mg/dL'"},
    },
    ascvd_risk_assessment : {
      // A concept based observation - has codes and display keys instead of oid and units
      id: "ascvd_risk_assessment",
      name: "ASCVD 10-year risk code",
      toConceptValue: false, // take flags out eventually?
      codes: [
        {
          name: 'ASCVD 10-year risk code',
          code: '79423-0',
          codeSystem: { name: 'LOINC', id: 'http://loinc.org'},
          display: 'Cardiovascular disease 10Y risk [Likelihood] ACC-AHA Pooled Cohort by Goff 2013',
        }
      ],
      display: 'Cardiovascular disease 10Y risk [Likelihood] ACC-AHA Pooled Cohort by Goff 2013'
    },
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
  }

}