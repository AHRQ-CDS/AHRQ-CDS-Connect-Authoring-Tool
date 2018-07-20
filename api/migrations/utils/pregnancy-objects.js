// Contains the new format for equivalent Pregnancy objects.

const pregnant = {
  "id": "Or",
  "name": "Or",
  "conjunction": true,
  "returnType": "boolean",
  "parameters": [
    {
      "id": "element_name",
      "type": "string",
      "name": "Group Name",
      "value": "IsPregnant"
    }
  ],
  "uniqueId": "Or-38",
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
          "value": "PregnancyCondition"
        },
        {
          "id": "condition",
          "type": "condition_vsac",
          "name": "Condition",
          "valueSets": [
            {
              "name": "Pregnancy",
              "oid": "2.16.840.1.113883.3.526.3.378"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericCondition_vsac-23",
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
          "value": "PregnantObservation"
        },
        {
          "id": "observation",
          "type": "observation_vsac",
          "name": "Observation",
          "codes": [
            {
              "code": "82810-3",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              },
              "display": "Pregnancy status"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericObservation_vsac-474",
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
            "value": 42,
            "unit": "weeks"
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
              "display": "Pregnant (finding)",
              "code": "77386006",
              "codeSystem": {
                "name": "SNOMED",
                "id": "http://snomed.info/sct"
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

const notPregnant = {
  "id": "And",
  "name": "And",
  "conjunction": true,
  "returnType": "boolean",
  "parameters": [
    {
      "id": "element_name",
      "type": "string",
      "name": "Group Name",
      "value": "NotPregnant"
    }
  ],
  "uniqueId": "Or-3272",
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
          "value": "Pregnancy"
        },
        {
          "id": "condition",
          "type": "condition_vsac",
          "name": "Condition",
          "valueSets": [
            {
              "name": "Pregnancy",
              "oid": "2.16.840.1.113883.3.526.3.378"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericCondition_vsac-2252",
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
          "value": "LOINC 82810-3"
        },
        {
          "id": "observation",
          "type": "observation_vsac",
          "name": "Observation",
          "codes": [
            {
              "code": "82810-3",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              },
              "display": "Pregnancy status"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericObservation_vsac-4681",
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
            "value": 42,
            "unit": "weeks"
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
              "display": "Pregnant (finding)",
              "code": "77386006",
              "codeSystem": {
                "name": "SNOMED",
                "id": "http://snomed.info/sct"
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
}

const pregnantCMS347v1 = {
  "id": "Or",
  "name": "Or",
  "conjunction": true,
  "returnType": "boolean",
  "parameters": [
    {
      "id": "element_name",
      "type": "string",
      "name": "Group Name",
      "value": "IsPregnant"
    }
  ],
  "uniqueId": "Or-637",
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
          "value": "PregnancyCondition"
        },
        {
          "id": "condition",
          "type": "condition_vsac",
          "name": "Condition",
          "valueSets": [
            {
              "name": "Pregnancy Dx",
              "oid": "2.16.840.1.113883.3.600.1.1623"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericCondition_vsac-532",
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
            "value": 42,
            "unit": "weeks"
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
          "value": "LOINC 82810-3"
        },
        {
          "id": "observation",
          "type": "observation_vsac",
          "name": "Observation",
          "codes": [
            {
              "code": "82810-3",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              },
              "display": "Pregnancy status"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericObservation_vsac-7196",
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
            "value": 42,
            "unit": "weeks"
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
              "display": "Pregnant (finding)",
              "code": "77386006",
              "codeSystem": {
                "name": "SNOMED",
                "id": "http://snomed.info/sct"
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

const notPregnantCMS347v1 = {
  "id": "And",
  "name": "And",
  "conjunction": true,
  "returnType": "boolean",
  "parameters": [
    {
      "id": "element_name",
      "type": "string",
      "name": "Group Name",
      "value": "IsNotPregnant"
    }
  ],
  "uniqueId": "Or-9445",
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
          "value": "Pregnancy Dx"
        },
        {
          "id": "condition",
          "type": "condition_vsac",
          "name": "Condition",
          "valueSets": [
            {
              "name": "Pregnancy Dx",
              "oid": "2.16.840.1.113883.3.600.1.1623"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericCondition_vsac-8419",
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
            "value": 42,
            "unit": "weeks"
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
          "value": "LOINC 82810-3"
        },
        {
          "id": "observation",
          "type": "observation_vsac",
          "name": "Observation",
          "codes": [
            {
              "code": "82810-3",
              "codeSystem": {
                "name": "LOINC",
                "id": "http://loinc.org"
              },
              "display": "Pregnancy status"
            }
          ],
          "static": true
        }
      ],
      "type": "element",
      "uniqueId": "GenericObservation_vsac-10778",
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
            "value": 42,
            "unit": "weeks"
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
              "display": "Pregnant (finding)",
              "code": "77386006",
              "codeSystem": {
                "name": "SNOMED",
                "id": "http://snomed.info/sct"
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
  pregnant,
  notPregnant,
  pregnantCMS347v1,
  notPregnantCMS347v1
}
