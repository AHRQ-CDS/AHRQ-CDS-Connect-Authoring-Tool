module.exports = {
  observations: {
    total_cholesterol: {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211967000
      id: 'total_cholesterol',
      observations: [
        {
          name: 'Total Cholesterol',
          oid: '2.16.840.1.113883.3.464.1003.104.12.1013',
        }
      ],
      units: { values: ["'mg/dL'"], code: "'mg/dL'" }
    },
    hdl_cholesterol: {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211963000
      id: 'hdl_cholesterol',
      observations: [
        {
          name: 'HDL-C Laboratory Test',
          oid: '2.16.840.1.113883.3.464.1003.104.12.1012',
        },
        {
          name: 'High Density Lipoprotein (HDL)',
          oid: '2.16.840.1.113883.3.600.875',
        }
      ],
      units: { values: ["'mg/dL'"], code: "'mg/dL'" }
    },
    systolic_blood_pressure: {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211939000
      id: 'systolic_blood_pressure',
      observations: [
        {
          name: 'Systolic Blood Pressure',
          oid: '2.16.840.1.113883.3.526.3.1032',
        }
      ],
      units: { values: ["'mm[Hg]'", "'mmHg'", "'mm Hg'"], code: "'mm[Hg]'" }
    },
    ldl_test: {
      // [See value set in VSAC](https://vsac.nlm.nih.gov/valueset/2.16.840.1.113883.3.464.1003.198.11.1029/expansion)
      id: 'ldl_test',
      observations: [
        {
          name: 'LDL Test',
          oid: '2.16.840.1.113883.3.464.1003.198.11.1029',
        }
      ],
      units: { values: ["'mg/dL'"], code: "'mg/dL'" },
    },
    ascvd_risk_assessment: {
      // A concept based observation - has codes and display keys instead of oid and units
      id: 'ascvd_risk_assessment',
      name: 'ASCVD 10-year risk', // Name matches the name of the concept being created
      toConceptValue: false,
      units: { values: ["'%'"], code: "'%'" },
      concepts: [
        {
          name: 'ASCVD 10-year risk',
          codes: [
            {
              name: 'ASCVD 10-year risk code',
              code: '79423-0',
              codeSystem: { name: 'LOINC', id: 'http://loinc.org' },
              display: 'Cardiovascular disease 10Y risk [Likelihood] ACC-AHA Pooled Cohort by Goff 2013',
            }
          ],
          display: 'Cardiovascular disease 10Y risk [Likelihood] ACC-AHA Pooled Cohort by Goff 2013',
        }
      ],
    },
    smoker: {
      // A concept based observation - has codes and display keys instead of oid and units
      id: 'smoker',
      toConceptValue: true,
      name: 'Tobacco smoking status', // Name matches the name of the concept being creaged
      concepts: [
        {
          name: 'Tobacco smoking status',
          codes: [
            {
              name: 'Tobacco smoking status code',
              code: '72166-2',
              codeSystem: { name: 'LOINC', id: 'http://loinc.org' },
              display: 'Tobacco smoking status',
            }
          ],
          display: 'Tobacco smoking status',
        }
      ],
      checkInclusionInVS: {
        name: 'Current Tobacco Smoker',
        oid: '2.16.840.1.113883.3.600.2390'
      }
    },
    alt: {
      id: 'alt',
      observations: [
        {
          name: 'ALT',
          oid: '2.16.840.1.113762.1.4.1032.21',
        }
      ],
      units: { values: ["'U/L'"], code: "'U/L'" },
    },
  },
  demographics: {
    gender: {
      id: 'gender',
      name: 'Gender',
      oid: '2.16.840.1.113883.4.642.3.1',
      expansion: [
        {
          id: 'male',
          name: 'Male',
          value: "'male'",
        },
        {
          id: 'female',
          name: 'Female',
          value: "'female'",
        },
        {
          id: 'other',
          name: 'Other',
          value: "'other'",
        },
        {
          id: 'unknown',
          name: 'Unknown',
          value: "'unknown'",
        },
      ]
    },
    units_of_time: {
      id: 'units_of_time',
      name: 'Units of Time',
      oid: '2.16.840.1.113883.4.642.3.70',
      expansion: [
        {
          id: 's',
          name: 'seconds',
          value: "AgeInSeconds()",
        },
        {
          id: 'min',
          name: 'minutes',
          value: "AgeInMinutes()",
        },
        {
          id: 'h',
          name: 'hours',
          value: "AgeInHours()",
        },
        {
          id: 'd',
          name: 'days',
          value: "AgeInDays()",
        },
        {
          id: 'wk',
          name: 'weeks',
          value: "AgeInWeeks()",
        },
        {
          id: 'mo',
          name: 'months',
          value: "AgeInMonths()",
        },
        {
          id: 'a',
          name: 'years',
          value: "AgeInYears()",
        },
      ]
    }
  },
  conditions: {
    diabetes: {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211617000
      id: 'diabetes',
      conditions: [
        {
          name: 'Diabetes',
          oid: '2.16.840.1.113883.3.464.1003.103.12.1001'
        }
      ]
    },
    hypertension: {
      // https://ushik.ahrq.gov/ViewItemDetails?&system=mu&itemKey=189078000
      id: 'hypertension',
      conditions: [
        {
          name: 'Hypertension',
          oid: '2.16.840.1.113762.1.4.1032.9'
        }
      ]
    },
    has_ascvd: {
      id: 'has_ascvd',
      conditions: [
        {
          // https://ushik.ahrq.gov/ViewItemDetails?&system=mu&itemKey=189321000
          name: 'Myocardial Infarction',
          oid: '2.16.840.1.113883.3.526.3.403'
        },
        {
          // [See Acute myocardial infarction value set in VSAC](https://vsac.nlm.nih.gov/valueset/2.16.840.1.113883.3.464.1003.104.12.1001/expansion)
          name: 'Acute myocardial infarction',
          oid: '2.16.840.1.113883.3.464.1003.104.12.1001'
        },
        {
          // [See value set in VSAC](https://vsac.nlm.nih.gov/valueset/2.16.840.1.113883.3.464.1003.104.12.1003/expansion)
          name: 'Ischemic vascular disease',
          oid: '2.16.840.1.113883.3.464.1003.104.12.1003'
        }
      ]
    },
    ascvd_CMS347v1: {
      id: 'ascvd_CMS347v1',
      conditions: [
        {
          name: 'Myocardial Infarction',
          oid: '2.16.840.1.113883.3.526.3.403'
        },
        {
          name: 'Atherosclerosis and Peripheral Arterial Disease',
          oid: '2.16.840.1.113762.1.4.1047.21'
        },
        {
          name: 'Cerebrovascular disease, Stroke, TIA',
          oid: '2.16.840.1.113762.1.4.1047.44'
        },
        {
          name: 'Stable and Unstable Angina',
          oid: '2.16.840.1.113762.1.4.1047.47'
        },
        {
          name: 'Ischemic heart disease or coronary occlusion, rupture, or thrombosis',
          oid: '2.16.840.1.113762.1.4.1047.46'
        }
      ]
    },
    pregnancy_dx: {
      // https://ushik.ahrq.gov/ViewItemDetails?&system=mu&itemKey=189087000
      id: 'pregnancy_dx',
      conditions: [
        {
          name: 'Pregnancy dx',
          oid: '2.16.840.1.113883.3.526.3.378'
        }
      ],
      concepts: [
        {
          name: 'Pregnancy status',
          codes: [
            {
              name: 'Pregnancy status code',
              code: '82810-3',
              codeSystem: { name: 'LOINC', id: 'http://loinc.org' },
              display: 'Pregnancy status',
            }
          ],
          display: 'Pregnancy status'
        },
        {
          name: 'Pregnant',
          codes: [
            {
              name: 'Pregnant code',
              code: '77386006',
              codeSystem: { name: 'SNOMED-CT', id: 'http://snomed.info/sct/1000124' },
              display: 'Patient currently pregnant (finding)',
            }
          ],
          display: 'Patient currently pregnant (finding)'
        }
      ],
    },
    pregnancy_dx_CMS347v1: {
      id: 'pregnancy_dx_CMS347v1',
      conditions: [
        {
          name: 'Pregnancy dx',
          oid: '2.16.840.1.113883.3.600.1.1623'
        }
      ],
      concepts: [
        {
          name: 'Pregnancy status',
          codes: [
            {
              name: 'Pregnancy status code',
              code: '82810-3',
              codeSystem: { name: 'LOINC', id: 'http://loinc.org' },
              display: 'Pregnancy status',
            }
          ],
          display: 'Pregnancy status'
        },
        {
          name: 'Pregnant',
          codes: [
            {
              name: 'Pregnant code',
              code: '77386006',
              codeSystem: { name: 'SNOMED-CT', id: 'http://snomed.info/sct' },
              display: 'Patient currently pregnant (finding)',
            }
          ],
          display: 'Patient currently pregnant (finding)'
        }
      ],
    },
    breastfeeding: {
      // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
      id: 'breastfeeding',
      conditions: [
        {
          name: 'Breastfeeding',
          oid: '2.16.840.1.113762.1.4.1047.73'
        }
      ],
      concepts: [
        {
          name: 'Is Breastfeeding',
          codes: [
            {
              name: 'Is Breastfeeding code',
              code: '63895-7',
              codeSystem: { name: 'LOINC', id: 'http://loinc.org' },
              display: 'Breastfeeding [PhenX]'
            }
          ],
          display: 'Breastfeeding [PhenX]'
        },
        {
          name: 'Yes',
          codes: [
            {
              name: 'Yes code',
              code: 'LA33-6',
              codeSystem: { name: 'LOINC', id: 'http://loinc.org' },
              display: 'Yes'
            }
          ],
          display: 'Yes'
        }
      ]
    },
    end_stage_renal_disease: {
    // https://ushik.ahrq.gov/ViewItemDetails?&system=mu&itemKey=189012000
      id: 'end_stage_renal_disease',
      conditions: [
        {
          name: 'End Stage Renal Disease',
          oid: '2.16.840.1.113883.3.526.3.353'
        }
      ]
    },
    rhabdomyolysis: {
      id: 'rhabdomyolysis',
      conditions: [
        {
          name: 'Rhabdomyolysis',
          oid: '2.16.840.1.113762.1.4.1047.102'
        }
      ]
    },
    hepatitis_a: {
      id: 'hepatitis_a',
      conditions: [
        {
          name: 'Hepatitis A',
          oid: '2.16.840.1.113883.3.464.1003.110.12.1024'
        }
      ]
    },
    hepatitis_b: {
      id: 'hepatitis_b',
      conditions: [
        {
          name: 'Hepatitis B',
          oid: '2.16.840.1.113883.3.67.1.101.1.269'
        }
      ]
    },
    cirrhosis: {
      id: 'cirrhosis',
      conditions: [
        {
          name: 'Cirrhosis',
          oid: '2.16.840.1.113762.1.4.1032.14'
        }
      ]
    },
    familial_hypercholesterolemia: {
      id: 'familial_hypercholesterolemia',
      conditions: [
        {
          name: 'Familial hypercholesterolemia',
          oid: '2.16.840.1.113762.1.4.1032.15'
        }
      ],
      concepts: [
        {
          name: 'Familial hypercholesterolemia concept',
          codes: [
            {
              name: 'Familial hypercholesterolemia code',
              code: 'E78.01',
              codeSystem: { name: 'ICD-10-CM', id: 'urn:oid:2.16.840.1.113883.6.90' },
              display: 'Familial hypercholesterolemia'
            }
          ],
          display: 'Familial hypercholesterolemia'
        },
      ],
    }
  },
  medications: {
    anti_hypertensive_medication: {
      // https://ushik.ahrq.gov/ViewItemDetails?system=mu&itemKey=211974000
      id: 'anti_hypertensive_medication',
      name: 'Anti-Hypertensive Medication',
      oid: '2.16.840.1.113883.3.600.1476'
    },
    on_statin_therapy: {
      id: 'on_statin_therapy',
      medications: [
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'Low intensity statin therapy',
          type: 'MedicationStatement',
          oid: '2.16.840.1.113762.1.4.1047.107'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'Low intensity statin therapy',
          type: 'MedicationRequest',
          oid: '2.16.840.1.113762.1.4.1047.107'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'Low Intensity Statin Therapy Branded',
          type: 'MedicationStatement',
          oid: '2.16.840.1.113762.1.4.1032.16'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'Low Intensity Statin Therapy Branded',
          type: 'MedicationRequest',
          oid: '2.16.840.1.113762.1.4.1032.16'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'Moderate intensity statin therapy',
          type: 'MedicationStatement',
          oid: '2.16.840.1.113762.1.4.1047.98'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'Moderate intensity statin therapy',
          type: 'MedicationRequest',
          oid: '2.16.840.1.113762.1.4.1047.98'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'Moderate Intensity Statin Therapy Branded',
          type: 'MedicationStatement',
          oid: '2.16.840.1.113762.1.4.1032.17'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'Moderate Intensity Statin Therapy Branded',
          type: 'MedicationRequest',
          oid: '2.16.840.1.113762.1.4.1032.17'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'High intensity statin therapy',
          type: 'MedicationStatement',
          oid: '2.16.840.1.113762.1.4.1047.97'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'High intensity statin therapy',
          type: 'MedicationRequest',
          oid: '2.16.840.1.113762.1.4.1047.97'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'High Intensity Statin Therapy Branded',
          type: 'MedicationStatement',
          oid: '2.16.840.1.113762.1.4.1032.18'
        },
        {
          // TODO: Reused from statin CQM artifact; needs review against other value sets in VSAC.
          name: 'High Intensity Statin Therapy Branded',
          type: 'MedicationRequest',
          oid: '2.16.840.1.113762.1.4.1032.18'
        }
      ]
    },
    on_statin_therapy_CMS347v1: {
      id: 'on_statin_therapy_CMS347v1',
      medications: [
        {
          name: 'Low intensity statin therapy',
          type: 'MedicationStatement',
          oid: '2.16.840.1.113762.1.4.1047.107'
        },
        {
          name: 'Low intensity statin therapy',
          type: 'MedicationRequest',
          oid: '2.16.840.1.113762.1.4.1047.107'
        },
        {
          name: 'Moderate intensity statin therapy',
          type: 'MedicationStatement',
          oid: '2.16.840.1.113762.1.4.1047.98'
        },
        {
          name: 'Moderate intensity statin therapy',
          type: 'MedicationRequest',
          oid: '2.16.840.1.113762.1.4.1047.98'
        },
        {
          name: 'High intensity statin therapy',
          type: 'MedicationStatement',
          oid: '2.16.840.1.113762.1.4.1047.97'
        },
        {
          name: 'High intensity statin therapy',
          type: 'MedicationRequest',
          oid: '2.16.840.1.113762.1.4.1047.97'
        },
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
    ascvd_procedures_CMS347v1: {
      id: 'ascvd_procedures_CMS347v1',
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
  },
  encounters: {
    outpatient_encounter: {
      id: 'outpatient_encounter',
      encounters: [
        {
          name: 'Office visit',
          oid: '2.16.840.1.113883.3.464.1003.101.11.1005'
        },
        {
          name: 'Annual wellness visit',
          oid: '2.16.840.1.113883.3.526.2.1363'
        }
      ]
    }
  },
  allergyIntolerances: {
    statin_allergen: {
      id: 'statin_allergen',
      allergyIntolerances: [
        {
          name: 'Statin allergen',
          oid: '2.16.840.1.113883.3.117.1.7.1.423'
        }
      ]
    }
  }
};
