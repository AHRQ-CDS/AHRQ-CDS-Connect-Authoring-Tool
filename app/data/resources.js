module.exports = {
  observations: [
    {
      id: "total_cholesterol",
      name: "Total Cholesterol",
    },
    {
      id: "hdl_cholesterol",
      name: "HDL Cholesterol",
    },
    {
      id: "systolic_blood_pressure",
      name: "Systolic Blood Pressure",
    }
  ],
  conditions: [
    {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211617000
      id: "diabetes",
      name: "Diabetes",
      oid: '2.16.840.1.113883.3.464.1003.103.12.1001'
    }
  ],
  medications: [
    {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211974000
      id: "anti_hypertensive_medication",
      name: "Anti-Hypertensive Medication",
      oid: '2.16.840.1.113883.3.600.1476'
    }
  ]

}