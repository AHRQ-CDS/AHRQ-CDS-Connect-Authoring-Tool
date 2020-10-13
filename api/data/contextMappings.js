module.exports = [
  {
    type: "gender",
    system: "http://hl7.org/fhir/administrative-gender",
    male: {
      code: "male",
      display: "Male"
    },
    female: {
      code: "female",
      display: "Female"
    },
    other: {
      code: "other",
      display: "Other"
    },
    unknown: {
      code: "unknown",
      display: "Unknown"
    },

  },
  {
    type: "ageRange",
    code: "age",
    codes: {
      "milliseconds": "ms",
      "seconds": "s",
      "minutes": "min",
      "hours": "h",
      "days": "d",
      "weeks": "wk",
      "months": "mo",
      "years":"a",
    }
  },
  {
    type: "clinicalFocus",
    code: "focus",
    system: "http://hl7.org/fhir/ValueSet/condition-code",
  },
  {
    type: "userType",
    system: "http://nucc.org/provider-taxonomy"
  },
  {
    type: "workflowSetting",
    system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    code: "workflow",
    ambulatory:{
      code: "AMB",
      display: "ambulatory",
    },
    emergency: {
      code: "EMER",
      display: "emergency",
    },
    field: {
      code: "FLD",
      display: "field",
    },
    homeHealth: {
      code: "HH",
      display: "home health",
    },
    inpatientEncounter: {
      code: "IMP",
      display: "inpatient encounter",
    },
    inpatientAcute: {
      code: "ACUTE",
      display: "inpatient acute",
    },
    inpatientNonAcute: {
      code: "NONAC",
      display: "inpatient non-acute",
    },
    observationEncounter: {
      code: "OBSENC",
      display: "observation encounter",
    },
    preAdmission: {
      code: "PRENC",
      display: "pre-admission",
    },
    shortStay: {
      code: "SS",
      display: "short stay",
    },
    virtual: {
      code: "VR",
      display: "virtual",
    },
  },
  {
    type: "workflowTask",
    code: "task",
    system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
  },
  {
    type: "clinicalVenue",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    code: "venue",
  },
  {
    type: "species",
    //system defined by user selection
    code: "species",
    system: "http://terminology.hl7.org/CodeSystem/usage-context-type",
  },
  {
    type: "program",
    system: "http://terminology.hl7.org/CodeSystem/usage-context-type",
    code: "program",
  },
];