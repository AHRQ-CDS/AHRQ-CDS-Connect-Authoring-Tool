module.exports = {
  observations: {
    total_cholesterol : {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211967000
      id: "total_cholesterol",
      name: "Total Cholesterol",
      oid: '2.16.840.1.113883.3.464.1003.104.12.1013',
      units: {values: ['mg/dL'], code: 'mg/dL'}
    },
    hdl_cholesterol : {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211963000
      id: "hdl_cholesterol",
      name: "HDL Cholesterol",
      oid: '2.16.840.1.113883.3.464.1003.104.12.1012',
      units: {values: ['mg/dL'], code: 'mg/dL'}
    },
    systolic_blood_pressure : {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211939000
      id: "systolic_blood_pressure",
      name: "Systolic Blood Pressure",
      oid: '2.16.840.1.113883.3.526.3.1032',
      units: {values: ['mm[Hg]', 'mmHg', 'mm Hg'], code: 'mm[Hg]'}
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