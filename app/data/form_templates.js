module.exports = [
  {
    id: 0,
    icon: 'user',
    suppress: true,
    name: 'Generic',
    entries: [
      {
        id: 'Base',
        name: 'Base Template',
        type: 'element',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
        ],
      }
    ]
  },
  {
    id: 1,
    icon: 'user',
    name: 'Demographics',
    entries: [
      {
        id: 'AgeRange',
        name: 'Age Range',
        returnType: 'boolean',
        cannotHaveModifiers: true,
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'min_age', type: 'number', typeOfNumber: 'integer', name: 'Minimum Age' },
          { id: 'max_age', type: 'number', typeOfNumber: 'integer', name: 'Maximum Age' },
        ],
      },
      {
        id: 'Gender',
        name: 'Gender',
        returnType: 'boolean',
        cannotHaveModifiers: true,
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name' },
          { id: 'gender', type: 'valueset', select: 'demographics/gender', name: 'Gender' },
        ],
      },
    ]
  },
  {
    id: 2,
    icon: 'eye',
    name: 'Observations',
    entries: [
      {
        id: 'GenericObservation',
        name: 'Observation',
        returnType: 'list_of_observations',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'observation', type: 'observation', name: 'Observation' },
        ],
      },
      {
        id: 'TotalCholesterol',
        name: 'Total Cholesterol',
        extends: 'GenericObservation',
        surpressedModifiers: ['ConceptValue'],
        parameters: [
          { id: 'element_name', value: "TotalCholesterol"},
          { id: 'observation', static: true, value: "total_cholesterol"},
        ]
      },
      {
        id: 'HDLCholesterol',
        name: 'HDL Cholesterol',
        extends: 'GenericObservation',
        surpressedModifiers: ['ConceptValue'],
        parameters: [
          { id: 'element_name', value: "HDLCholesterol"},
          { id: 'observation', static: true, value: "hdl_cholesterol"},
        ]
      },
      {
        id: 'LDLTest',
        name: 'LDL Test',
        extends: 'GenericObservation',
        surpressedModifiers: ['ConceptValue'],
        parameters: [
          { id: 'element_name', value: "LDL_Test"},
          { id: 'observation', static: true, value: "ldl_test"}
        ]
      },
      {
        id: 'SystolicBloodPressure',
        name: 'Systolic Blood Pressure',
        extends: 'GenericObservation',
        surpressedModifiers: ['WithUnit'], // TODO add unit for this element
        parameters: [
          { id: 'element_name', value: "SystolicBloodPressure"},
          { id: 'observation', static: true, value: "systolic_blood_pressure"},
        ]
      },
      {
        id: 'ASCVDRiskAssessment',
        name: 'ASCVD Risk Assessment',
        extends: 'GenericObservation',
        template: 'ObservationByConcept',
        surpressedModifiers: ['ConceptValue', 'ConvertToMgPerdL', 'WithUnit'],
        parameters: [
          { id: 'element_name', value: "MostRecentASCVDRiskAssessmentResult"},
          { id: 'observation', static: true, value: "ascvd_risk_assessment"},
        ]
      },
      {
        id: 'IsSmoker',
        name: 'Is Smoker',
        template: 'ObservationByConcept',
        extends: 'GenericObservation',
        checkInclusionInVS: true, // Very few elements can check this, so this makes sense to require it to be specified
        surpressedModifiers: ['QuantityValue', 'ConvertToMgPerdL', 'WithUnit'],
        parameters: [
          { id: 'element_name', value: "IsSmoker"},
          { id: 'observation',  static: true, value: "smoker"},
        ]
      },
      {
        id: 'Breastfeeding',
        name: 'Breastfeeding',
        template: 'Breastfeeding',
        returnType: 'boolean',
        extends: 'Base',
        surpressedModifiers: ['BooleanComparison', 'WithUnit'],
        parameters: [
          { id: 'element_name', value: "IsBreastfeeding"},
          { id: 'observation', type:'breastfeeding', static: true, value: "breastfeeding"}
        ]
      },
      {
        id: 'Breastfeeding_CMS347v1',
        name: 'Breastfeeding (CMS347v1)',
        template: 'Breastfeeding_withLookBack',
        returnType: 'boolean',
        extends: 'Base',
        surpressedModifiers: ['BooleanComparison', 'WithUnit'],
        parameters: [
          { id: 'element_name', value: "IsBreastfeeding"},
          { id: 'observation', type:'breastfeeding', static: true, value: "breastfeeding"}
        ]
      },
      {
        id: 'ALT',
        name: 'ALT',
        extends: 'GenericObservation',
        parameters: [
          { id: 'element_name', value: "HasALT"},
          { id: 'observation', static: true, value: "alt"}
        ]
      },
    ]
  },
  {
    id: 3,
    icon: 'gear',
    name: 'Operations',
    entries: [
      {
        id: 'And',
        name: 'And',
        conjunction: true,
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Group Name' }
        ]
      },
      {
        id: 'Or',
        name: 'Or',
        conjunction: true,
        returnType: 'boolean',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Group Name' }
        ]
      },
    ]
  },
  {
    id: 4,
    icon: 'stethoscope',
    name: 'Conditions',
    entries: [
      {
        id: 'GenericCondition',
        name: 'Condition',
        returnType: 'list_of_conditions',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'condition', type: 'condition', name: 'Condition' }
        ]
      },
      {
        id: 'Diabetes',
        name: 'Diabetes',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasDiabetes' },
          { id: 'condition', static: true, value: 'diabetes' }
        ]
      },
      {
        id: 'Hypertension',
        name: 'Hypertension',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasHypertension' },
          { id: 'condition', static: true, value: 'hypertension' }
        ]
      },
      {
        id: 'ASCVD',
        name: 'ASCVD',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: "HasASCVD"},
          { id: 'condition', static: true, value: "has_ascvd"}
        ],
      },
      {
        id: 'ASCVD_CMS347v1',
        name: 'ASCVD (CMS347v1)',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: "ASCVDDiagnosis"},
          { id: 'condition', static: true, value: "ascvd_CMS347v1"}
        ],
      },
      {
        id: 'Pregnancydx',
        name: 'Pregnancy dx',
        template: 'Pregnancydx',
        returnType: 'boolean',
        extends: 'Base',
        returnType: 'boolean',
        surpressedModifiers: ['BooleanComparison'],
        parameters: [
          { id: 'element_name', value: 'IsPregnant' },
          { id: 'pregnancy', type: 'pregnancy', static: true, value: 'pregnancy_dx' }
        ]
      },
      {
        id: 'Pregnancydx_CMS347v1',
        name: 'Pregnancy dx (CMS347v1)',
        template: 'Pregnancydx_withLookBack',
        returnType: 'boolean',
        extends: 'Base',
        returnType: 'boolean',
        surpressedModifiers: ['BooleanComparison'],
        parameters: [
          { id: 'element_name', value: 'IsPregnant' },
          { id: 'pregnancy', type: 'pregnancy', static: true, value: 'pregnancy_dx_CMS347v1' }
        ]
      },
      {
        id: 'EndStageRenalDisease',
        name: 'End Stage Renal Disease',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasEndStageRenalDisease' },
          { id: 'condition', static: true, value: 'end_stage_renal_disease' }
        ]
      },
      {
        id: 'Cirrhosis',
        name: 'Cirrhosis',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasCirrhosis' },
          { id: 'condition', static: true, value: 'cirrhosis' }
        ]
      },
      {
        id: 'Rhabdomyolysis',
        name: 'Rhabdomyolysis',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasRhabdomyolysis' },
          { id: 'condition', static: true, value: 'rhabdomyolysis' }
        ]
      },
      {
        id: 'HepatitisA',
        name: 'Hepatitis A',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasHepatitisA' },
          { id: 'condition', static: true, value: 'hepatitis_a' }
        ]
      },
      {
        id: 'HepatitisB',
        name: 'Hepatitis B',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasHepatitisB' },
          { id: 'condition', static: true, value: 'hepatitis_b' }
        ]
      },
      {
        id: 'FamilialHypercholesterolemia',
        name: 'Familial Hypercholesterolemia',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasFamilialHypercholesterolemia' },
          { id: 'condition', static: true, value: 'familial_hypercholesterolemia' }
        ]
      },
    ]
  },
  {
    id: 5,
    icon: 'medkit',
    name: 'Medications',
    entries: [
      {
        id: 'GenericMedication',
        name: 'Medication',
        returnType: 'list_of_medications',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'medication', type: 'medication', name: 'Medication' }
        ]
      },
      {
        id: 'OnStatinTherapy',
        name: 'On Statin Therapy',
        extends: 'GenericMedication',
        template: 'GenericStatement', // See GenericStatement template for explanation
        parameters: [
          { id: 'element_name', value: 'OnStatinTherapy' },
          { id: 'medication', static: true, value: 'on_statin_therapy' }
        ]
      },
      {
        id: 'OnStatinTherapy_CMS347v1',
        name: 'On Statin Therapy (CMS347v1)',
        extends: 'GenericMedication',
        template: 'GenericStatement', // See GenericStatement template for explanation
        parameters: [
          { id: 'element_name', value: 'OnStatinTherapy' },
          { id: 'medication', static: true, value: 'on_statin_therapy_CMS347v1' }
        ]
      },
    ]
  },
  {
    id: 6,
    icon: 'scissors',
    name: 'Procedures',
    entries: [
      {
        id: 'GenericProcedure',
        name: 'Procedure',
        returnType: 'list_of_procedures',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'procedure', type: 'procedure', name: 'Procedure' },
        ],
      },
      {
        id: 'ASCVD_Procedures',
        name: 'ASCVD Procedures',
        extends: 'GenericProcedure',
        parameters: [
          { id: 'element_name', value: 'HasHadASCVDProcedures' },
          { id: 'procedure', static: true, value: "ascvd_procedures" },
        ],
      },
      {
        id: 'ASCVD_Procedures_CMS347v1',
        name: 'ASCVD Procedures (CMS347v1)',
        extends: 'GenericProcedure',
        parameters : [
          { id: 'element_name', value: 'ASCVDProcedures' },
          { id: 'procedure', static: true, value: "ascvd_procedures_CMS347v1" }
        ]
      },
      {
        id: 'Palliative_Care',
        name: 'Palliative Care',
        extends: 'GenericProcedure',
        parameters: [
          { id: 'element_name', value: 'IsInPalliativeCare' },
          { id: 'procedure', static: true, value: "palliative_care" },
        ],
      },
      {
        id: 'Dialysis',
        name: 'Dialysis',
        extends: 'GenericProcedure',
        parameters: [
          { id: 'element_name', value: 'OnDialysis' },
          { id: 'procedure', static: true, value: "dialysis" },
        ],
      }
    ]
  },
  {
    id: 7,
    icon: 'sign-in',
    name: 'Parameters',
    entries: [
      {
        id: 'Boolean',
        name: 'Boolean',
        type: 'parameter',
        returnType: 'boolean',
        extends: 'Base',
        parameters: [
          { id: 'default', type: 'boolean', value: 'true', name: 'Default' }
        ],
      },
    ]
  },
  {
    id: 8,
    icon: 'ambulance',
    name: 'Encounters',
    entries: [
      {
        id: 'GenericEncounter',
        name: 'Encounter',
        returnType: 'list_of_encounters',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'encounter', type: 'encounter', name: 'Encounter' },
        ],
      },
      {
        id: 'OutpatientEncounters',
        name: 'Outpatient Encounter',
        returnType: 'list_of_encounters',
        extends: 'GenericEncounter',
        parameters: [
          { id: 'element_name', value: 'OutpatientEncounter' },
          { id: 'encounter', static: true, value: 'outpatient_encounter' }
        ]
      }
    ]
  },
  {
    id: 9,
    icon: 'thermometer-3',
    name: 'Allergy Intolerances',
    entries: [
      {
        id: 'GenericAllergyIntolerance',
        name: 'Allergy Inteolerance',
        returnType: 'list_of_allergy_intolerances',
        suppress: true,
        extends: 'Base',
        parameters: [
          { id: 'allergyIntolerance', type: 'allergyIntolerance', name: 'Allergy Intolerance' },
        ],
      },
      {
        id: 'StatinAllergen',
        name: 'Statin Allergen',
        extends: 'GenericAllergyIntolerance',
        parameters: [
          { id: 'element_name', value: 'StatinAllergen' },
          { id: 'allergyIntolerance', static: true, value: 'statin_allergen' }
        ]
      }
    ]
  }
];
