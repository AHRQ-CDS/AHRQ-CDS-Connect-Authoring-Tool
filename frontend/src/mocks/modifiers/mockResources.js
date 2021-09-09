export const mockConditionResourceR4 = {
  name: 'Condition',
  properties: [
    {
      name: 'clinicalStatus',
      typeSpecifier: {
        type: 'NamedTypeSpecifier',
        elementType: 'FHIR.CodeableConcept'
      },
      predefinedCodes: ['active', 'recurrence', 'inactive', 'remission', 'resolved'],
      allowsCustomCodes: false
    },
    {
      name: 'verificationStatus',
      typeSpecifier: {
        type: 'NamedTypeSpecifier',
        elementType: 'FHIR.CodeableConcept'
      },
      predefinedCodes: ['unconfirmed', 'provisional', 'differential', 'confirmed', 'refuted', 'entered-in-error'],
      allowsCustomCodes: false
    },
    {
      name: 'onset',
      typeSpecifier: {
        type: 'ChoiceTypeSpecifier',
        elementType: [
          {
            name: 'onsetDateTime',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.dateTime'
            }
          },
          {
            name: 'onsetAge',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Age'
            }
          },
          {
            name: 'onsetPeriod',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Period'
            }
          },
          {
            name: 'onsetRange',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Range'
            }
          },
          {
            name: 'onsetString',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.string'
            }
          }
        ]
      }
    },
    {
      name: 'abatement',
      typeSpecifier: {
        type: 'ChoiceTypeSpecifier',
        elementType: [
          {
            name: 'abatementDateTime',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.dateTime'
            }
          },
          {
            name: 'abatementAge',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Age'
            }
          },
          {
            name: 'abatementPeriod',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Period'
            }
          },
          {
            name: 'abatementRange',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Range'
            }
          },
          {
            name: 'abatementString',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.string'
            }
          }
        ]
      }
    },
    {
      name: 'recordedDate',
      typeSpecifier: {
        type: 'NamedTypeSpecifier',
        elementType: 'FHIR.dateTime'
      }
    }
  ]
};

export const mockObservationResourceR4 = {
  name: 'Observation',
  properties: [
    {
      name: 'status',
      typeSpecifier: {
        type: 'NamedTypeSpecifier',
        elementType: 'FHIR.code'
      },
      predefinedCodes: [
        'registered',
        'preliminary',
        'final',
        'amended',
        'corrected',
        'canceled',
        'entered-in-error',
        'unknown'
      ],
      allowsCustomCodes: false
    },
    {
      name: 'category',
      typeSpecifier: {
        type: 'ListTypeSpecifier',
        elementType: 'FHIR.CodeableConcept'
      },
      predefinedCodes: [
        'social-history',
        'vital-signs',
        'imaging',
        'laboratory',
        'procedure',
        'survey',
        'exam',
        'therapy',
        'activity'
      ],
      allowsCustomCodes: true
    },
    {
      name: 'effective',
      typeSpecifier: {
        type: 'ChoiceTypeSpecifier',
        elementType: [
          {
            name: 'effectiveDateTime',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.dateTime'
            }
          },
          {
            name: 'effectivePeriod',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Period'
            }
          },
          {
            name: 'effectiveTiming',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Timing'
            }
          },
          {
            name: 'effectiveInstant',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.instant'
            }
          }
        ]
      }
    },
    {
      name: 'issued',
      typeSpecifier: {
        type: 'NamedTypeSpecifier',
        elementType: 'FHIR.instant'
      }
    },
    {
      name: 'value',
      typeSpecifier: {
        type: 'ChoiceTypeSpecifier',
        elementType: [
          {
            name: 'valueQuantity',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Quantity'
            }
          },
          {
            name: 'valueCodeableConcept',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.CodeableConcept'
            }
          },
          {
            name: 'valueString',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.string'
            }
          },
          {
            name: 'valueBoolean',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.boolean'
            }
          },
          {
            name: 'valueInteger',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.integer'
            }
          },
          {
            name: 'valueRange',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Range'
            }
          },
          {
            name: 'valueRatio',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Ratio'
            }
          },
          {
            name: 'valueSampledData',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.SampledData'
            }
          },
          {
            name: 'valueTime',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.time'
            }
          },
          {
            name: 'valueDateTime',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.dateTime'
            }
          },
          {
            name: 'valuePeriod',
            typeSpecifier: {
              type: 'NamedTypeSpecifier',
              elementType: 'FHIR.Period'
            }
          }
        ]
      }
    }
  ]
};
