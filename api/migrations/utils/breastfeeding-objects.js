// Contains the new format for equivalent Breastfeeding objects.

const breastfeeding = {
  "id": "Or",
  "name": "Or",
  "conjunction": true,
  "returnType": "boolean",
  "parameters": [
    {
      "id": "element_name",
      "type": "string",
      "name": "Group Name",
      "value": "IsBreastfeeding"
    }
  ],
  "uniqueId": "Or-668",
  "childInstances": [
    {
      "id": "GenericCondition_vsac",
      "name": "Condition",
      "returnType": "list_of_conditions",
      "suppress": true,
      "extends": "Base",
      "template": "GenericCondition",
      "parameters": [
        {
          "id": "element_name",
          "type": "string",
          "name": "Element Name",
          "value": "BreastfeedingCondition"
        },
        {
          "id": "condition",
          "type": "condition_vsac",
          "name": "Condition",
          "valueSets": [
            {
              "name": "Breastfeeding",
              "oid": "2.16.840.1.113762.1.4.1047.73"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericCondition_vsac-554",
      "modifiers": [
        {
          "id": "ActiveConiditon",
          "type": "Active",
          "name": "Active",
          "inputTypes": [
            "list_of_conditions"
          ],
          "returnType": "list_of_conditions",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.ActiveCondition"
        },
        {
          "id": "ConfirmedCondition",
          "name": "Confirmed",
          "inputTypes": [
            "list_of_conditions"
          ],
          "returnType": "list_of_conditions",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.Confirmed"
        },
        {
          "id": "BooleanExists",
          "name": "Exists",
          "inputTypes": [
            "list_of_observations",
            "list_of_conditions",
            "list_of_medication_statements",
            "list_of_medication_orders",
            "list_of_procedures",
            "list_of_allergy_intolerances",
            "list_of_encounters"
          ],
          "returnType": "boolean",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "exists"
        }
      ]
    },
    {
      "id": "GenericObservation_vsac",
      "name": "Observation",
      "returnType": "list_of_observations",
      "suppress": true,
      "extends": "Base",
      "template": "GenericObservation",
      "suppressedModifiers": [
        "ConvertToMgPerdL"
      ],
      "parameters": [
        {
          "id": "element_name",
          "type": "string",
          "name": "Element Name",
          "value": "BreastfeedingObservation"
        },
        {
          "id": "observation",
          "type": "observation_vsac",
          "name": "Observation",
          "codes": [
            {
              "code": "63895-7",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              },
              "display": "Breastfeeding status"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericObservation_vsac-7110",
      "modifiers": [
        {
          "id": "LookBackObservation",
          "type": "LookBack",
          "name": "Look Back",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "list_of_observations",
          "values": {
            "value": 1,
            "unit": "years"
          },
          "validator": {
            "type": "require",
            "fields": [
              "value",
              "unit"
            ],
            "args": null
          },
          "cqlTemplate": "LookBackModifier",
          "cqlLibraryFunction": "C3F.ObservationLookBack"
        },
        {
          "id": "VerifiedObservation",
          "name": "Verified",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "list_of_observations",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.Verified"
        },
        {
          "id": "MostRecentObservation",
          "name": "Most Recent",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "observation",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.MostRecent"
        },
        {
          "id": "ConceptValue",
          "name": "Concept Value",
          "inputTypes": [
            "observation"
          ],
          "returnType": "system_concept",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.ConceptValue"
        },
        {
          "id": "Qualifier",
          "name": "Qualifier",
          "inputTypes": [
            "system_concept"
          ],
          "returnType": "boolean",
          "validator": {
            "type": "requiredIfThenOne",
            "fields": [
              "qualifier"
            ],
            "args": [
              "valueSet",
              "code"
            ]
          },
          "values": {
            "qualifier": "value is the code",
            "valueSet": null,
            "code": {
              "display": "Yes",
              "code": "LA33-6",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              }
            }
          },
          "cqlTemplate": null,
          "cqlLibraryFunction": null
        }
      ]
    }
  ]
};

const notBreastfeeding = {
  "id": "And",
  "name": "And",
  "conjunction": true,
  "returnType": "boolean",
  "parameters": [
    {
      "id": "element_name",
      "type": "string",
      "name": "Group Name",
      "value": "IsNotBreastfeeding"
    }
  ],
  "uniqueId": "Or-668668",
  "childInstances": [
    {
      "id": "GenericCondition_vsac",
      "name": "Condition",
      "returnType": "list_of_conditions",
      "suppress": true,
      "extends": "Base",
      "template": "GenericCondition",
      "parameters": [
        {
          "id": "element_name",
          "type": "string",
          "name": "Element Name",
          "value": "BreastfeedingCondition"
        },
        {
          "id": "condition",
          "type": "condition_vsac",
          "name": "Condition",
          "valueSets": [
            {
              "name": "Breastfeeding",
              "oid": "2.16.840.1.113762.1.4.1047.73"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericCondition_vsac-554",
      "modifiers": [
        {
          "id": "ActiveConiditon",
          "type": "Active",
          "name": "Active",
          "inputTypes": [
            "list_of_conditions"
          ],
          "returnType": "list_of_conditions",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.ActiveCondition"
        },
        {
          "id": "ConfirmedCondition",
          "name": "Confirmed",
          "inputTypes": [
            "list_of_conditions"
          ],
          "returnType": "list_of_conditions",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.Confirmed"
        },
        {
          "id": "BooleanExists",
          "name": "Exists",
          "inputTypes": [
            "list_of_observations",
            "list_of_conditions",
            "list_of_medication_statements",
            "list_of_medication_orders",
            "list_of_procedures",
            "list_of_allergy_intolerances",
            "list_of_encounters"
          ],
          "returnType": "boolean",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "exists"
        },
        {
          "id": "BooleanNot",
          "name": "Not",
          "inputTypes": [
            "boolean"
          ],
          "returnType": "boolean",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "not"
        }
      ]
    },
    {
      "id": "GenericObservation_vsac",
      "name": "Observation",
      "returnType": "list_of_observations",
      "suppress": true,
      "extends": "Base",
      "template": "GenericObservation",
      "suppressedModifiers": [
        "ConvertToMgPerdL"
      ],
      "parameters": [
        {
          "id": "element_name",
          "type": "string",
          "name": "Element Name",
          "value": "BreastfeedingObservation"
        },
        {
          "id": "observation",
          "type": "observation_vsac",
          "name": "Observation",
          "codes": [
            {
              "code": "63895-7",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              },
              "display": "Breastfeeding status"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericObservation_vsac-7110",
      "modifiers": [
        {
          "id": "LookBackObservation",
          "type": "LookBack",
          "name": "Look Back",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "list_of_observations",
          "values": {
            "value": 1,
            "unit": "years"
          },
          "validator": {
            "type": "require",
            "fields": [
              "value",
              "unit"
            ],
            "args": null
          },
          "cqlTemplate": "LookBackModifier",
          "cqlLibraryFunction": "C3F.ObservationLookBack"
        },
        {
          "id": "VerifiedObservation",
          "name": "Verified",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "list_of_observations",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.Verified"
        },
        {
          "id": "MostRecentObservation",
          "name": "Most Recent",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "observation",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.MostRecent"
        },
        {
          "id": "ConceptValue",
          "name": "Concept Value",
          "inputTypes": [
            "observation"
          ],
          "returnType": "system_concept",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.ConceptValue"
        },
        {
          "id": "Qualifier",
          "name": "Qualifier",
          "inputTypes": [
            "system_concept"
          ],
          "returnType": "boolean",
          "validator": {
            "type": "requiredIfThenOne",
            "fields": [
              "qualifier"
            ],
            "args": [
              "valueSet",
              "code"
            ]
          },
          "values": {
            "qualifier": "value is the code",
            "valueSet": null,
            "code": {
              "display": "Yes",
              "code": "LA33-6",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              }
            }
          },
          "cqlTemplate": null,
          "cqlLibraryFunction": null
        },
        {
          "id": "BooleanNot",
          "name": "Not",
          "inputTypes": [
            "boolean"
          ],
          "returnType": "boolean",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "not"
        }
      ]
    }
  ]
};

const breastfeedingCMS347v1 = {
  "id": "Or",
  "name": "Or",
  "conjunction": true,
  "returnType": "boolean",
  "parameters": [
    {
      "id": "element_name",
      "type": "string",
      "name": "Group Name",
      "value": "IsBreastfeeding"
    }
  ],
  "uniqueId": "Or-12645",
  "childInstances": [
    {
      "id": "GenericCondition_vsac",
      "name": "Condition",
      "returnType": "list_of_conditions",
      "suppress": true,
      "extends": "Base",
      "template": "GenericCondition",
      "parameters": [
        {
          "id": "element_name",
          "type": "string",
          "name": "Element Name",
          "value": "BreastfeedingCondition"
        },
        {
          "id": "condition",
          "type": "condition_vsac",
          "name": "Condition",
          "valueSets": [
            {
              "name": "Breastfeeding",
              "oid": "2.16.840.1.113762.1.4.1047.73"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericCondition_vsac-11594",
      "modifiers": [
        {
          "id": "LookBackCondition",
          "type": "LookBack",
          "name": "Look Back",
          "inputTypes": [
            "list_of_conditions"
          ],
          "returnType": "list_of_conditions",
          "values": {
            "value": 1,
            "unit": "years"
          },
          "validator": {
            "type": "require",
            "fields": [
              "value",
              "unit"
            ],
            "args": null
          },
          "cqlTemplate": "LookBackModifier",
          "cqlLibraryFunction": "C3F.ConditionLookBack"
        },
        {
          "id": "ActiveConiditon",
          "type": "Active",
          "name": "Active",
          "inputTypes": [
            "list_of_conditions"
          ],
          "returnType": "list_of_conditions",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.ActiveCondition"
        },
        {
          "id": "ConfirmedCondition",
          "name": "Confirmed",
          "inputTypes": [
            "list_of_conditions"
          ],
          "returnType": "list_of_conditions",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.Confirmed"
        },
        {
          "id": "BooleanExists",
          "name": "Exists",
          "inputTypes": [
            "list_of_observations",
            "list_of_conditions",
            "list_of_medication_statements",
            "list_of_medication_orders",
            "list_of_procedures",
            "list_of_allergy_intolerances",
            "list_of_encounters"
          ],
          "returnType": "boolean",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "exists"
        }
      ]
    },
    {
      "id": "GenericObservation_vsac",
      "name": "Observation",
      "returnType": "list_of_observations",
      "suppress": true,
      "extends": "Base",
      "template": "GenericObservation",
      "suppressedModifiers": [
        "ConvertToMgPerdL"
      ],
      "parameters": [
        {
          "id": "element_name",
          "type": "string",
          "name": "Element Name",
          "value": "BreastfeedingObservation"
        },
        {
          "id": "observation",
          "type": "observation_vsac",
          "name": "Observation",
          "codes": [
            {
              "code": "63895-7",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              },
              "display": "Breastfeeding status"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericObservation_vsac-13763",
      "modifiers": [
        {
          "id": "LookBackObservation",
          "type": "LookBack",
          "name": "Look Back",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "list_of_observations",
          "values": {
            "value": 1,
            "unit": "years"
          },
          "validator": {
            "type": "require",
            "fields": [
              "value",
              "unit"
            ],
            "args": null
          },
          "cqlTemplate": "LookBackModifier",
          "cqlLibraryFunction": "C3F.ObservationLookBack"
        },
        {
          "id": "VerifiedObservation",
          "name": "Verified",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "list_of_observations",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.Verified"
        },
        {
          "id": "MostRecentObservation",
          "name": "Most Recent",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "observation",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.MostRecent"
        },
        {
          "id": "ConceptValue",
          "name": "Concept Value",
          "inputTypes": [
            "observation"
          ],
          "returnType": "system_concept",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.ConceptValue"
        },
        {
          "id": "Qualifier",
          "name": "Qualifier",
          "inputTypes": [
            "system_concept"
          ],
          "returnType": "boolean",
          "validator": {
            "type": "requiredIfThenOne",
            "fields": [
              "qualifier"
            ],
            "args": [
              "valueSet",
              "code"
            ]
          },
          "values": {
            "qualifier": "value is the code",
            "valueSet": null,
            "code": {
              "display": "Yes",
              "code": "LA33-6",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              }
            }
          },
          "cqlTemplate": null,
          "cqlLibraryFunction": null
        }
      ]
    }
  ]
};

const notBreastfeedingCMS347v1 = {
  "id": "And",
  "name": "And",
  "conjunction": true,
  "returnType": "boolean",
  "parameters": [
    {
      "id": "element_name",
      "type": "string",
      "name": "Group Name",
      "value": "IsNotBreastfeeding"
    }
  ],
  "uniqueId": "Or-126451256",
  "childInstances": [
    {
      "id": "GenericCondition_vsac",
      "name": "Condition",
      "returnType": "list_of_conditions",
      "suppress": true,
      "extends": "Base",
      "template": "GenericCondition",
      "parameters": [
        {
          "id": "element_name",
          "type": "string",
          "name": "Element Name",
          "value": "BreastfeedingCondition"
        },
        {
          "id": "condition",
          "type": "condition_vsac",
          "name": "Condition",
          "valueSets": [
            {
              "name": "Breastfeeding",
              "oid": "2.16.840.1.113762.1.4.1047.73"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericCondition_vsac-11594",
      "modifiers": [
        {
          "id": "LookBackCondition",
          "type": "LookBack",
          "name": "Look Back",
          "inputTypes": [
            "list_of_conditions"
          ],
          "returnType": "list_of_conditions",
          "values": {
            "value": 1,
            "unit": "years"
          },
          "validator": {
            "type": "require",
            "fields": [
              "value",
              "unit"
            ],
            "args": null
          },
          "cqlTemplate": "LookBackModifier",
          "cqlLibraryFunction": "C3F.ConditionLookBack"
        },
        {
          "id": "ActiveConiditon",
          "type": "Active",
          "name": "Active",
          "inputTypes": [
            "list_of_conditions"
          ],
          "returnType": "list_of_conditions",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.ActiveCondition"
        },
        {
          "id": "ConfirmedCondition",
          "name": "Confirmed",
          "inputTypes": [
            "list_of_conditions"
          ],
          "returnType": "list_of_conditions",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.Confirmed"
        },
        {
          "id": "BooleanExists",
          "name": "Exists",
          "inputTypes": [
            "list_of_observations",
            "list_of_conditions",
            "list_of_medication_statements",
            "list_of_medication_orders",
            "list_of_procedures",
            "list_of_allergy_intolerances",
            "list_of_encounters"
          ],
          "returnType": "boolean",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "exists"
        },
        {
          "id": "BooleanNot",
          "name": "Not",
          "inputTypes": [
            "boolean"
          ],
          "returnType": "boolean",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "not"
        }
      ]
    },
    {
      "id": "GenericObservation_vsac",
      "name": "Observation",
      "returnType": "list_of_observations",
      "suppress": true,
      "extends": "Base",
      "template": "GenericObservation",
      "suppressedModifiers": [
        "ConvertToMgPerdL"
      ],
      "parameters": [
        {
          "id": "element_name",
          "type": "string",
          "name": "Element Name",
          "value": "BreastfeedingObservation"
        },
        {
          "id": "observation",
          "type": "observation_vsac",
          "name": "Observation",
          "codes": [
            {
              "code": "63895-7",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              },
              "display": "Breastfeeding status"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericObservation_vsac-13763",
      "modifiers": [
        {
          "id": "LookBackObservation",
          "type": "LookBack",
          "name": "Look Back",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "list_of_observations",
          "values": {
            "value": 1,
            "unit": "years"
          },
          "validator": {
            "type": "require",
            "fields": [
              "value",
              "unit"
            ],
            "args": null
          },
          "cqlTemplate": "LookBackModifier",
          "cqlLibraryFunction": "C3F.ObservationLookBack"
        },
        {
          "id": "VerifiedObservation",
          "name": "Verified",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "list_of_observations",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.Verified"
        },
        {
          "id": "MostRecentObservation",
          "name": "Most Recent",
          "inputTypes": [
            "list_of_observations"
          ],
          "returnType": "observation",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.MostRecent"
        },
        {
          "id": "ConceptValue",
          "name": "Concept Value",
          "inputTypes": [
            "observation"
          ],
          "returnType": "system_concept",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "C3F.ConceptValue"
        },
        {
          "id": "Qualifier",
          "name": "Qualifier",
          "inputTypes": [
            "system_concept"
          ],
          "returnType": "boolean",
          "validator": {
            "type": "requiredIfThenOne",
            "fields": [
              "qualifier"
            ],
            "args": [
              "valueSet",
              "code"
            ]
          },
          "values": {
            "qualifier": "value is the code",
            "valueSet": null,
            "code": {
              "display": "Yes",
              "code": "LA33-6",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              }
            }
          },
          "cqlTemplate": null,
          "cqlLibraryFunction": null
        },
        {
          "id": "BooleanNot",
          "name": "Not",
          "inputTypes": [
            "boolean"
          ],
          "returnType": "boolean",
          "cqlTemplate": "BaseModifier",
          "cqlLibraryFunction": "not"
        }
      ]
    }
  ]
};

module.exports = {
  breastfeeding,
  notBreastfeeding,
  breastfeedingCMS347v1,
  notBreastfeedingCMS347v1
}