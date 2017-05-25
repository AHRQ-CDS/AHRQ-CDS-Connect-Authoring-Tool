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
      toConceptValue: false,
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
    smoker : {
      // A concept based observation - has codes and display keys instead of oid and units
      id: "smoker",
      name: "Tobacco smoking status",
      toConceptValue: true,
      codes: [
        {
          name: 'Tobacco smoking status code',
          code: '72166-2',
          codeSystem: { name: 'LOINC', id: 'http://loinc.org'},
          display: 'Tobacco smoking status',
        }
      ],
      display: 'Tobacco smoking status',
      checkInclusionInVS: { 
        name: "Current Tobacco Smoker",  
        oid: '2.16.840.1.113883.3.600.2390'
      }
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
      conditions: [
        {
          name: "Diabetes",
          oid: '2.16.840.1.113883.3.464.1003.103.12.1001'
        }
      ]
    },
    essential_hypertension : {
      // https://ushik.ahrq.gov/ViewItemDetails?&system=mu&itemKey=189078000
      id: "essential_hypertension",
      conditions: [
        {
          name: "Essential Hypertension",
          oid: '2.16.840.1.113883.3.464.1003.104.12.1011'
        }
      ]
    },
    has_ascvd : {
      id: "has_ascvd",
      conditions: [
        {
       // https://ushik.ahrq.gov/ViewItemDetails?&system=mu&itemKey=189321000
          name: "Myocardial Infarction",
          oid: '2.16.840.1.113883.3.526.3.403'
        },
        {
       // https://ushik.ahrq.gov/ViewItemDetails?&system=mu&itemKey=212224000
          name: "Atherosclerosis and peripheral arterial disease",
          oid: '2.16.840.1.113762.1.4.1047.21'
        },
        {
       // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: "Cerebrovascular disease, Stroke, TIA",
          oid: '2.16.840.1.113762.1.4.1047.44'
        },
        {
       // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: "Stable and unstable angina",
          oid: '2.16.840.1.113762.1.4.1047.47'
        },
        {
       // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: "Ischemic heart disease or coronary occlusion, rupture, or thrombosis",
          oid: '2.16.840.1.113762.1.4.1047.46'
        }
      ]
    },
    hypercholesterolemia : {
     // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
     id: "hypercholesterolemia",
     conditions: [
       {
         name: "Hypercholesterolemia",
         oid: '2.16.840.1.113762.1.4.1047.100'
       }
     ]
    },
    pregnancy_dx : {
     // https://ushik.ahrq.gov/ViewItemDetails?&system=mu&itemKey=189087000
     id: "pregnancy_dx",
     conditions: [
       {
         name: "Pregnancy dx",
         oid: '2.16.840.1.113883.3.600.1.1623'
       }
     ]
    },
    breastfeeding : {
     //TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
     id: "breastfeeding",
     conditions: [
       {
         name: "Breastfeeding",
         oid: '2.16.840.1.113762.1.4.1047.73'
       }
     ]
    },
    end_stage_renal_disease : {
    // https://ushik.ahrq.gov/ViewItemDetails?&system=mu&itemKey=189012000
    id: "end_stage_renal_disease",
    conditions: [
      {
        name: "End Stage Renal Disease",
        oid: '2.16.840.1.113883.3.526.3.353'
      }
    ]
    },
    liver_disease : {
      //TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
      id: "liver_disease",
      conditions: [
        {
          name: "Liver Disease",
          oid: '2.16.840.1.113762.1.4.1047.42'
        }
      ]
    },
  },
  medications: {
    anti_hypertensive_medication : {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211974000
      id: "anti_hypertensive_medication",
      name: "Anti-Hypertensive Medication",
      oid: '2.16.840.1.113883.3.600.1476'
    },
    on_statin_therapy : {
      id: "on_statin_therapy",
      medications: [
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: "Low intensity statin therapy",
          type: "MedicationStatement",
          oid: '2.16.840.1.113762.1.4.1047.107'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: "Low intensity statin therapy",
          type: "MedicationOrder",
          oid: '2.16.840.1.113762.1.4.1047.107'
        },
        {
       // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: "Moderate intensity statin therapy",
          type: "MedicationStatement",
          oid: '2.16.840.1.113762.1.4.1047.98'
        },
        {
       // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: "Moderate intensity statin therapy",
          type: "MedicationOrder",
          oid: '2.16.840.1.113762.1.4.1047.98'
        },
        {
       // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: "High intensity statin therapy",
          type: "MedicationStatement",
          oid: '2.16.840.1.113762.1.4.1047.97'
        },
        {
       // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: "High intensity statin therapy",
          type: "MedicationOrder",
          oid: '2.16.840.1.113762.1.4.1047.97'
        }
      ]
    },
  },
  procedures: {
    palliative_care: {
      id: 'palliative_care',
      procedures: [
        {
          name: 'Palliative Care',
          oid: '2.16.840.1.113883.3.600.1.1579',
        }
      ],
    },
    ascvd_procedures: {
      id: 'ascvd_procedures',
      procedures: [
        {
          name: 'CABG Surgeries',
          oid: '2.16.840.1.113883.3.666.5.694'
        },
        {
          name: 'Coronary artery bypass graft',
          oid: '2.16.840.1.113883.3.464.1003.104.12.1002'
        },
        {
          name: 'PCI ICD10CM SNOMEDCT',
          oid: '2.16.840.1.113762.1.4.1045.67'
        },
        {
          name: 'PCI ICD9CM',
          oid: '2.16.840.1.113762.1.4.1045.86'
        },
        {
          name: 'Carotid intervention',
          oid: '2.16.840.1.113883.3.117.1.7.1.204'
        }
      ],
    },
    dialysis: {
      id: 'dialysis',
      procedures: [
        {
          name: 'Dialysis services',
          oid: '2.16.840.1.113883.3.464.1003.109.12.1013'
        },
        {
          name: 'Vascular access for dialysis',
          oid: '2.16.840.1.113883.3.464.1003.109.12.1011'
        },
        {
          name: 'ESRD monthly outpatient services',
          oid: '2.16.840.1.113883.3.464.1003.109.12.1014'
        }
      ],
    }
  }
}
