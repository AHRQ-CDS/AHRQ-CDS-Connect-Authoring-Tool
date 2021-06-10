const supportedResourceProperties = [
  {
    name: 'AllergyIntolerance',
    properties: [
      {
        name: { default: 'clinicalStatus' },
        availability: {
          r2: false,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: [],
          r3: ['active', 'inactive', 'resolved'],
          r4: ['active', 'inactive', 'resolved']
        }
      },
      {
        name: { default: 'verificationStatus' },
        availability: {
          r2: false,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: [],
          r3: ['unconfirmed', 'confirmed', 'refuted', 'entered-in-error'],
          r4: ['unconfirmed', 'confirmed', 'refuted', 'entered-in-error']
        }
      },
      {
        name: { default: 'status' },
        availability: {
          r2: true,
          r3: false,
          r4: false
        },
        predefinedConceptCodes: {
          r2: ['active', 'inactive', 'resolved', 'unconfirmed', 'confirmed', 'refuted', 'entered-in-error'],
          r3: [],
          r4: []
        }
      },
      {
        name: { default: 'category' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['food', 'medication', 'environment', 'other'],
          r3: ['food', 'medication', 'environment', 'biologic'],
          r4: ['food', 'medication', 'environment', 'biologic']
        }
      },
      {
        name: { default: 'criticality' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['CRITL', 'CRITH', 'CRITU'],
          r3: ['low', 'high', 'unable-to-assess'],
          r4: ['low', 'high', 'unable-to-assess']
        }
      },
      {
        name: { default: 'onset[x]', r2: 'onset' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'recordedDate', r3: 'assertedDate' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'lastOccurence', r3: 'lastOccurrence' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      }
    ]
  },
  {
    name: 'Condition',
    properties: [
      {
        name: { default: 'clinicalStatus' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['active', 'relapse', 'remission', 'resolved'],
          r3: ['active', 'recurrence', 'inactive', 'remission', 'resolved'],
          r4: ['active', 'recurrence', 'inactive', 'remission', 'resolved']
        }
      },
      {
        name: { default: 'verificationStatus' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['provisional', 'differential', 'confirmed', 'refuted', 'entered-in-error', 'unknown'],
          r3: ['provisional', 'differential', 'confirmed', 'refuted', 'entered-in-error', 'unknown'],
          r4: ['unconfirmed', 'provisional', 'differential', 'confirmed', 'refuted', 'entered-in-error']
        }
      },
      {
        name: { default: 'onset[x]' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'abatement[x]' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'recordedDate', r2: 'dateRecorded', r3: 'assertedDate' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      }
    ]
  },
  {
    name: 'Device',
    properties: [
      {
        name: { default: 'status' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['entered-in-error', 'available', 'not-available'],
          r3: ['active', 'inactive', 'entered-in-error', 'unknown'],
          r4: ['active', 'inactive', 'entered-in-error', 'unknown']
        }
      },
      {
        name: { default: 'manufactureDate' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'expirationDate', r2: 'expiry' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      }
    ]
  },
  {
    name: 'Encounter',
    properties: [
      {
        name: { default: 'status' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['planned', 'arrived', 'in-progress', 'onleave', 'finished', 'canceled'],
          r3: ['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'canceled', 'unknown'],
          r4: ['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'canceled', 'unknown']
        }
      },
      {
        name: { default: 'class' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        allowsCustomCodes: {
          r2: false,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['inpatient', 'outpatient', 'ambulatory', 'emergency', 'home', 'field', 'daytime', 'virtual', 'other'],
          r3: ['AMB', 'EMER', 'FLD', 'HH', 'IMP', 'ACUTE', 'NONAC', 'OBSENC', 'PRENC', 'SS', 'VR'],
          r4: ['AMB', 'EMER', 'FLD', 'HH', 'IMP', 'ACUTE', 'NONAC', 'OBSENC', 'PRENC', 'SS', 'VR']
        }
      },
      {
        name: { default: 'period' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'reasonCode', r2: 'reason', r3: 'reason' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      }
    ]
  },
  {
    name: 'Immunization',
    properties: [
      {
        name: { default: 'status' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['completed', 'entered-in-error', 'in-progress', 'on-hold', 'stopped'],
          r3: ['completed', 'entered-in-error'],
          r4: ['completed', 'entered-in-error', 'not-done']
        }
      },
      {
        name: { default: 'occurrence[x]', r2: 'date', r3: 'date' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'primarySource', r2: 'reported' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'wasNotGiven', r2: 'wasNotGiven', r3: 'notGiven' },
        availability: {
          r2: true,
          r3: true,
          r4: false
        }
      }
    ]
  },
  {
    name: 'MedicationStatement',
    properties: [
      {
        name: { default: 'status' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['active', 'completed', 'entered-in-error', 'intended'],
          r3: ['active', 'completed', 'entered-in-error', 'intended', 'stopped', 'on-hold'],
          r4: ['active', 'completed', 'entered-in-error', 'intended', 'stopped', 'on-hold', 'unknown', 'not-taken']
        }
      },
      {
        name: { default: 'effective[x]' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'dateAsserted' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'taken', r2: 'wasNotTaken', r3: 'taken' },
        availability: {
          r2: true,
          r3: true,
          r4: false
        }
      }
    ]
  },
  {
    name: 'MedicationRequest',
    properties: [
      {
        name: { default: 'status' },
        availability: {
          r2: false,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: [],
          r3: ['active', 'on-hold', 'canceled', 'completed', 'entered-in-error', 'stopped', 'draft', 'unknown'],
          r4: ['active', 'on-hold', 'canceled', 'completed', 'entered-in-error', 'stopped', 'draft', 'unknown']
        }
      },
      {
        name: { default: 'intent' },
        availability: {
          r2: false,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: [],
          r3: ['proposal', 'plan', 'order', 'instance-order'],
          r4: [
            'proposal',
            'plan',
            'order',
            'original-order',
            'reflex-order',
            'filler-order',
            'instance-order',
            'option'
          ]
        }
      },
      {
        name: { default: 'authoredOn' },
        availability: {
          r2: false,
          r3: true,
          r4: true
        }
      }
    ]
  },
  {
    name: 'MedicationOrder',
    properties: [
      {
        name: { default: 'status' },
        availability: {
          r2: true,
          r3: false,
          r4: false
        },
        predefinedConceptCodes: {
          r2: ['active', 'on-hold', 'completed', 'entered-in-error', 'stopped', 'draft'],
          r3: [],
          r4: []
        }
      },
      {
        name: { default: 'authoredOn', r2: 'dateWritten' },
        availability: {
          r2: true,
          r3: false,
          r4: false
        }
      }
    ]
  },
  {
    name: 'Observation',
    properties: [
      {
        name: { default: 'status' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['registered', 'preliminary', 'final', 'amended', 'canceled', 'entered-in-error', 'unknown'],
          r3: ['registered', 'preliminary', 'final', 'amended', 'corrected', 'canceled', 'entered-in-error', 'unknown'],
          r4: ['registered', 'preliminary', 'final', 'amended', 'corrected', 'canceled', 'entered-in-error', 'unknown']
        }
      },
      {
        name: { default: 'category' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        allowsCustomCodes: {
          r2: true,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['social-history', 'vital-signs', 'imaging', 'laboratory', 'procedure', 'survey', 'exam', 'therapy'],
          r3: ['social-history', 'vital-signs', 'imaging', 'laboratory', 'procedure', 'survey', 'exam', 'therapy'],
          r4: [
            'social-history',
            'vital-signs',
            'imaging',
            'laboratory',
            'procedure',
            'survey',
            'exam',
            'therapy',
            'activity'
          ]
        }
      },
      {
        name: { default: 'effective[x]' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'issued' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'value[x]' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'component' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      }
    ]
  },
  {
    name: 'Observation.component',
    properties: [
      {
        name: { default: 'code' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'value[x]' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      }
    ]
  },
  {
    name: 'Procedure',
    properties: [
      {
        name: { default: 'status' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        },
        predefinedConceptCodes: {
          r2: ['in-progress', 'completed', 'entered-in-error'],
          r3: ['preparation', 'in-progress', 'completed', 'entered-in-error', 'unknown', 'suspended'],
          r4: [
            'preparation',
            'in-progress',
            'not-done',
            'on-hold',
            'stopped',
            'completed',
            'entered-in-error',
            'unknown'
          ]
        }
      },
      {
        name: { default: 'performed[x]' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      },
      {
        name: { default: 'reasonCode', r2: 'reason[x]' },
        availability: {
          r2: true,
          r3: true,
          r4: true
        }
      }
    ]
  },
  {
    name: 'ServiceRequest',
    properties: [
      {
        name: { default: 'status' },
        availability: {
          r2: false,
          r3: false,
          r4: true
        },
        predefinedConceptCodes: {
          r2: [],
          r3: [],
          r4: ['draft', 'active', 'on-hold', 'revoked', 'completed', 'entered-in-error', 'unknown']
        }
      },
      {
        name: { default: 'intent' },
        availability: {
          r2: false,
          r3: false,
          r4: true
        },
        predefinedConceptCodes: {
          r2: [],
          r3: [],
          r4: [
            'proposal',
            'plan',
            'directive',
            'order',
            'original-order',
            'reflex-order',
            'filler-order',
            'instance-order',
            'option'
          ]
        }
      },
      {
        name: { default: 'priority' },
        availability: {
          r2: false,
          r3: false,
          r4: true
        },
        predefinedConceptCodes: {
          r2: [],
          r3: [],
          r4: ['routine', 'urgent', 'asap', 'stat']
        }
      },
      {
        name: { default: 'doNotPerform' },
        availability: {
          r2: false,
          r3: false,
          r4: true
        }
      },
      {
        name: { default: 'occurrence[x]' },
        availability: {
          r2: false,
          r3: false,
          r4: true
        }
      },
      {
        name: { default: 'authoredOn' },
        availability: {
          r2: false,
          r3: false,
          r4: true
        }
      }
    ]
  }
];

const fhirVersionTypeMap = {
  dstu2: '1.0.2',
  stu3: '3.0.0',
  r4: '4.0.1'
};

module.exports = {
  fhirVersionTypeMap: fhirVersionTypeMap,
  supportedResourceProperties: supportedResourceProperties
};
