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
