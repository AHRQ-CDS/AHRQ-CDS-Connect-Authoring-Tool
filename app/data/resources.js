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
      id: "ldl_cholesterol",
      name: "LDL Cholesterol",
    },
    {
      id: "systolic_blood_pressure",
      name: "Systolic Blood Pressure",
    }
  ],
  valuesets: [
    {
      id: "gender",
      name: "Gender",
      valuesets: [
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
    },
  ], 
  conditions: [
    {
      id: "diabetes",
      name: "Diabetes",
    }
  ],
  medications: [
    {
      id: "anti_hypertensive_medication",
      name: "Anti-Hypertensive Medication",
    }
  ]
}