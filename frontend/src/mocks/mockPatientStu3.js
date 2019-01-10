const mockPatientStu3 = {
  _id: '5c34d2bca28df915d719d035',
  updatedAt: '2019-01-08T16:41:32.506Z',
  createdAt: '2019-01-08T16:41:32.506Z',
  patient: {
    entry: [
      {
        resource: {
          communication: [
            {
              language: {
                text: 'English',
                coding: [
                  {
                    display: 'English',
                    code: 'en-US',
                    system: 'urn:ietf:bcp:47'
                  }
                ]
              }
            }
          ],
          multipleBirthBoolean: false,
          maritalStatus: {
            text: 'S',
            coding: [
              {
                display: 'S',
                code: 'S',
                system: 'http://hl7.org/fhir/v3/MaritalStatus'
              }
            ]
          },
          address: [
            {
              country: 'US',
              postalCode: '02151',
              state: 'Massachusetts',
              city: 'Revere',
              line: [
                '725 Ankunding Tunnel'
              ],
              extension: [
                {
                  extension: [
                    {
                      valueDecimal: -70.990358,
                      url: 'latitude'
                    },
                    {
                      valueDecimal: 42.421011,
                      url: 'longitude'
                    }
                  ],
                  url: 'http://hl7.org/fhir/StructureDefinition/geolocation'
                }
              ]
            }
          ],
          birthDate: '1986-01-12',
          gender: 'male',
          telecom: [
            {
              use: 'home',
              value: '555-796-1783',
              system: 'phone'
            }
          ],
          name: [
            {
              prefix: [
                'Mr.'
              ],
              given: [
                'Arnulfo253'
              ],
              family: 'McClure239',
              use: 'official'
            }
          ],
          identifier: [
            {
              value: '5e948297-21c3-4518-bde5-e53ea55704b7',
              system: 'https://github.com/synthetichealth/synthea'
            },
            {
              value: '5e948297-21c3-4518-bde5-e53ea55704b7',
              system: 'http://hospital.smarthealthit.org',
              type: {
                text: 'Medical Record Number',
                coding: [
                  {
                    display: 'Medical Record Number',
                    code: 'MR',
                    system: 'http://hl7.org/fhir/v2/0203'
                  }
                ]
              }
            },
            {
              value: '999-45-4718',
              system: 'http://hl7.org/fhir/sid/us-ssn',
              type: {
                text: 'Social Security Number',
                coding: [
                  {
                    display: 'Social Security Number',
                    code: 'SB',
                    system: 'http://hl7.org/fhir/identifier-type'
                  }
                ]
              }
            },
            {
              value: 'S99933193',
              system: 'urn:oid:2.16.840.1.113883.4.3.25',
              type: {
                text: "Driver's License",
                coding: [
                  {
                    display: "Driver's License",
                    code: 'DL',
                    system: 'http://hl7.org/fhir/v2/0203'
                  }
                ]
              }
            },
            {
              value: 'X17774266X',
              system: 'http://standardhealthrecord.org/fhir/StructureDefinition/passportNumber',
              type: {
                text: 'Passport Number',
                coding: [
                  {
                    display: 'Passport Number',
                    code: 'PPN',
                    system: 'http://hl7.org/fhir/v2/0203'
                  }
                ]
              }
            }
          ],
          extension: [
            {
              extension: [
                {
                  valueCoding: {
                    display: 'Black or African American',
                    code: '2054-5',
                    system: 'urn:oid:2.16.840.1.113883.6.238'
                  },
                  url: 'ombCategory'
                },
                {
                  valueString: 'Black or African American',
                  url: 'text'
                }
              ],
              url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race'
            },
            {
              extension: [
                {
                  valueCoding: {
                    display: 'Not Hispanic or Latino',
                    code: '2186-5',
                    system: 'urn:oid:2.16.840.1.113883.6.238'
                  },
                  url: 'ombCategory'
                },
                {
                  valueString: 'Not Hispanic or Latino',
                  url: 'text'
                }
              ],
              url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity'
            },
            {
              valueString: 'Arline53 Quitzon246',
              url: 'http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName'
            },
            {
              valueCode: 'M',
              url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex'
            },
            {
              valueAddress: {
                country: 'US',
                state: 'Massachusetts',
                city: 'Abington'
              },
              url: 'http://hl7.org/fhir/StructureDefinition/birthPlace'
            },
            {
              valueDecimal: 0,
              url: 'http://synthetichealth.github.io/synthea/disability-adjusted-life-years'
            },
            {
              valueDecimal: 31,
              url: 'http://synthetichealth.github.io/synthea/quality-adjusted-life-years'
            }
          ],
          text: {
            div: '<div xmlns="http://www.w3.org/1999/xhtml">Generated by <a href="https://github.com/synthetichealth/synthea">Synthea</a>.Version identifier: v1.3.1-518-g9e7ef77\n .   Person seed: -3367591361362125504  Population seed: 1524491891827</div>',
            status: 'generated'
          },
          id: 'a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0',
          resourceType: 'Patient'
        },
        fullUrl: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
      },
      {
        resource: {
          address: [
            {
              country: 'US',
              postalCode: '02114',
              state: 'MA',
              city: 'BOSTON',
              line: [
                '51 BLOSSOM STREET'
              ]
            }
          ],
          telecom: [
            {
              value: '6177223000',
              system: 'phone'
            }
          ],
          name: "SHRINERS' HOSPITAL FOR CHILDREN - BOSTON, THE",
          type: [
            {
              text: 'Healthcare Provider',
              coding: [
                {
                  display: 'Healthcare Provider',
                  code: 'prov',
                  system: 'Healthcare Provider'
                }
              ]
            }
          ],
          identifier: [
            {
              value: '79849d5f-352a-4e6d-8a63-291818175010',
              system: 'https://github.com/synthetichealth/synthea'
            }
          ],
          id: '7f418203-c747-46db-aeae-067b3bd3126f',
          resourceType: 'Organization'
        },
        fullUrl: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1986-01-12T06:52:44-05:00',
            start: '1986-01-12T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '7d5a5cf7-5137-4b1a-bf7c-96877b2fcb86',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:7d5a5cf7-5137-4b1a-bf7c-96877b2fcb86'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 48.0898231335547
          },
          issued: '1986-01-12T06:52:44.948-05:00',
          effectiveDateTime: '1986-01-12T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:7d5a5cf7-5137-4b1a-bf7c-96877b2fcb86'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'da4a956d-9ec8-4fc9-8799-6f8ef8b27ee6',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:da4a956d-9ec8-4fc9-8799-6f8ef8b27ee6'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 4.51713929059964
          },
          issued: '1986-01-12T06:52:44.948-05:00',
          effectiveDateTime: '1986-01-12T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:7d5a5cf7-5137-4b1a-bf7c-96877b2fcb86'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'f25c5a67-fcf8-4058-9c23-1709e9cd0575',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:f25c5a67-fcf8-4058-9c23-1709e9cd0575'
      },
      {
        resource: {
          component: [
            {
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1986-01-12T06:52:44.948-05:00',
          effectiveDateTime: '1986-01-12T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:7d5a5cf7-5137-4b1a-bf7c-96877b2fcb86'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '0c31b3c5-02b8-46fb-a63f-5a230c8aaad0',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:0c31b3c5-02b8-46fb-a63f-5a230c8aaad0'
      },
      {
        resource: {
          primarySource: true,
          date: '1986-01-12T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:7d5a5cf7-5137-4b1a-bf7c-96877b2fcb86'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Hep B, adolescent or pediatric',
            coding: [
              {
                display: 'Hep B, adolescent or pediatric',
                code: '08',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '65da233a-3da1-4f64-a862-0a77bd56db96',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:65da233a-3da1-4f64-a862-0a77bd56db96'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:7d5a5cf7-5137-4b1a-bf7c-96877b2fcb86'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:65da233a-3da1-4f64-a862-0a77bd56db96'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1986-01-12T06:52:44-05:00',
            start: '1986-01-12T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '7e820a61-4777-4495-bfff-1684572f9c70',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:7e820a61-4777-4495-bfff-1684572f9c70'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1986-02-16T06:52:44-05:00',
            start: '1986-02-16T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '4d866ce9-1fb1-41f0-b76e-a54679ed08cd',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:4d866ce9-1fb1-41f0-b76e-a54679ed08cd'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 48.0898231335547
          },
          issued: '1986-02-16T06:52:44.948-05:00',
          effectiveDateTime: '1986-02-16T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:4d866ce9-1fb1-41f0-b76e-a54679ed08cd'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'd95c279b-9a5e-43e2-b4d4-484f4d8766b5',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:d95c279b-9a5e-43e2-b4d4-484f4d8766b5'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 4.51713929059964
          },
          issued: '1986-02-16T06:52:44.948-05:00',
          effectiveDateTime: '1986-02-16T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:4d866ce9-1fb1-41f0-b76e-a54679ed08cd'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'ec90ef5a-8446-4a54-943a-fabb33dcd347',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:ec90ef5a-8446-4a54-943a-fabb33dcd347'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 84.8003159292051
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 108.514425054416
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1986-02-16T06:52:44.948-05:00',
          effectiveDateTime: '1986-02-16T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:4d866ce9-1fb1-41f0-b76e-a54679ed08cd'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '9fa17470-78f5-4555-8deb-a893ea5ebe67',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:9fa17470-78f5-4555-8deb-a893ea5ebe67'
      },
      {
        resource: {
          primarySource: true,
          date: '1986-02-16T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:4d866ce9-1fb1-41f0-b76e-a54679ed08cd'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Hep B, adolescent or pediatric',
            coding: [
              {
                display: 'Hep B, adolescent or pediatric',
                code: '08',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '9668c323-39e7-42c9-bb95-c3b26017f8ad',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:9668c323-39e7-42c9-bb95-c3b26017f8ad'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:4d866ce9-1fb1-41f0-b76e-a54679ed08cd'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:9668c323-39e7-42c9-bb95-c3b26017f8ad'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1986-02-16T06:52:44-05:00',
            start: '1986-02-16T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'da35e660-557e-4063-b69a-087e66480ed5',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:da35e660-557e-4063-b69a-087e66480ed5'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1986-04-20T06:52:44-05:00',
            start: '1986-04-20T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'a6a30454-4a07-487c-8998-5fc4c470620a',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:a6a30454-4a07-487c-8998-5fc4c470620a'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 57.8275746649629
          },
          issued: '1986-04-20T06:52:44.948-05:00',
          effectiveDateTime: '1986-04-20T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:a6a30454-4a07-487c-8998-5fc4c470620a'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '667c2876-6fa6-4c40-b33a-ef53133a49de',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:667c2876-6fa6-4c40-b33a-ef53133a49de'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 7.14053751970418
          },
          issued: '1986-04-20T06:52:44.948-05:00',
          effectiveDateTime: '1986-04-20T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:a6a30454-4a07-487c-8998-5fc4c470620a'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'a7ea6554-56f8-4e00-a137-5fd6ee1b4510',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:a7ea6554-56f8-4e00-a137-5fd6ee1b4510'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 88.6265879931786
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 102.700607761573
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1986-04-20T06:52:44.948-05:00',
          effectiveDateTime: '1986-04-20T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:a6a30454-4a07-487c-8998-5fc4c470620a'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '08adbdf9-f1d6-48f8-b2b4-175ee475530f',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:08adbdf9-f1d6-48f8-b2b4-175ee475530f'
      },
      {
        resource: {
          performedDateTime: '1986-04-20T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:a6a30454-4a07-487c-8998-5fc4c470620a'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: '8728f41d-7c79-4fd5-af7d-88cd651817f6',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:8728f41d-7c79-4fd5-af7d-88cd651817f6'
      },
      {
        resource: {
          primarySource: true,
          date: '1986-04-20T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:a6a30454-4a07-487c-8998-5fc4c470620a'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Hib (PRP-OMP)',
            coding: [
              {
                display: 'Hib (PRP-OMP)',
                code: '49',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '8edc17b8-567b-420d-aa41-7e0ab039a151',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:8edc17b8-567b-420d-aa41-7e0ab039a151'
      },
      {
        resource: {
          primarySource: true,
          date: '1986-04-20T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:a6a30454-4a07-487c-8998-5fc4c470620a'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'IPV',
            coding: [
              {
                display: 'IPV',
                code: '10',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '93ba29da-4d3a-4c5c-9334-4c34be9b7d83',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:93ba29da-4d3a-4c5c-9334-4c34be9b7d83'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 897
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:a6a30454-4a07-487c-8998-5fc4c470620a'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                2
              ],
              sequence: 3
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 4
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:8728f41d-7c79-4fd5-af7d-88cd651817f6'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:8edc17b8-567b-420d-aa41-7e0ab039a151'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            },
            {
              valueReference: {
                reference: 'urn:uuid:93ba29da-4d3a-4c5c-9334-4c34be9b7d83'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 2
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1986-04-20T06:52:44-05:00',
            start: '1986-04-20T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '2ea9ce4b-6933-4226-80f9-79403121eb61',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:2ea9ce4b-6933-4226-80f9-79403121eb61'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1986-06-22T07:52:44-04:00',
            start: '1986-06-22T07:52:44-04:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '8d044248-5230-47e9-bf84-38b981351fd7',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:8d044248-5230-47e9-bf84-38b981351fd7'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 61.7631519147792
          },
          issued: '1986-06-22T07:52:44.948-04:00',
          effectiveDateTime: '1986-06-22T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:8d044248-5230-47e9-bf84-38b981351fd7'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '4fb097e2-4b69-49f7-9436-ab9012608281',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:4fb097e2-4b69-49f7-9436-ab9012608281'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 8.49339415338162
          },
          issued: '1986-06-22T07:52:44.948-04:00',
          effectiveDateTime: '1986-06-22T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:8d044248-5230-47e9-bf84-38b981351fd7'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '9d3db5f2-e486-464e-a2ae-ff2a968512fe',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:9d3db5f2-e486-464e-a2ae-ff2a968512fe'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 70.3946043884706
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 107.507669315206
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1986-06-22T07:52:44.948-04:00',
          effectiveDateTime: '1986-06-22T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:8d044248-5230-47e9-bf84-38b981351fd7'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '56465b09-e2e5-47f3-9bd8-5fe962e0f6e9',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:56465b09-e2e5-47f3-9bd8-5fe962e0f6e9'
      },
      {
        resource: {
          performedDateTime: '1986-06-22T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:8d044248-5230-47e9-bf84-38b981351fd7'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: 'aeafd984-9121-40e6-96b7-14214756a9b9',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:aeafd984-9121-40e6-96b7-14214756a9b9'
      },
      {
        resource: {
          primarySource: true,
          date: '1986-06-22T07:52:44-04:00',
          encounter: {
            reference: 'urn:uuid:8d044248-5230-47e9-bf84-38b981351fd7'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Hib (PRP-OMP)',
            coding: [
              {
                display: 'Hib (PRP-OMP)',
                code: '49',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '26145586-ae8d-40a2-bc55-e91b971c5a5d',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:26145586-ae8d-40a2-bc55-e91b971c5a5d'
      },
      {
        resource: {
          primarySource: true,
          date: '1986-06-22T07:52:44-04:00',
          encounter: {
            reference: 'urn:uuid:8d044248-5230-47e9-bf84-38b981351fd7'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'IPV',
            coding: [
              {
                display: 'IPV',
                code: '10',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '8b4c0398-d744-4ff4-97eb-df30e9212569',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:8b4c0398-d744-4ff4-97eb-df30e9212569'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 897
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:8d044248-5230-47e9-bf84-38b981351fd7'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                2
              ],
              sequence: 3
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 4
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:aeafd984-9121-40e6-96b7-14214756a9b9'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:26145586-ae8d-40a2-bc55-e91b971c5a5d'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            },
            {
              valueReference: {
                reference: 'urn:uuid:8b4c0398-d744-4ff4-97eb-df30e9212569'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 2
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1986-06-22T07:52:44-04:00',
            start: '1986-06-22T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '42687f17-39c7-4ba8-9219-24627d5e9ab7',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:42687f17-39c7-4ba8-9219-24627d5e9ab7'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1986-09-21T07:52:44-04:00',
            start: '1986-09-21T07:52:44-04:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'e4a72599-2f63-4559-b2d3-4f06b61c0e78',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:e4a72599-2f63-4559-b2d3-4f06b61c0e78'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 66.3047684961253
          },
          issued: '1986-09-21T07:52:44.948-04:00',
          effectiveDateTime: '1986-09-21T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:e4a72599-2f63-4559-b2d3-4f06b61c0e78'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '88ccccb6-0e7b-4595-8a09-f0d912a3bbdc',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:88ccccb6-0e7b-4595-8a09-f0d912a3bbdc'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 10.0734700578787
          },
          issued: '1986-09-21T07:52:44.948-04:00',
          effectiveDateTime: '1986-09-21T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:e4a72599-2f63-4559-b2d3-4f06b61c0e78'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'e036ac06-e136-4b7e-a828-ab577bb684cb',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:e036ac06-e136-4b7e-a828-ab577bb684cb'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 82.5451487986619
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 100.065431895297
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1986-09-21T07:52:44.948-04:00',
          effectiveDateTime: '1986-09-21T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:e4a72599-2f63-4559-b2d3-4f06b61c0e78'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '6e35a5f2-ec75-4f4d-91a3-1f30351c3402',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:6e35a5f2-ec75-4f4d-91a3-1f30351c3402'
      },
      {
        resource: {
          performedDateTime: '1986-09-21T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:e4a72599-2f63-4559-b2d3-4f06b61c0e78'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: 'dff9ea9e-8831-4d80-80e2-0816ac3ee117',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:dff9ea9e-8831-4d80-80e2-0816ac3ee117'
      },
      {
        resource: {
          primarySource: true,
          date: '1986-09-21T07:52:44-04:00',
          encounter: {
            reference: 'urn:uuid:e4a72599-2f63-4559-b2d3-4f06b61c0e78'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'IPV',
            coding: [
              {
                display: 'IPV',
                code: '10',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '1143cf73-976a-4155-bbfb-d3d4ca48b0de',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:1143cf73-976a-4155-bbfb-d3d4ca48b0de'
      },
      {
        resource: {
          primarySource: true,
          date: '1986-09-21T07:52:44-04:00',
          encounter: {
            reference: 'urn:uuid:e4a72599-2f63-4559-b2d3-4f06b61c0e78'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '46a3b967-4648-436b-b985-9e8186d51f50',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:46a3b967-4648-436b-b985-9e8186d51f50'
      },
      {
        resource: {
          primarySource: true,
          date: '1986-09-21T07:52:44-04:00',
          encounter: {
            reference: 'urn:uuid:e4a72599-2f63-4559-b2d3-4f06b61c0e78'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Hep B, adolescent or pediatric',
            coding: [
              {
                display: 'Hep B, adolescent or pediatric',
                code: '08',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '9b781aaa-2aa1-4af7-9ca8-75ba804dbf34',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:9b781aaa-2aa1-4af7-9ca8-75ba804dbf34'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 1033
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:e4a72599-2f63-4559-b2d3-4f06b61c0e78'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                2
              ],
              sequence: 3
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                3
              ],
              sequence: 4
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 5
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:dff9ea9e-8831-4d80-80e2-0816ac3ee117'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:1143cf73-976a-4155-bbfb-d3d4ca48b0de'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            },
            {
              valueReference: {
                reference: 'urn:uuid:46a3b967-4648-436b-b985-9e8186d51f50'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 2
            },
            {
              valueReference: {
                reference: 'urn:uuid:9b781aaa-2aa1-4af7-9ca8-75ba804dbf34'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 3
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1986-09-21T07:52:44-04:00',
            start: '1986-09-21T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'b3fdbed1-2dfd-4b3c-89f2-b5284619eafe',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:b3fdbed1-2dfd-4b3c-89f2-b5284619eafe'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1986-12-21T06:52:44-05:00',
            start: '1986-12-21T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '897a82d7-ed77-4275-9108-d4d7cf8c32e6',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:897a82d7-ed77-4275-9108-d4d7cf8c32e6'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 69.9474503151551
          },
          issued: '1986-12-21T06:52:44.948-05:00',
          effectiveDateTime: '1986-12-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:897a82d7-ed77-4275-9108-d4d7cf8c32e6'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'd82ea5ba-f985-4de0-a5db-6ad13e0aa743',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:d82ea5ba-f985-4de0-a5db-6ad13e0aa743'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 11.2482650207514
          },
          issued: '1986-12-21T06:52:44.948-05:00',
          effectiveDateTime: '1986-12-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:897a82d7-ed77-4275-9108-d4d7cf8c32e6'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '1bfe5b3d-8d8b-4e2e-a88b-79ff2f5489a5',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:1bfe5b3d-8d8b-4e2e-a88b-79ff2f5489a5'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 78.5807879468534
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 110.01639091573
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1986-12-21T06:52:44.948-05:00',
          effectiveDateTime: '1986-12-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:897a82d7-ed77-4275-9108-d4d7cf8c32e6'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'bef30020-d203-4c52-9adb-ef1dbc6f8d61',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:bef30020-d203-4c52-9adb-ef1dbc6f8d61'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:897a82d7-ed77-4275-9108-d4d7cf8c32e6'
                }
              ],
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1986-12-21T06:52:44-05:00',
            start: '1986-12-21T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '305b352a-4a55-417b-b7ef-3eb9c006c699',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:305b352a-4a55-417b-b7ef-3eb9c006c699'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          reason: [
            {
              coding: [
                {
                  display: 'Otitis media',
                  code: '65363002',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          period: {
            end: '1987-02-06T06:52:44-05:00',
            start: '1987-02-06T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for symptom',
              coding: [
                {
                  display: 'Encounter for symptom',
                  code: '185345009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'outpatient'
          },
          status: 'finished',
          id: '25750c8b-6047-4604-8c04-edf018da6b10',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:25750c8b-6047-4604-8c04-edf018da6b10'
      },
      {
        resource: {
          assertedDate: '1987-02-06T06:52:44-05:00',
          abatementDateTime: '1987-03-22T06:52:44-05:00',
          onsetDateTime: '1987-02-06T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:25750c8b-6047-4604-8c04-edf018da6b10'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Otitis media',
            coding: [
              {
                display: 'Otitis media',
                code: '65363002',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: 'confirmed',
          clinicalStatus: 'resolved',
          id: '31edb127-7f05-42ba-ac03-7675f642b25d',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:31edb127-7f05-42ba-ac03-7675f642b25d'
      },
      {
        resource: {
          dosageInstruction: [
            {
              doseQuantity: {
                value: 1
              },
              asNeededBoolean: false,
              timing: {
                repeat: {
                  periodUnit: 'd',
                  period: 1,
                  frequency: 2
                }
              },
              additionalInstruction: [
                {
                  text: 'Take at regular intervals. Complete the prescribed course unless otherwise directed.',
                  coding: [
                    {
                      display: 'Take at regular intervals. Complete the prescribed course unless otherwise directed.',
                      code: '418577003',
                      system: 'http://snomed.info/sct'
                    }
                  ]
                }
              ],
              sequence: 1
            }
          ],
          authoredOn: '1987-02-06T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:25750c8b-6047-4604-8c04-edf018da6b10'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          medicationCodeableConcept: {
            text: 'Amoxicillin 200 MG Oral Tablet',
            coding: [
              {
                display: 'Amoxicillin 200 MG Oral Tablet',
                code: '392151',
                system: 'http://www.nlm.nih.gov/research/umls/rxnorm'
              }
            ]
          },
          intent: 'order',
          status: 'stopped',
          id: '6ffc573d-361d-4e5f-bdad-a8f86d241e34',
          resourceType: 'MedicationRequest'
        },
        fullUrl: 'urn:uuid:6ffc573d-361d-4e5f-bdad-a8f86d241e34'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 255
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:25750c8b-6047-4604-8c04-edf018da6b10'
                }
              ],
              sequence: 1
            }
          ],
          prescription: {
            reference: 'urn:uuid:6ffc573d-361d-4e5f-bdad-a8f86d241e34'
          },
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1987-02-06T06:52:44-05:00',
            start: '1987-02-06T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '14046ea4-ad6e-427a-811c-554bdd465d97',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:14046ea4-ad6e-427a-811c-554bdd465d97'
      },
      {
        resource: {
          dosageInstruction: [
            {
              asNeededBoolean: true,
              sequence: 1
            }
          ],
          authoredOn: '1987-02-06T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:25750c8b-6047-4604-8c04-edf018da6b10'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          medicationCodeableConcept: {
            text: 'Ibuprofen 100 MG Oral Tablet',
            coding: [
              {
                display: 'Ibuprofen 100 MG Oral Tablet',
                code: '198405',
                system: 'http://www.nlm.nih.gov/research/umls/rxnorm'
              }
            ]
          },
          intent: 'order',
          status: 'stopped',
          id: '997359aa-24f0-4ed5-b1e5-6877d3e9237c',
          resourceType: 'MedicationRequest'
        },
        fullUrl: 'urn:uuid:997359aa-24f0-4ed5-b1e5-6877d3e9237c'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 255
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:25750c8b-6047-4604-8c04-edf018da6b10'
                }
              ],
              sequence: 1
            }
          ],
          prescription: {
            reference: 'urn:uuid:997359aa-24f0-4ed5-b1e5-6877d3e9237c'
          },
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1987-02-06T06:52:44-05:00',
            start: '1987-02-06T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '40f95e2c-b769-436f-b638-d55c1b4fb55c',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:40f95e2c-b769-436f-b638-d55c1b4fb55c'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:25750c8b-6047-4604-8c04-edf018da6b10'
                }
              ],
              sequence: 1
            },
            {
              diagnosisLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:31edb127-7f05-42ba-ac03-7675f642b25d'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1987-02-06T06:52:44-05:00',
            start: '1987-02-06T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '11dea8a1-e517-42a9-97fc-3a711a2d51d8',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:11dea8a1-e517-42a9-97fc-3a711a2d51d8'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1987-03-22T06:52:44-05:00',
            start: '1987-03-22T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'd34860de-4624-432a-8082-2aa4513b9291',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:d34860de-4624-432a-8082-2aa4513b9291'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 73.0438943210705
          },
          issued: '1987-03-22T06:52:44.948-05:00',
          effectiveDateTime: '1987-03-22T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:d34860de-4624-432a-8082-2aa4513b9291'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'e1ab4cb1-889d-497f-a21d-436603452d9b',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:e1ab4cb1-889d-497f-a21d-436603452d9b'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 12.1377553880798
          },
          issued: '1987-03-22T06:52:44.948-05:00',
          effectiveDateTime: '1987-03-22T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:d34860de-4624-432a-8082-2aa4513b9291'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '7fb63363-e2b0-4c97-bef1-d5eee489646a',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:7fb63363-e2b0-4c97-bef1-d5eee489646a'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 86.8553731697456
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 134.849116712718
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1987-03-22T06:52:44.948-05:00',
          effectiveDateTime: '1987-03-22T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:d34860de-4624-432a-8082-2aa4513b9291'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '7c562e50-42ae-4e31-ba2e-0e9bc7751eac',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:7c562e50-42ae-4e31-ba2e-0e9bc7751eac'
      },
      {
        resource: {
          primarySource: true,
          date: '1987-03-22T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:d34860de-4624-432a-8082-2aa4513b9291'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Hib (PRP-OMP)',
            coding: [
              {
                display: 'Hib (PRP-OMP)',
                code: '49',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'a5dc6ee5-6adf-4cae-8fbc-466d00f022db',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:a5dc6ee5-6adf-4cae-8fbc-466d00f022db'
      },
      {
        resource: {
          primarySource: true,
          date: '1987-03-22T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:d34860de-4624-432a-8082-2aa4513b9291'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'varicella',
            coding: [
              {
                display: 'varicella',
                code: '21',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '37a5b8b4-b185-415d-aa0c-7a57e084138e',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:37a5b8b4-b185-415d-aa0c-7a57e084138e'
      },
      {
        resource: {
          primarySource: true,
          date: '1987-03-22T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:d34860de-4624-432a-8082-2aa4513b9291'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'MMR',
            coding: [
              {
                display: 'MMR',
                code: '03',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '209850d4-8958-44f3-ae04-7c193824a0ae',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:209850d4-8958-44f3-ae04-7c193824a0ae'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 533
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:d34860de-4624-432a-8082-2aa4513b9291'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                2
              ],
              sequence: 3
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                3
              ],
              sequence: 4
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:a5dc6ee5-6adf-4cae-8fbc-466d00f022db'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            },
            {
              valueReference: {
                reference: 'urn:uuid:37a5b8b4-b185-415d-aa0c-7a57e084138e'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 2
            },
            {
              valueReference: {
                reference: 'urn:uuid:209850d4-8958-44f3-ae04-7c193824a0ae'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 3
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1987-03-22T06:52:44-05:00',
            start: '1987-03-22T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '38bcd427-0e2a-424c-84b5-c9ab39d43b4e',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:38bcd427-0e2a-424c-84b5-c9ab39d43b4e'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1987-06-21T07:52:44-04:00',
            start: '1987-06-21T07:52:44-04:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '36e290f0-7f5d-4758-af8b-81cb263a910a',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:36e290f0-7f5d-4758-af8b-81cb263a910a'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 75.7671291026518
          },
          issued: '1987-06-21T07:52:44.948-04:00',
          effectiveDateTime: '1987-06-21T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:36e290f0-7f5d-4758-af8b-81cb263a910a'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '91899405-0c17-4091-b468-bf1a63eed808',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:91899405-0c17-4091-b468-bf1a63eed808'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 12.8347136096279
          },
          issued: '1987-06-21T07:52:44.948-04:00',
          effectiveDateTime: '1987-06-21T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:36e290f0-7f5d-4758-af8b-81cb263a910a'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '877e21d4-322f-4788-93e4-6c832ee94129',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:877e21d4-322f-4788-93e4-6c832ee94129'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 75.9265739080212
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 135.832428368822
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1987-06-21T07:52:44.948-04:00',
          effectiveDateTime: '1987-06-21T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:36e290f0-7f5d-4758-af8b-81cb263a910a'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '14dd8f46-2854-43f2-9f9f-acd8845f90f0',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:14dd8f46-2854-43f2-9f9f-acd8845f90f0'
      },
      {
        resource: {
          performedDateTime: '1987-06-21T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:36e290f0-7f5d-4758-af8b-81cb263a910a'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: 'efc443f1-fc1f-4869-82da-3f2d1bdb0196',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:efc443f1-fc1f-4869-82da-3f2d1bdb0196'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 625
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:36e290f0-7f5d-4758-af8b-81cb263a910a'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:efc443f1-fc1f-4869-82da-3f2d1bdb0196'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1987-06-21T07:52:44-04:00',
            start: '1987-06-21T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '5060c896-755f-4c3b-a7c2-37f389b6a934',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:5060c896-755f-4c3b-a7c2-37f389b6a934'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1987-12-20T06:52:44-05:00',
            start: '1987-12-20T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '82e796e4-7ec4-47c6-9350-23dbb9b98b41',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:82e796e4-7ec4-47c6-9350-23dbb9b98b41'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 80.4542154971088
          },
          issued: '1987-12-20T06:52:44.948-05:00',
          effectiveDateTime: '1987-12-20T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:82e796e4-7ec4-47c6-9350-23dbb9b98b41'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '292aea7f-39f1-4113-b682-5a5cc2a60ed1',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:292aea7f-39f1-4113-b682-5a5cc2a60ed1'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 13.9144191628459
          },
          issued: '1987-12-20T06:52:44.948-05:00',
          effectiveDateTime: '1987-12-20T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:82e796e4-7ec4-47c6-9350-23dbb9b98b41'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '43672215-d9a4-4d72-bc7a-40a8cc45ddfa',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:43672215-d9a4-4d72-bc7a-40a8cc45ddfa'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 81.5124831821469
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 126.657139232618
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1987-12-20T06:52:44.948-05:00',
          effectiveDateTime: '1987-12-20T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:82e796e4-7ec4-47c6-9350-23dbb9b98b41'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'c5168e04-11fd-48bf-b197-711d3a6d2414',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:c5168e04-11fd-48bf-b197-711d3a6d2414'
      },
      {
        resource: {
          performedDateTime: '1987-12-20T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:82e796e4-7ec4-47c6-9350-23dbb9b98b41'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: 'e6bc38ff-432f-4bb8-97fb-0c0d55f4c8ac',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:e6bc38ff-432f-4bb8-97fb-0c0d55f4c8ac'
      },
      {
        resource: {
          primarySource: true,
          date: '1987-12-20T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:82e796e4-7ec4-47c6-9350-23dbb9b98b41'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '1a95f716-1b42-4e69-a81d-3c1b8d96663a',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:1a95f716-1b42-4e69-a81d-3c1b8d96663a'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 761
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:82e796e4-7ec4-47c6-9350-23dbb9b98b41'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 3
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:e6bc38ff-432f-4bb8-97fb-0c0d55f4c8ac'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:1a95f716-1b42-4e69-a81d-3c1b8d96663a'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1987-12-20T06:52:44-05:00',
            start: '1987-12-20T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '8b0aa2de-a5b8-4e36-9c78-9282b8951223',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:8b0aa2de-a5b8-4e36-9c78-9282b8951223'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1988-06-19T07:52:44-04:00',
            start: '1988-06-19T07:52:44-04:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'fb7c6314-47e9-4161-8f9e-5e2df1cc5372',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:fb7c6314-47e9-4161-8f9e-5e2df1cc5372'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 83.9982336750915
          },
          issued: '1988-06-19T07:52:44.948-04:00',
          effectiveDateTime: '1988-06-19T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:fb7c6314-47e9-4161-8f9e-5e2df1cc5372'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'b93a5bd9-7483-4f94-9196-404ee0b6fcc7',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:b93a5bd9-7483-4f94-9196-404ee0b6fcc7'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 14.8528461315752
          },
          issued: '1988-06-19T07:52:44.948-04:00',
          effectiveDateTime: '1988-06-19T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:fb7c6314-47e9-4161-8f9e-5e2df1cc5372'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '3e318337-7b05-4a6a-9a2b-d527785090a3',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:3e318337-7b05-4a6a-9a2b-d527785090a3'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 21.0508372916584
          },
          issued: '1988-06-19T07:52:44.948-04:00',
          effectiveDateTime: '1988-06-19T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:fb7c6314-47e9-4161-8f9e-5e2df1cc5372'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '53a49043-8db1-4a2e-ba35-86f7f8c1a736',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:53a49043-8db1-4a2e-ba35-86f7f8c1a736'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 77.5729361622636
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 103.032974430308
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1988-06-19T07:52:44.948-04:00',
          effectiveDateTime: '1988-06-19T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:fb7c6314-47e9-4161-8f9e-5e2df1cc5372'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '55aa83e8-0bf2-4037-badd-17abda7df10f',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:55aa83e8-0bf2-4037-badd-17abda7df10f'
      },
      {
        resource: {
          performedDateTime: '1988-06-19T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:fb7c6314-47e9-4161-8f9e-5e2df1cc5372'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: 'e91bec36-1ac5-4204-bbf6-4405da3740e2',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:e91bec36-1ac5-4204-bbf6-4405da3740e2'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 625
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:fb7c6314-47e9-4161-8f9e-5e2df1cc5372'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:e91bec36-1ac5-4204-bbf6-4405da3740e2'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1988-06-19T07:52:44-04:00',
            start: '1988-06-19T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'bb32cfda-38a4-43ad-b7ee-4aafadf3eb77',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:bb32cfda-38a4-43ad-b7ee-4aafadf3eb77'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1988-12-18T06:52:44-05:00',
            start: '1988-12-18T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'e7b8c878-54f9-48e4-b057-a27a5b0cc3f9',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:e7b8c878-54f9-48e4-b057-a27a5b0cc3f9'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 87.2848299509592
          },
          issued: '1988-12-18T06:52:44.948-05:00',
          effectiveDateTime: '1988-12-18T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:e7b8c878-54f9-48e4-b057-a27a5b0cc3f9'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'bbeac9e8-8b66-479b-8d79-83d8bba29741',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:bbeac9e8-8b66-479b-8d79-83d8bba29741'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 15.6587290028634
          },
          issued: '1988-12-18T06:52:44.948-05:00',
          effectiveDateTime: '1988-12-18T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:e7b8c878-54f9-48e4-b057-a27a5b0cc3f9'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '5ad5fde2-79b4-4ec3-8d45-adc0dfb50e32',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:5ad5fde2-79b4-4ec3-8d45-adc0dfb50e32'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 20.5531772580963
          },
          issued: '1988-12-18T06:52:44.948-05:00',
          effectiveDateTime: '1988-12-18T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:e7b8c878-54f9-48e4-b057-a27a5b0cc3f9'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'c4df3516-0ced-4d24-9ebd-eb3c41df475b',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:c4df3516-0ced-4d24-9ebd-eb3c41df475b'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 83.7113433156886
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 117.882311419056
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1988-12-18T06:52:44.948-05:00',
          effectiveDateTime: '1988-12-18T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:e7b8c878-54f9-48e4-b057-a27a5b0cc3f9'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '6426d2c9-7045-4b1d-959c-8b0068e70b7f',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:6426d2c9-7045-4b1d-959c-8b0068e70b7f'
      },
      {
        resource: {
          primarySource: true,
          date: '1988-12-18T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:e7b8c878-54f9-48e4-b057-a27a5b0cc3f9'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '26089f97-a968-4a6d-ac83-63ece5c6aa2f',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:26089f97-a968-4a6d-ac83-63ece5c6aa2f'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:e7b8c878-54f9-48e4-b057-a27a5b0cc3f9'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:26089f97-a968-4a6d-ac83-63ece5c6aa2f'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1988-12-18T06:52:44-05:00',
            start: '1988-12-18T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '5dfb8834-922d-4473-beb5-796309f9f7a1',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:5dfb8834-922d-4473-beb5-796309f9f7a1'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          reason: [
            {
              coding: [
                {
                  display: 'Viral sinusitis (disorder)',
                  code: '444814009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          period: {
            end: '1989-01-05T06:52:44-05:00',
            start: '1989-01-05T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for symptom',
              coding: [
                {
                  display: 'Encounter for symptom',
                  code: '185345009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'ambulatory'
          },
          status: 'finished',
          id: 'f1a2247d-65bb-4542-8e8e-3e1f994396dc',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:f1a2247d-65bb-4542-8e8e-3e1f994396dc'
      },
      {
        resource: {
          assertedDate: '1989-01-05T06:52:44-05:00',
          abatementDateTime: '1989-01-12T06:52:44-05:00',
          onsetDateTime: '1989-01-05T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:f1a2247d-65bb-4542-8e8e-3e1f994396dc'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Viral sinusitis (disorder)',
            coding: [
              {
                display: 'Viral sinusitis (disorder)',
                code: '444814009',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: 'confirmed',
          clinicalStatus: 'resolved',
          id: '12f30da7-7291-4898-b463-f1d1d05528d4',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:12f30da7-7291-4898-b463-f1d1d05528d4'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:f1a2247d-65bb-4542-8e8e-3e1f994396dc'
                }
              ],
              sequence: 1
            },
            {
              diagnosisLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:12f30da7-7291-4898-b463-f1d1d05528d4'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1989-01-05T06:52:44-05:00',
            start: '1989-01-05T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '090102a4-25eb-4fab-86a4-0c0160251883',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:090102a4-25eb-4fab-86a4-0c0160251883'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1989-06-18T07:52:44-04:00',
            start: '1989-06-18T07:52:44-04:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'f51b77c5-bfe4-4e6e-bb65-ae8618874609',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:f51b77c5-bfe4-4e6e-bb65-ae8618874609'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 90.7184766097972
          },
          issued: '1989-06-18T07:52:44.948-04:00',
          effectiveDateTime: '1989-06-18T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:f51b77c5-bfe4-4e6e-bb65-ae8618874609'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '16c45a2c-7357-4073-a25b-b5c074fa39f7',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:16c45a2c-7357-4073-a25b-b5c074fa39f7'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 16.7181035046006
          },
          issued: '1989-06-18T07:52:44.948-04:00',
          effectiveDateTime: '1989-06-18T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:f51b77c5-bfe4-4e6e-bb65-ae8618874609'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '985761a8-e257-4df8-9fc2-7a1542bada95',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:985761a8-e257-4df8-9fc2-7a1542bada95'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 20.3140030001136
          },
          issued: '1989-06-18T07:52:44.948-04:00',
          effectiveDateTime: '1989-06-18T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:f51b77c5-bfe4-4e6e-bb65-ae8618874609'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'd9bd2220-b6f3-4651-a7c2-4e518bed6511',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:d9bd2220-b6f3-4651-a7c2-4e518bed6511'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 71.8235946646769
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 106.526632721286
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1989-06-18T07:52:44.948-04:00',
          effectiveDateTime: '1989-06-18T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:f51b77c5-bfe4-4e6e-bb65-ae8618874609'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'f097f788-252b-459e-83ae-2f641b5d012f',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:f097f788-252b-459e-83ae-2f641b5d012f'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:f51b77c5-bfe4-4e6e-bb65-ae8618874609'
                }
              ],
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1989-06-18T07:52:44-04:00',
            start: '1989-06-18T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '7a842c99-4e94-41ee-96e2-5dfa1497c843',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:7a842c99-4e94-41ee-96e2-5dfa1497c843'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1989-12-17T06:52:44-05:00',
            start: '1989-12-17T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '42140e28-3ba9-4990-b8f7-5e23c11b3493',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:42140e28-3ba9-4990-b8f7-5e23c11b3493'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 93.7956031610456
          },
          issued: '1989-12-17T06:52:44.948-05:00',
          effectiveDateTime: '1989-12-17T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:42140e28-3ba9-4990-b8f7-5e23c11b3493'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '548c5ffe-b9d1-4cbb-b63f-d9e5da5f3675',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:548c5ffe-b9d1-4cbb-b63f-d9e5da5f3675'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 17.8908767206071
          },
          issued: '1989-12-17T06:52:44.948-05:00',
          effectiveDateTime: '1989-12-17T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:42140e28-3ba9-4990-b8f7-5e23c11b3493'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'bab74e29-d3f7-4312-905f-bc62cbf0b136',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:bab74e29-d3f7-4312-905f-bc62cbf0b136'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 20.3360528621981
          },
          issued: '1989-12-17T06:52:44.948-05:00',
          effectiveDateTime: '1989-12-17T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:42140e28-3ba9-4990-b8f7-5e23c11b3493'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'a7f00d54-52ad-4595-8428-e3405f6600bd',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:a7f00d54-52ad-4595-8428-e3405f6600bd'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 78.2595788132454
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 122.067804306026
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1989-12-17T06:52:44.948-05:00',
          effectiveDateTime: '1989-12-17T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:42140e28-3ba9-4990-b8f7-5e23c11b3493'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '29c592bf-45b1-4a6f-b49b-9fcb5cb64be1',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:29c592bf-45b1-4a6f-b49b-9fcb5cb64be1'
      },
      {
        resource: {
          performedDateTime: '1989-12-17T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:42140e28-3ba9-4990-b8f7-5e23c11b3493'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: '2cbb97e1-f1bf-469e-95e0-07d317ba7b79',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:2cbb97e1-f1bf-469e-95e0-07d317ba7b79'
      },
      {
        resource: {
          primarySource: true,
          date: '1989-12-17T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:42140e28-3ba9-4990-b8f7-5e23c11b3493'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'ef1f0591-591e-451b-ba97-0dbb00496502',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:ef1f0591-591e-451b-ba97-0dbb00496502'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 761
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:42140e28-3ba9-4990-b8f7-5e23c11b3493'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 3
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:2cbb97e1-f1bf-469e-95e0-07d317ba7b79'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:ef1f0591-591e-451b-ba97-0dbb00496502'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1989-12-17T06:52:44-05:00',
            start: '1989-12-17T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'ba987842-18dd-4e56-95ac-b30874863dfb',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:ba987842-18dd-4e56-95ac-b30874863dfb'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1990-12-23T06:52:44-05:00',
            start: '1990-12-23T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'caf82fdf-9f27-4c17-bf29-6768a0c02c13',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:caf82fdf-9f27-4c17-bf29-6768a0c02c13'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 100.071255733185
          },
          issued: '1990-12-23T06:52:44.948-05:00',
          effectiveDateTime: '1990-12-23T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:caf82fdf-9f27-4c17-bf29-6768a0c02c13'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '1d6b2556-0ce8-416f-a37f-964f621b7af3',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:1d6b2556-0ce8-416f-a37f-964f621b7af3'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 20.7324808589548
          },
          issued: '1990-12-23T06:52:44.948-05:00',
          effectiveDateTime: '1990-12-23T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:caf82fdf-9f27-4c17-bf29-6768a0c02c13'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'f6ee8b03-717f-4110-9b23-2462fb0e7312',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:f6ee8b03-717f-4110-9b23-2462fb0e7312'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 20.7029662464933
          },
          issued: '1990-12-23T06:52:44.948-05:00',
          effectiveDateTime: '1990-12-23T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:caf82fdf-9f27-4c17-bf29-6768a0c02c13'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '25b32d8f-dd14-4532-ae3a-18bdbf2c45a3',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:25b32d8f-dd14-4532-ae3a-18bdbf2c45a3'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 85.7191989379265
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 121.112508093867
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1990-12-23T06:52:44.948-05:00',
          effectiveDateTime: '1990-12-23T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:caf82fdf-9f27-4c17-bf29-6768a0c02c13'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '58e7dc7c-cbe5-4141-88ff-6601a4e728c0',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:58e7dc7c-cbe5-4141-88ff-6601a4e728c0'
      },
      {
        resource: {
          primarySource: true,
          date: '1990-12-23T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:caf82fdf-9f27-4c17-bf29-6768a0c02c13'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'varicella',
            coding: [
              {
                display: 'varicella',
                code: '21',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'ca23f03e-f6c0-4067-95c2-f734705bc4fd',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:ca23f03e-f6c0-4067-95c2-f734705bc4fd'
      },
      {
        resource: {
          primarySource: true,
          date: '1990-12-23T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:caf82fdf-9f27-4c17-bf29-6768a0c02c13'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'IPV',
            coding: [
              {
                display: 'IPV',
                code: '10',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '245c4b6c-bb83-4a28-888a-bcabaf56cd84',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:245c4b6c-bb83-4a28-888a-bcabaf56cd84'
      },
      {
        resource: {
          primarySource: true,
          date: '1990-12-23T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:caf82fdf-9f27-4c17-bf29-6768a0c02c13'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'be25301d-49b5-43f8-be97-f8e176a97a73',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:be25301d-49b5-43f8-be97-f8e176a97a73'
      },
      {
        resource: {
          primarySource: true,
          date: '1990-12-23T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:caf82fdf-9f27-4c17-bf29-6768a0c02c13'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'MMR',
            coding: [
              {
                display: 'MMR',
                code: '03',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '5463d26c-bfde-4ae0-8b9d-cfa77d1ee53c',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:5463d26c-bfde-4ae0-8b9d-cfa77d1ee53c'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 669
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:caf82fdf-9f27-4c17-bf29-6768a0c02c13'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                2
              ],
              sequence: 3
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                3
              ],
              sequence: 4
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                4
              ],
              sequence: 5
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:ca23f03e-f6c0-4067-95c2-f734705bc4fd'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            },
            {
              valueReference: {
                reference: 'urn:uuid:245c4b6c-bb83-4a28-888a-bcabaf56cd84'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 2
            },
            {
              valueReference: {
                reference: 'urn:uuid:be25301d-49b5-43f8-be97-f8e176a97a73'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 3
            },
            {
              valueReference: {
                reference: 'urn:uuid:5463d26c-bfde-4ae0-8b9d-cfa77d1ee53c'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 4
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1990-12-23T06:52:44-05:00',
            start: '1990-12-23T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'b5f563ef-da4f-4c8e-8568-a90cf8c2ed42',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:b5f563ef-da4f-4c8e-8568-a90cf8c2ed42'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1991-12-29T06:52:44-05:00',
            start: '1991-12-29T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '814cca2b-ef56-428a-9bb3-c4a4279a9415',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:814cca2b-ef56-428a-9bb3-c4a4279a9415'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 105.850132651132
          },
          issued: '1991-12-29T06:52:44.948-05:00',
          effectiveDateTime: '1991-12-29T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:814cca2b-ef56-428a-9bb3-c4a4279a9415'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '7b001cd8-ecf7-4571-97dc-51b81aa5b192',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:7b001cd8-ecf7-4571-97dc-51b81aa5b192'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 23.5662859191843
          },
          issued: '1991-12-29T06:52:44.948-05:00',
          effectiveDateTime: '1991-12-29T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:814cca2b-ef56-428a-9bb3-c4a4279a9415'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '9b14b7d0-daa1-4854-b399-56b0fe8d7116',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:9b14b7d0-daa1-4854-b399-56b0fe8d7116'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 21.0333442171428
          },
          issued: '1991-12-29T06:52:44.948-05:00',
          effectiveDateTime: '1991-12-29T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:814cca2b-ef56-428a-9bb3-c4a4279a9415'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '5a75b172-7ddf-4552-a589-752ee0e0cc35',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:5a75b172-7ddf-4552-a589-752ee0e0cc35'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 85.8461921003878
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 104.178080516395
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1991-12-29T06:52:44.948-05:00',
          effectiveDateTime: '1991-12-29T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:814cca2b-ef56-428a-9bb3-c4a4279a9415'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '3aaf48fe-f4d8-460f-9de7-3d2371d711df',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:3aaf48fe-f4d8-460f-9de7-3d2371d711df'
      },
      {
        resource: {
          performedDateTime: '1991-12-29T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:814cca2b-ef56-428a-9bb3-c4a4279a9415'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: 'bc2cd828-1882-4e6c-b0c4-2ffbc0b39365',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:bc2cd828-1882-4e6c-b0c4-2ffbc0b39365'
      },
      {
        resource: {
          primarySource: true,
          date: '1991-12-29T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:814cca2b-ef56-428a-9bb3-c4a4279a9415'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '5341b538-a6e3-4671-b85f-ce0acf460266',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:5341b538-a6e3-4671-b85f-ce0acf460266'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 761
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:814cca2b-ef56-428a-9bb3-c4a4279a9415'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 3
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:bc2cd828-1882-4e6c-b0c4-2ffbc0b39365'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:5341b538-a6e3-4671-b85f-ce0acf460266'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1991-12-29T06:52:44-05:00',
            start: '1991-12-29T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '18da7c4e-21ac-453c-986d-7b6e6c9f3077',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:18da7c4e-21ac-453c-986d-7b6e6c9f3077'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1993-01-03T06:52:44-05:00',
            start: '1993-01-03T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '8284ebc3-4c4b-4c96-a3f2-7d2f833e716c',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:8284ebc3-4c4b-4c96-a3f2-7d2f833e716c'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 111.704886045912
          },
          issued: '1993-01-03T06:52:44.948-05:00',
          effectiveDateTime: '1993-01-03T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:8284ebc3-4c4b-4c96-a3f2-7d2f833e716c'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '16c026b6-4a06-46f8-899b-e52b23cf82ac',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:16c026b6-4a06-46f8-899b-e52b23cf82ac'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 26.5634866318176
          },
          issued: '1993-01-03T06:52:44.948-05:00',
          effectiveDateTime: '1993-01-03T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:8284ebc3-4c4b-4c96-a3f2-7d2f833e716c'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '5ab8a269-85e0-4452-b220-15eb7570658d',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:5ab8a269-85e0-4452-b220-15eb7570658d'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 21.2882880858463
          },
          issued: '1993-01-03T06:52:44.948-05:00',
          effectiveDateTime: '1993-01-03T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:8284ebc3-4c4b-4c96-a3f2-7d2f833e716c'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'b41ba85e-b9c3-44ce-9e40-9d3a996bd110',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:b41ba85e-b9c3-44ce-9e40-9d3a996bd110'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 79.1777810180464
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 138.521587970089
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1993-01-03T06:52:44.948-05:00',
          effectiveDateTime: '1993-01-03T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:8284ebc3-4c4b-4c96-a3f2-7d2f833e716c'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'e9854f58-05a0-430f-a13e-e624dc0bd98b',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:e9854f58-05a0-430f-a13e-e624dc0bd98b'
      },
      {
        resource: {
          primarySource: true,
          date: '1993-01-03T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:8284ebc3-4c4b-4c96-a3f2-7d2f833e716c'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'f318306e-22ea-4bc8-8dc1-52410aaa010d',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:f318306e-22ea-4bc8-8dc1-52410aaa010d'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:8284ebc3-4c4b-4c96-a3f2-7d2f833e716c'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:f318306e-22ea-4bc8-8dc1-52410aaa010d'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1993-01-03T06:52:44-05:00',
            start: '1993-01-03T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'ebab7694-b4f7-41fc-8aba-9db5e2ef7ad7',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:ebab7694-b4f7-41fc-8aba-9db5e2ef7ad7'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          reason: [
            {
              coding: [
                {
                  display: 'Acute viral pharyngitis (disorder)',
                  code: '195662009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          period: {
            end: '1993-12-05T06:52:44-05:00',
            start: '1993-12-05T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for symptom',
              coding: [
                {
                  display: 'Encounter for symptom',
                  code: '185345009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'ambulatory'
          },
          status: 'finished',
          id: '25e6f855-6d60-4a62-9a5e-ab02fb23f728',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:25e6f855-6d60-4a62-9a5e-ab02fb23f728'
      },
      {
        resource: {
          assertedDate: '1993-12-05T06:52:44-05:00',
          abatementDateTime: '1993-12-16T06:52:44-05:00',
          onsetDateTime: '1993-12-05T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:25e6f855-6d60-4a62-9a5e-ab02fb23f728'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Acute viral pharyngitis (disorder)',
            coding: [
              {
                display: 'Acute viral pharyngitis (disorder)',
                code: '195662009',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: 'confirmed',
          clinicalStatus: 'resolved',
          id: '5cb8f8f7-8730-4348-a289-481345e64433',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:5cb8f8f7-8730-4348-a289-481345e64433'
      },
      {
        resource: {
          valueQuantity: {
            code: 'Cel',
            system: 'http://unitsofmeasure.org',
            unit: 'Cel',
            value: 37.9047633494859
          },
          issued: '1993-12-05T06:52:44.948-05:00',
          effectiveDateTime: '1993-12-05T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:25e6f855-6d60-4a62-9a5e-ab02fb23f728'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Oral temperature',
            coding: [
              {
                display: 'Oral temperature',
                code: '8331-1',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '783c7daf-051f-45ad-8686-2a9b905a1bdd',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:783c7daf-051f-45ad-8686-2a9b905a1bdd'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:25e6f855-6d60-4a62-9a5e-ab02fb23f728'
                }
              ],
              sequence: 1
            },
            {
              diagnosisLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:5cb8f8f7-8730-4348-a289-481345e64433'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1993-12-05T06:52:44-05:00',
            start: '1993-12-05T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '54de2439-8c6e-47d7-9ff5-477749912149',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:54de2439-8c6e-47d7-9ff5-477749912149'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1994-01-09T06:52:44-05:00',
            start: '1994-01-09T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '7b2acb70-8030-43be-824f-03bb6a33c1e5',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:7b2acb70-8030-43be-824f-03bb6a33c1e5'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 117.309023089718
          },
          issued: '1994-01-09T06:52:44.948-05:00',
          effectiveDateTime: '1994-01-09T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:7b2acb70-8030-43be-824f-03bb6a33c1e5'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'a0a7fe9b-9ea6-450b-877f-02610dadc976',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:a0a7fe9b-9ea6-450b-877f-02610dadc976'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 29.8528156760706
          },
          issued: '1994-01-09T06:52:44.948-05:00',
          effectiveDateTime: '1994-01-09T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:7b2acb70-8030-43be-824f-03bb6a33c1e5'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '6dff083d-77ff-415e-a53d-3aec2cc20969',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:6dff083d-77ff-415e-a53d-3aec2cc20969'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 21.6931422032412
          },
          issued: '1994-01-09T06:52:44.948-05:00',
          effectiveDateTime: '1994-01-09T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:7b2acb70-8030-43be-824f-03bb6a33c1e5'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '3ff124c1-93f5-467d-9577-5f545ed8ae97',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:3ff124c1-93f5-467d-9577-5f545ed8ae97'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 82.7257440627815
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 134.520782502286
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1994-01-09T06:52:44.948-05:00',
          effectiveDateTime: '1994-01-09T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:7b2acb70-8030-43be-824f-03bb6a33c1e5'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'f345d217-d7e0-458d-878c-227e13db5486',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:f345d217-d7e0-458d-878c-227e13db5486'
      },
      {
        resource: {
          primarySource: true,
          date: '1994-01-09T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:7b2acb70-8030-43be-824f-03bb6a33c1e5'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '89306198-83dc-48b0-a0d2-01faf2783f5e',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:89306198-83dc-48b0-a0d2-01faf2783f5e'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:7b2acb70-8030-43be-824f-03bb6a33c1e5'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:89306198-83dc-48b0-a0d2-01faf2783f5e'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1994-01-09T06:52:44-05:00',
            start: '1994-01-09T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '8e8ee354-bbe8-46cf-9efc-0b5292c07e7d',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:8e8ee354-bbe8-46cf-9efc-0b5292c07e7d'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1995-01-15T06:52:44-05:00',
            start: '1995-01-15T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '26730dbb-12e9-40e4-bad2-cb628d03b8fd',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:26730dbb-12e9-40e4-bad2-cb628d03b8fd'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 122.288717667344
          },
          issued: '1995-01-15T06:52:44.948-05:00',
          effectiveDateTime: '1995-01-15T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:26730dbb-12e9-40e4-bad2-cb628d03b8fd'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '012e9f7e-8370-4490-8fc2-80daf4fc08d6',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:012e9f7e-8370-4490-8fc2-80daf4fc08d6'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 33.6349955798031
          },
          issued: '1995-01-15T06:52:44.948-05:00',
          effectiveDateTime: '1995-01-15T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:26730dbb-12e9-40e4-bad2-cb628d03b8fd'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '2da6caa1-e898-4d1b-938c-5c2dde938d79',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:2da6caa1-e898-4d1b-938c-5c2dde938d79'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 22.491508944496
          },
          issued: '1995-01-15T06:52:44.948-05:00',
          effectiveDateTime: '1995-01-15T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:26730dbb-12e9-40e4-bad2-cb628d03b8fd'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '18a9dd7d-cb19-4295-9a2b-7992df781bda',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:18a9dd7d-cb19-4295-9a2b-7992df781bda'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 81.6517494994978
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 101.448578245735
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1995-01-15T06:52:44.948-05:00',
          effectiveDateTime: '1995-01-15T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:26730dbb-12e9-40e4-bad2-cb628d03b8fd'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '318e158f-3a59-4214-adc1-03526f4f2796',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:318e158f-3a59-4214-adc1-03526f4f2796'
      },
      {
        resource: {
          primarySource: true,
          date: '1995-01-15T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:26730dbb-12e9-40e4-bad2-cb628d03b8fd'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'aebe772c-04e6-4bd1-9728-9a9913b5b752',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:aebe772c-04e6-4bd1-9728-9a9913b5b752'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:26730dbb-12e9-40e4-bad2-cb628d03b8fd'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:aebe772c-04e6-4bd1-9728-9a9913b5b752'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1995-01-15T06:52:44-05:00',
            start: '1995-01-15T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '3b8405ae-a29d-4ffc-a7df-0fad1b043597',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:3b8405ae-a29d-4ffc-a7df-0fad1b043597'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          reason: [
            {
              coding: [
                {
                  display: 'Acute viral pharyngitis (disorder)',
                  code: '195662009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          period: {
            end: '1996-01-07T06:52:44-05:00',
            start: '1996-01-07T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for symptom',
              coding: [
                {
                  display: 'Encounter for symptom',
                  code: '185345009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'ambulatory'
          },
          status: 'finished',
          id: '911678b3-9d02-4f82-8bde-35a71e0a3e49',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:911678b3-9d02-4f82-8bde-35a71e0a3e49'
      },
      {
        resource: {
          assertedDate: '1996-01-07T06:52:44-05:00',
          abatementDateTime: '1996-01-16T06:52:44-05:00',
          onsetDateTime: '1996-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:911678b3-9d02-4f82-8bde-35a71e0a3e49'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Acute viral pharyngitis (disorder)',
            coding: [
              {
                display: 'Acute viral pharyngitis (disorder)',
                code: '195662009',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: 'confirmed',
          clinicalStatus: 'resolved',
          id: '10b8f480-b428-4560-91db-09c8885da842',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:10b8f480-b428-4560-91db-09c8885da842'
      },
      {
        resource: {
          valueQuantity: {
            code: 'Cel',
            system: 'http://unitsofmeasure.org',
            unit: 'Cel',
            value: 37.0732173240085
          },
          issued: '1996-01-07T06:52:44.948-05:00',
          effectiveDateTime: '1996-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:911678b3-9d02-4f82-8bde-35a71e0a3e49'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Oral temperature',
            coding: [
              {
                display: 'Oral temperature',
                code: '8331-1',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '3b3b7126-0772-4e63-b9b1-95acc413d2fb',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:3b3b7126-0772-4e63-b9b1-95acc413d2fb'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:911678b3-9d02-4f82-8bde-35a71e0a3e49'
                }
              ],
              sequence: 1
            },
            {
              diagnosisLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:10b8f480-b428-4560-91db-09c8885da842'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1996-01-07T06:52:44-05:00',
            start: '1996-01-07T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'b2cebfc1-5596-4ea0-8408-78cdda830c44',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:b2cebfc1-5596-4ea0-8408-78cdda830c44'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1996-01-21T06:52:44-05:00',
            start: '1996-01-21T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '2f023824-cf87-4fbe-ba84-9747b98cea83',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:2f023824-cf87-4fbe-ba84-9747b98cea83'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 126.955673815774
          },
          issued: '1996-01-21T06:52:44.948-05:00',
          effectiveDateTime: '1996-01-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:2f023824-cf87-4fbe-ba84-9747b98cea83'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'e74e740a-0933-4856-af8c-f5c5f889eb50',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:e74e740a-0933-4856-af8c-f5c5f889eb50'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 38.4630502305873
          },
          issued: '1996-01-21T06:52:44.948-05:00',
          effectiveDateTime: '1996-01-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:2f023824-cf87-4fbe-ba84-9747b98cea83'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '5c05dc69-00cd-4a6e-a5b5-45b7760b89aa',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:5c05dc69-00cd-4a6e-a5b5-45b7760b89aa'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 23.8637940550976
          },
          issued: '1996-01-21T06:52:44.948-05:00',
          effectiveDateTime: '1996-01-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:2f023824-cf87-4fbe-ba84-9747b98cea83'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '2ab39f4f-5dae-4663-9b96-808e56eb424c',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:2ab39f4f-5dae-4663-9b96-808e56eb424c'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 76.5174087568149
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 109.221105022672
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1996-01-21T06:52:44.948-05:00',
          effectiveDateTime: '1996-01-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:2f023824-cf87-4fbe-ba84-9747b98cea83'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'af792997-fbc6-4d3b-b353-b641220413c4',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:af792997-fbc6-4d3b-b353-b641220413c4'
      },
      {
        resource: {
          primarySource: true,
          date: '1996-01-21T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:2f023824-cf87-4fbe-ba84-9747b98cea83'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '43159a4d-aa3f-484c-a624-823819a4cb76',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:43159a4d-aa3f-484c-a624-823819a4cb76'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:2f023824-cf87-4fbe-ba84-9747b98cea83'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:43159a4d-aa3f-484c-a624-823819a4cb76'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1996-01-21T06:52:44-05:00',
            start: '1996-01-21T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '1844eb0c-025a-4e0c-ae20-0bd204e8ffbc',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:1844eb0c-025a-4e0c-ae20-0bd204e8ffbc'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          reason: [
            {
              coding: [
                {
                  display: 'Acute bacterial sinusitis (disorder)',
                  code: '75498004',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          period: {
            end: '1996-08-08T07:52:44-04:00',
            start: '1996-08-08T07:52:44-04:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for symptom',
              coding: [
                {
                  display: 'Encounter for symptom',
                  code: '185345009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'ambulatory'
          },
          status: 'finished',
          id: '2c0b10d8-91f5-4c68-8c55-fd68598ad335',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:2c0b10d8-91f5-4c68-8c55-fd68598ad335'
      },
      {
        resource: {
          assertedDate: '1996-08-08T07:52:44-04:00',
          abatementDateTime: '1996-08-22T07:52:44-04:00',
          onsetDateTime: '1996-08-08T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:2c0b10d8-91f5-4c68-8c55-fd68598ad335'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Acute bacterial sinusitis (disorder)',
            coding: [
              {
                display: 'Acute bacterial sinusitis (disorder)',
                code: '75498004',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: 'confirmed',
          clinicalStatus: 'resolved',
          id: '4d5e21ac-b418-4a51-bba2-e4c86c1d0ca5',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:4d5e21ac-b418-4a51-bba2-e4c86c1d0ca5'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:2c0b10d8-91f5-4c68-8c55-fd68598ad335'
                }
              ],
              sequence: 1
            },
            {
              diagnosisLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:4d5e21ac-b418-4a51-bba2-e4c86c1d0ca5'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1996-08-08T07:52:44-04:00',
            start: '1996-08-08T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '5f37c436-a1e6-46c5-a115-94274b6d0490',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:5f37c436-a1e6-46c5-a115-94274b6d0490'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1997-01-26T06:52:44-05:00',
            start: '1997-01-26T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '5194107f-7429-468b-885a-7603afc6c98e',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:5194107f-7429-468b-885a-7603afc6c98e'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 131.118203488619
          },
          issued: '1997-01-26T06:52:44.948-05:00',
          effectiveDateTime: '1997-01-26T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5194107f-7429-468b-885a-7603afc6c98e'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '1fba364e-5257-44cf-94db-7fbb4c91fc7a',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:1fba364e-5257-44cf-94db-7fbb4c91fc7a'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 43.6279786443562
          },
          issued: '1997-01-26T06:52:44.948-05:00',
          effectiveDateTime: '1997-01-26T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5194107f-7429-468b-885a-7603afc6c98e'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '019d787c-38d7-4d35-876d-5320535ad7cd',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:019d787c-38d7-4d35-876d-5320535ad7cd'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 25.3769317468296
          },
          issued: '1997-01-26T06:52:44.948-05:00',
          effectiveDateTime: '1997-01-26T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5194107f-7429-468b-885a-7603afc6c98e'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '34b9f3de-9e5f-4811-9178-ee5da51c8bab',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:34b9f3de-9e5f-4811-9178-ee5da51c8bab'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 78.1185321886438
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 102.744226856975
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1997-01-26T06:52:44.948-05:00',
          effectiveDateTime: '1997-01-26T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5194107f-7429-468b-885a-7603afc6c98e'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '0f05be4a-18d2-41e0-89f8-583be96bd767',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:0f05be4a-18d2-41e0-89f8-583be96bd767'
      },
      {
        resource: {
          primarySource: true,
          date: '1997-01-26T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:5194107f-7429-468b-885a-7603afc6c98e'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '399a8876-7f6f-43c5-bd23-5bd93cb5594c',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:399a8876-7f6f-43c5-bd23-5bd93cb5594c'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:5194107f-7429-468b-885a-7603afc6c98e'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:399a8876-7f6f-43c5-bd23-5bd93cb5594c'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1997-01-26T06:52:44-05:00',
            start: '1997-01-26T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'c9db0c9f-523e-47e0-bad2-4be6466c7dcf',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:c9db0c9f-523e-47e0-bad2-4be6466c7dcf'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1998-02-01T06:52:44-05:00',
            start: '1998-02-01T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '10d438c7-9360-4d54-ae70-3b706aaed426',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:10d438c7-9360-4d54-ae70-3b706aaed426'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 135.98372095505
          },
          issued: '1998-02-01T06:52:44.948-05:00',
          effectiveDateTime: '1998-02-01T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:10d438c7-9360-4d54-ae70-3b706aaed426'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '2e7482f3-e44a-4065-8317-4b615781dce2',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:2e7482f3-e44a-4065-8317-4b615781dce2'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 49.3693431583374
          },
          issued: '1998-02-01T06:52:44.948-05:00',
          effectiveDateTime: '1998-02-01T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:10d438c7-9360-4d54-ae70-3b706aaed426'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'f674fe83-c9f2-4c1b-80c8-b4ae32964a05',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:f674fe83-c9f2-4c1b-80c8-b4ae32964a05'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 26.6982937872641
          },
          issued: '1998-02-01T06:52:44.948-05:00',
          effectiveDateTime: '1998-02-01T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:10d438c7-9360-4d54-ae70-3b706aaed426'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '932dd9ef-c054-4b60-aabc-8dd6c554923d',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:932dd9ef-c054-4b60-aabc-8dd6c554923d'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 72.7563711445188
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 120.991362909726
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1998-02-01T06:52:44.948-05:00',
          effectiveDateTime: '1998-02-01T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:10d438c7-9360-4d54-ae70-3b706aaed426'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '74fac8c2-c904-44bf-8c95-53590daad25d',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:74fac8c2-c904-44bf-8c95-53590daad25d'
      },
      {
        resource: {
          performedDateTime: '1998-02-01T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:10d438c7-9360-4d54-ae70-3b706aaed426'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: '74162819-075a-4f00-846e-267065006cf0',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:74162819-075a-4f00-846e-267065006cf0'
      },
      {
        resource: {
          primarySource: true,
          date: '1998-02-01T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:10d438c7-9360-4d54-ae70-3b706aaed426'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '8d2cf05a-7592-4509-b027-989c4954d3db',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:8d2cf05a-7592-4509-b027-989c4954d3db'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 761
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:10d438c7-9360-4d54-ae70-3b706aaed426'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 3
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:74162819-075a-4f00-846e-267065006cf0'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:8d2cf05a-7592-4509-b027-989c4954d3db'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1998-02-01T06:52:44-05:00',
            start: '1998-02-01T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '2308a5c6-8bad-4257-9bfd-589dc44e91e5',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:2308a5c6-8bad-4257-9bfd-589dc44e91e5'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          reason: [
            {
              coding: [
                {
                  display: 'Acute bronchitis (disorder)',
                  code: '10509002',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          period: {
            end: '1998-11-06T06:52:44-05:00',
            start: '1998-11-06T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for symptom',
              coding: [
                {
                  display: 'Encounter for symptom',
                  code: '185345009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'ambulatory'
          },
          status: 'finished',
          id: 'f852ee6e-ba34-428c-b55b-496949f84d7c',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:f852ee6e-ba34-428c-b55b-496949f84d7c'
      },
      {
        resource: {
          assertedDate: '1998-11-06T06:52:44-05:00',
          abatementDateTime: '1998-11-13T06:52:44-05:00',
          onsetDateTime: '1998-11-06T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:f852ee6e-ba34-428c-b55b-496949f84d7c'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Acute bronchitis (disorder)',
            coding: [
              {
                display: 'Acute bronchitis (disorder)',
                code: '10509002',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: 'confirmed',
          clinicalStatus: 'resolved',
          id: '357bc3fa-93b6-4661-9d45-965756a4d936',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:357bc3fa-93b6-4661-9d45-965756a4d936'
      },
      {
        resource: {
          reasonReference: [
            {
              reference: 'urn:uuid:357bc3fa-93b6-4661-9d45-965756a4d936'
            }
          ],
          authoredOn: '1998-11-06T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:f852ee6e-ba34-428c-b55b-496949f84d7c'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          medicationCodeableConcept: {
            text: 'Acetaminophen 160 MG',
            coding: [
              {
                display: 'Acetaminophen 160 MG',
                code: '608680',
                system: 'http://www.nlm.nih.gov/research/umls/rxnorm'
              }
            ]
          },
          intent: 'order',
          status: 'stopped',
          id: '30f5e743-5260-4a7b-9a24-7198797e4696',
          resourceType: 'MedicationRequest'
        },
        fullUrl: 'urn:uuid:30f5e743-5260-4a7b-9a24-7198797e4696'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 255
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:f852ee6e-ba34-428c-b55b-496949f84d7c'
                }
              ],
              sequence: 1
            }
          ],
          prescription: {
            reference: 'urn:uuid:30f5e743-5260-4a7b-9a24-7198797e4696'
          },
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1998-11-06T06:52:44-05:00',
            start: '1998-11-06T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '945a47ca-f077-4845-8e90-0df848669575',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:945a47ca-f077-4845-8e90-0df848669575'
      },
      {
        resource: {
          activity: [
            {
              detail: {
                status: 'completed',
                code: {
                  text: 'Recommendation to avoid exercise',
                  coding: [
                    {
                      display: 'Recommendation to avoid exercise',
                      code: '304510005',
                      system: 'http://snomed.info/sct'
                    }
                  ]
                }
              }
            },
            {
              detail: {
                status: 'completed',
                code: {
                  text: 'Deep breathing and coughing exercises',
                  coding: [
                    {
                      display: 'Deep breathing and coughing exercises',
                      code: '371605008',
                      system: 'http://snomed.info/sct'
                    }
                  ]
                }
              }
            }
          ],
          addresses: [
            {
              reference: 'urn:uuid:357bc3fa-93b6-4661-9d45-965756a4d936'
            }
          ],
          period: {
            end: '1998-11-13T06:52:44-05:00',
            start: '1998-11-06T06:52:44-05:00'
          },
          context: {
            reference: 'urn:uuid:f852ee6e-ba34-428c-b55b-496949f84d7c'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          category: [
            {
              text: 'Respiratory therapy',
              coding: [
                {
                  display: 'Respiratory therapy',
                  code: '53950000',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          intent: 'order',
          status: 'completed',
          id: 'a8e04ffc-6281-4087-9b37-70714b5b2938',
          resourceType: 'CarePlan'
        },
        fullUrl: 'urn:uuid:a8e04ffc-6281-4087-9b37-70714b5b2938'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:f852ee6e-ba34-428c-b55b-496949f84d7c'
                }
              ],
              sequence: 1
            },
            {
              diagnosisLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:357bc3fa-93b6-4661-9d45-965756a4d936'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1998-11-06T06:52:44-05:00',
            start: '1998-11-06T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '038ac9fb-db6c-4a50-8d16-d50d0a2f8ec9',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:038ac9fb-db6c-4a50-8d16-d50d0a2f8ec9'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1998-11-15T06:52:44-05:00',
            start: '1998-11-15T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'eb0461f1-a648-450a-8167-d8097e483f9e',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:eb0461f1-a648-450a-8167-d8097e483f9e'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 140.450622666347
          },
          issued: '1998-11-15T06:52:44.948-05:00',
          effectiveDateTime: '1998-11-15T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:eb0461f1-a648-450a-8167-d8097e483f9e'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '0c7d01d3-05a0-41c5-87e3-78ce00ad95c9',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:0c7d01d3-05a0-41c5-87e3-78ce00ad95c9'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 53.9217830749228
          },
          issued: '1998-11-15T06:52:44.948-05:00',
          effectiveDateTime: '1998-11-15T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:eb0461f1-a648-450a-8167-d8097e483f9e'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'a54bc4be-f90f-44e3-a63a-32ed6e18e6c6',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:a54bc4be-f90f-44e3-a63a-32ed6e18e6c6'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 27.3348633463697
          },
          issued: '1998-11-15T06:52:44.948-05:00',
          effectiveDateTime: '1998-11-15T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:eb0461f1-a648-450a-8167-d8097e483f9e'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '3756438f-cd54-4875-a2d2-3b12899d9f5d',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:3756438f-cd54-4875-a2d2-3b12899d9f5d'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 88.5627855009134
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 131.871526031529
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1998-11-15T06:52:44.948-05:00',
          effectiveDateTime: '1998-11-15T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:eb0461f1-a648-450a-8167-d8097e483f9e'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '2c3c2be2-1507-476b-9e52-150496463db4',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:2c3c2be2-1507-476b-9e52-150496463db4'
      },
      {
        resource: {
          performedDateTime: '1998-11-15T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:eb0461f1-a648-450a-8167-d8097e483f9e'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: '390bfdaa-51ed-4e7d-965b-c7f827ee5f33',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:390bfdaa-51ed-4e7d-965b-c7f827ee5f33'
      },
      {
        resource: {
          primarySource: true,
          date: '1998-11-15T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:eb0461f1-a648-450a-8167-d8097e483f9e'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'fe5eff5a-2b18-4257-bc97-d04d57bee7ca',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:fe5eff5a-2b18-4257-bc97-d04d57bee7ca'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 761
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:eb0461f1-a648-450a-8167-d8097e483f9e'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 3
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:390bfdaa-51ed-4e7d-965b-c7f827ee5f33'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:fe5eff5a-2b18-4257-bc97-d04d57bee7ca'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1998-11-15T06:52:44-05:00',
            start: '1998-11-15T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '494fc71f-abaa-4843-a3b4-8fa16af50dd5',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:494fc71f-abaa-4843-a3b4-8fa16af50dd5'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '1999-11-21T06:52:44-05:00',
            start: '1999-11-21T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '3dccc8e0-49a3-4e86-a9fa-1a939774eb63',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:3dccc8e0-49a3-4e86-a9fa-1a939774eb63'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 147.788049466494
          },
          issued: '1999-11-21T06:52:44.948-05:00',
          effectiveDateTime: '1999-11-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:3dccc8e0-49a3-4e86-a9fa-1a939774eb63'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'f4427c2b-b2d3-4755-bbf0-bf54fdcb80fe',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:f4427c2b-b2d3-4755-bbf0-bf54fdcb80fe'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 60.5683606337574
          },
          issued: '1999-11-21T06:52:44.948-05:00',
          effectiveDateTime: '1999-11-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:3dccc8e0-49a3-4e86-a9fa-1a939774eb63'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'f7b70fcb-3baf-4f20-9ada-5ce1a3ef8ab0',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:f7b70fcb-3baf-4f20-9ada-5ce1a3ef8ab0'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 27.7311055911822
          },
          issued: '1999-11-21T06:52:44.948-05:00',
          effectiveDateTime: '1999-11-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:3dccc8e0-49a3-4e86-a9fa-1a939774eb63'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'f7cf61e0-143a-405a-a5a0-8b56219fab53',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:f7cf61e0-143a-405a-a5a0-8b56219fab53'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 78.1463538792216
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 118.263099116296
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '1999-11-21T06:52:44.948-05:00',
          effectiveDateTime: '1999-11-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:3dccc8e0-49a3-4e86-a9fa-1a939774eb63'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '62601917-647e-437a-b24a-be9e89f63af9',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:62601917-647e-437a-b24a-be9e89f63af9'
      },
      {
        resource: {
          performedDateTime: '1999-11-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:3dccc8e0-49a3-4e86-a9fa-1a939774eb63'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: 'd177f625-c449-4571-88a9-02d8d452a00a',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:d177f625-c449-4571-88a9-02d8d452a00a'
      },
      {
        resource: {
          primarySource: true,
          date: '1999-11-21T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:3dccc8e0-49a3-4e86-a9fa-1a939774eb63'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'ea781a99-f220-4572-9e6c-6497b866fd53',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:ea781a99-f220-4572-9e6c-6497b866fd53'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 761
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:3dccc8e0-49a3-4e86-a9fa-1a939774eb63'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 3
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:d177f625-c449-4571-88a9-02d8d452a00a'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:ea781a99-f220-4572-9e6c-6497b866fd53'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '1999-11-21T06:52:44-05:00',
            start: '1999-11-21T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'b6f722e0-d449-4116-82d8-97ecf441f32b',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:b6f722e0-d449-4116-82d8-97ecf441f32b'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '2000-11-26T06:52:44-05:00',
            start: '2000-11-26T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'd2ce173b-980e-4603-9383-5c4cafcb5578',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:d2ce173b-980e-4603-9383-5c4cafcb5578'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 154.104381483901
          },
          issued: '2000-11-26T06:52:44.948-05:00',
          effectiveDateTime: '2000-11-26T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:d2ce173b-980e-4603-9383-5c4cafcb5578'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '5735c012-a436-446e-aaff-61f2d6263f4f',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:5735c012-a436-446e-aaff-61f2d6263f4f'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 66.3894048310975
          },
          issued: '2000-11-26T06:52:44.948-05:00',
          effectiveDateTime: '2000-11-26T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:d2ce173b-980e-4603-9383-5c4cafcb5578'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '0489649c-80b0-4c29-b3bb-c255e12cbf19',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:0489649c-80b0-4c29-b3bb-c255e12cbf19'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 27.9555989742956
          },
          issued: '2000-11-26T06:52:44.948-05:00',
          effectiveDateTime: '2000-11-26T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:d2ce173b-980e-4603-9383-5c4cafcb5578'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '18c5ef96-b061-446f-8e72-03e10119e0da',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:18c5ef96-b061-446f-8e72-03e10119e0da'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 86.7661267888884
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 132.999041243826
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '2000-11-26T06:52:44.948-05:00',
          effectiveDateTime: '2000-11-26T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:d2ce173b-980e-4603-9383-5c4cafcb5578'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '8b11e314-36cb-4e22-928f-3d7b161ac77d',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:8b11e314-36cb-4e22-928f-3d7b161ac77d'
      },
      {
        resource: {
          primarySource: true,
          date: '2000-11-26T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:d2ce173b-980e-4603-9383-5c4cafcb5578'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'e51cef4a-4e40-404e-a551-4e2b53458382',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:e51cef4a-4e40-404e-a551-4e2b53458382'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:d2ce173b-980e-4603-9383-5c4cafcb5578'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:e51cef4a-4e40-404e-a551-4e2b53458382'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2000-11-26T06:52:44-05:00',
            start: '2000-11-26T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '16a91f29-20cd-4982-9fb7-06e2394229fc',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:16a91f29-20cd-4982-9fb7-06e2394229fc'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '2001-12-02T06:52:44-05:00',
            start: '2001-12-02T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '8d7c4090-e8fb-4aa6-b373-38f87a7bae1d',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:8d7c4090-e8fb-4aa6-b373-38f87a7bae1d'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 158.657238113008
          },
          issued: '2001-12-02T06:52:44.948-05:00',
          effectiveDateTime: '2001-12-02T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:8d7c4090-e8fb-4aa6-b373-38f87a7bae1d'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '8bf23bb6-b520-4640-a6e7-288d33ba335a',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:8bf23bb6-b520-4640-a6e7-288d33ba335a'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 71.4915381746397
          },
          issued: '2001-12-02T06:52:44.948-05:00',
          effectiveDateTime: '2001-12-02T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:8d7c4090-e8fb-4aa6-b373-38f87a7bae1d'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '4239778f-06cb-488e-bac1-7445a1f1e901',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:4239778f-06cb-488e-bac1-7445a1f1e901'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 28.4010804138412
          },
          issued: '2001-12-02T06:52:44.948-05:00',
          effectiveDateTime: '2001-12-02T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:8d7c4090-e8fb-4aa6-b373-38f87a7bae1d'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '3a562b9b-1435-4190-a0dc-249d1a773375',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:3a562b9b-1435-4190-a0dc-249d1a773375'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 73.6893138281962
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 115.829700523519
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '2001-12-02T06:52:44.948-05:00',
          effectiveDateTime: '2001-12-02T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:8d7c4090-e8fb-4aa6-b373-38f87a7bae1d'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '79812f3d-c6b0-4910-a73f-54ac6c643c25',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:79812f3d-c6b0-4910-a73f-54ac6c643c25'
      },
      {
        resource: {
          primarySource: true,
          date: '2001-12-02T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:8d7c4090-e8fb-4aa6-b373-38f87a7bae1d'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '0cf27cdb-296d-4e00-98a9-f01f8ed1be7a',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:0cf27cdb-296d-4e00-98a9-f01f8ed1be7a'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:8d7c4090-e8fb-4aa6-b373-38f87a7bae1d'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:0cf27cdb-296d-4e00-98a9-f01f8ed1be7a'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2001-12-02T06:52:44-05:00',
            start: '2001-12-02T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '21b76904-d3cd-49d6-969d-2ffc7b59f688',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:21b76904-d3cd-49d6-969d-2ffc7b59f688'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '2002-12-08T06:52:44-05:00',
            start: '2002-12-08T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'deccc6ae-73ba-4f13-b320-441bcfd38592',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:deccc6ae-73ba-4f13-b320-441bcfd38592'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 161.324317581012
          },
          issued: '2002-12-08T06:52:44.948-05:00',
          effectiveDateTime: '2002-12-08T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:deccc6ae-73ba-4f13-b320-441bcfd38592'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'ca718e0f-0e00-4623-a526-f4e1c8bdb549',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:ca718e0f-0e00-4623-a526-f4e1c8bdb549'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 75.5764991336913
          },
          issued: '2002-12-08T06:52:44.948-05:00',
          effectiveDateTime: '2002-12-08T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:deccc6ae-73ba-4f13-b320-441bcfd38592'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '2e5ed184-ccd8-475a-ab6e-050df8a262f7',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:2e5ed184-ccd8-475a-ab6e-050df8a262f7'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 29.0393637814968
          },
          issued: '2002-12-08T06:52:44.948-05:00',
          effectiveDateTime: '2002-12-08T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:deccc6ae-73ba-4f13-b320-441bcfd38592'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'a9a5e23b-8b45-4931-8180-17aabe23d80a',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:a9a5e23b-8b45-4931-8180-17aabe23d80a'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 72.4548309694971
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 129.673510659669
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '2002-12-08T06:52:44.948-05:00',
          effectiveDateTime: '2002-12-08T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:deccc6ae-73ba-4f13-b320-441bcfd38592'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '1a02417b-b4c1-4cd0-9676-937712f28e83',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:1a02417b-b4c1-4cd0-9676-937712f28e83'
      },
      {
        resource: {
          primarySource: true,
          date: '2002-12-08T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:deccc6ae-73ba-4f13-b320-441bcfd38592'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'cb27caa6-c5c6-4491-9cd4-e6c6ee4de79d',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:cb27caa6-c5c6-4491-9cd4-e6c6ee4de79d'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:deccc6ae-73ba-4f13-b320-441bcfd38592'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:cb27caa6-c5c6-4491-9cd4-e6c6ee4de79d'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2002-12-08T06:52:44-05:00',
            start: '2002-12-08T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '9795753d-f368-4285-a8e3-dda9a5bca7c9',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:9795753d-f368-4285-a8e3-dda9a5bca7c9'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '2003-12-14T06:52:44-05:00',
            start: '2003-12-14T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '3e293581-18de-4a40-aefc-d38309192831',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:3e293581-18de-4a40-aefc-d38309192831'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 162.692124990726
          },
          issued: '2003-12-14T06:52:44.948-05:00',
          effectiveDateTime: '2003-12-14T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:3e293581-18de-4a40-aefc-d38309192831'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '0ad0e04a-9627-466a-8bf8-9612b40bf824',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:0ad0e04a-9627-466a-8bf8-9612b40bf824'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 78.5785185183692
          },
          issued: '2003-12-14T06:52:44.948-05:00',
          effectiveDateTime: '2003-12-14T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:3e293581-18de-4a40-aefc-d38309192831'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'e47721b1-70df-41c7-a446-e4448a24153a',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:e47721b1-70df-41c7-a446-e4448a24153a'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 29.6873049214163
          },
          issued: '2003-12-14T06:52:44.948-05:00',
          effectiveDateTime: '2003-12-14T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:3e293581-18de-4a40-aefc-d38309192831'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'dd6a5347-cf51-44b7-b157-e7d217ab0378',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:dd6a5347-cf51-44b7-b157-e7d217ab0378'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 81.8722184234594
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 126.993672311841
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '2003-12-14T06:52:44.948-05:00',
          effectiveDateTime: '2003-12-14T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:3e293581-18de-4a40-aefc-d38309192831'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '11b8b3b9-ebfb-425b-8a8a-fda324cc0a7e',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:11b8b3b9-ebfb-425b-8a8a-fda324cc0a7e'
      },
      {
        resource: {
          primarySource: true,
          date: '2003-12-14T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:3e293581-18de-4a40-aefc-d38309192831'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '185e51c6-0fa1-4c54-89e8-5db6c6f304cf',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:185e51c6-0fa1-4c54-89e8-5db6c6f304cf'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:3e293581-18de-4a40-aefc-d38309192831'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:185e51c6-0fa1-4c54-89e8-5db6c6f304cf'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2003-12-14T06:52:44-05:00',
            start: '2003-12-14T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '6a5f4ee2-84b9-42e7-be19-508c2b9e70bc',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:6a5f4ee2-84b9-42e7-be19-508c2b9e70bc'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '2004-12-19T06:52:44-05:00',
            start: '2004-12-19T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'e090a78c-9090-4c0d-ba99-c3176e103e88',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:e090a78c-9090-4c0d-ba99-c3176e103e88'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 163.377689097921
          },
          issued: '2004-12-19T06:52:44.948-05:00',
          effectiveDateTime: '2004-12-19T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:e090a78c-9090-4c0d-ba99-c3176e103e88'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '0cacef58-d7aa-41cb-b201-73fca9337cd0',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:0cacef58-d7aa-41cb-b201-73fca9337cd0'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 80.8681834941455
          },
          issued: '2004-12-19T06:52:44.948-05:00',
          effectiveDateTime: '2004-12-19T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:e090a78c-9090-4c0d-ba99-c3176e103e88'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'c00a415e-34e4-456f-b102-3d9c024fc387',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:c00a415e-34e4-456f-b102-3d9c024fc387'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 30.2964812022798
          },
          issued: '2004-12-19T06:52:44.948-05:00',
          effectiveDateTime: '2004-12-19T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:e090a78c-9090-4c0d-ba99-c3176e103e88'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '72317e05-d094-4b19-9619-6c66088cd0ce',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:72317e05-d094-4b19-9619-6c66088cd0ce'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 70.4421751823295
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 108.21834327121
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '2004-12-19T06:52:44.948-05:00',
          effectiveDateTime: '2004-12-19T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:e090a78c-9090-4c0d-ba99-c3176e103e88'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '2ae3c857-2e9c-4258-87fe-bcdc7d1ebc21',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:2ae3c857-2e9c-4258-87fe-bcdc7d1ebc21'
      },
      {
        resource: {
          performedDateTime: '2004-12-19T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:e090a78c-9090-4c0d-ba99-c3176e103e88'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: '93fef100-d19e-49c0-8c32-006681f082b4',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:93fef100-d19e-49c0-8c32-006681f082b4'
      },
      {
        resource: {
          primarySource: true,
          date: '2004-12-19T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:e090a78c-9090-4c0d-ba99-c3176e103e88'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '841b4261-d740-452a-a867-cea9b7978c98',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:841b4261-d740-452a-a867-cea9b7978c98'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 761
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:e090a78c-9090-4c0d-ba99-c3176e103e88'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 3
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:93fef100-d19e-49c0-8c32-006681f082b4'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:841b4261-d740-452a-a867-cea9b7978c98'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2004-12-19T06:52:44-05:00',
            start: '2004-12-19T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'd97e0732-9216-4731-bee4-5cf74cfb911e',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:d97e0732-9216-4731-bee4-5cf74cfb911e'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '2005-12-25T06:52:44-05:00',
            start: '2005-12-25T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: 'c917c69f-ca60-4f9b-82ce-e5003e804e10',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:c917c69f-ca60-4f9b-82ce-e5003e804e10'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 163.655450450609
          },
          issued: '2005-12-25T06:52:44.948-05:00',
          effectiveDateTime: '2005-12-25T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:c917c69f-ca60-4f9b-82ce-e5003e804e10'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '9dc493ee-e92f-4b7d-b549-039e5f52b046',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:9dc493ee-e92f-4b7d-b549-039e5f52b046'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 82.5918593745643
          },
          issued: '2005-12-25T06:52:44.948-05:00',
          effectiveDateTime: '2005-12-25T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:c917c69f-ca60-4f9b-82ce-e5003e804e10'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '3695a3bf-a357-4661-a4b8-767fd1438ed8',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:3695a3bf-a357-4661-a4b8-767fd1438ed8'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 30.8372964469802
          },
          issued: '2005-12-25T06:52:44.948-05:00',
          effectiveDateTime: '2005-12-25T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:c917c69f-ca60-4f9b-82ce-e5003e804e10'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '95143cae-2e67-499a-8f86-02133b648a2e',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:95143cae-2e67-499a-8f86-02133b648a2e'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 72.6697914649784
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 110.823544576828
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '2005-12-25T06:52:44.948-05:00',
          effectiveDateTime: '2005-12-25T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:c917c69f-ca60-4f9b-82ce-e5003e804e10'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'f2966e7b-2272-410b-ad2a-61af1a54ab07',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:f2966e7b-2272-410b-ad2a-61af1a54ab07'
      },
      {
        resource: {
          performedDateTime: '2005-12-25T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:c917c69f-ca60-4f9b-82ce-e5003e804e10'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: '3af4cb4d-298a-4849-a53a-8a1cc2055cbf',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:3af4cb4d-298a-4849-a53a-8a1cc2055cbf'
      },
      {
        resource: {
          primarySource: true,
          date: '2005-12-25T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:c917c69f-ca60-4f9b-82ce-e5003e804e10'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '2061678e-23fc-4db4-a206-d0d89a4d2c10',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:2061678e-23fc-4db4-a206-d0d89a4d2c10'
      },
      {
        resource: {
          primarySource: true,
          date: '2005-12-25T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:c917c69f-ca60-4f9b-82ce-e5003e804e10'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'meningococcal MCV4P',
            coding: [
              {
                display: 'meningococcal MCV4P',
                code: '114',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '248f8e50-7cce-4480-b8ef-12408b1502f1',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:248f8e50-7cce-4480-b8ef-12408b1502f1'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 897
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:c917c69f-ca60-4f9b-82ce-e5003e804e10'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                2
              ],
              sequence: 3
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 4
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:3af4cb4d-298a-4849-a53a-8a1cc2055cbf'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:2061678e-23fc-4db4-a206-d0d89a4d2c10'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            },
            {
              valueReference: {
                reference: 'urn:uuid:248f8e50-7cce-4480-b8ef-12408b1502f1'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 2
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2005-12-25T06:52:44-05:00',
            start: '2005-12-25T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '7992afde-3bb7-41f2-b747-72155218589c',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:7992afde-3bb7-41f2-b747-72155218589c'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          reason: [
            {
              coding: [
                {
                  display: 'Acute bronchitis (disorder)',
                  code: '10509002',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          period: {
            end: '2006-04-06T07:52:44-04:00',
            start: '2006-04-06T07:52:44-04:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for symptom',
              coding: [
                {
                  display: 'Encounter for symptom',
                  code: '185345009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'ambulatory'
          },
          status: 'finished',
          id: '3b0f8006-48b0-41ec-afea-9f3e9ebd67a3',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:3b0f8006-48b0-41ec-afea-9f3e9ebd67a3'
      },
      {
        resource: {
          assertedDate: '2006-04-06T07:52:44-04:00',
          abatementDateTime: '2006-04-20T07:52:44-04:00',
          onsetDateTime: '2006-04-06T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:3b0f8006-48b0-41ec-afea-9f3e9ebd67a3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Acute bronchitis (disorder)',
            coding: [
              {
                display: 'Acute bronchitis (disorder)',
                code: '10509002',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: 'confirmed',
          clinicalStatus: 'resolved',
          id: '990968b1-2d8c-4410-a1c8-5abdf3b9ce8f',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:990968b1-2d8c-4410-a1c8-5abdf3b9ce8f'
      },
      {
        resource: {
          reasonReference: [
            {
              display: 'Acute bronchitis (disorder)',
              reference: 'urn:uuid:357bc3fa-93b6-4661-9d45-965756a4d936'
            },
            {
              display: 'Acute bronchitis (disorder)',
              reference: 'urn:uuid:990968b1-2d8c-4410-a1c8-5abdf3b9ce8f'
            }
          ],
          performedPeriod: {
            end: '2006-04-06T08:10:44-04:00',
            start: '2006-04-06T07:52:44-04:00'
          },
          context: {
            reference: 'urn:uuid:3b0f8006-48b0-41ec-afea-9f3e9ebd67a3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Measurement of respiratory function (procedure)',
            coding: [
              {
                display: 'Measurement of respiratory function (procedure)',
                code: '23426006',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: '050c22d0-2862-47b4-85af-094ff0c170b8',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:050c22d0-2862-47b4-85af-094ff0c170b8'
      },
      {
        resource: {
          reasonReference: [
            {
              reference: 'urn:uuid:357bc3fa-93b6-4661-9d45-965756a4d936'
            },
            {
              reference: 'urn:uuid:990968b1-2d8c-4410-a1c8-5abdf3b9ce8f'
            }
          ],
          authoredOn: '2006-04-06T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:3b0f8006-48b0-41ec-afea-9f3e9ebd67a3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          medicationCodeableConcept: {
            text: 'Dextromethorphan Hydrobromide 1 MG/ML',
            coding: [
              {
                display: 'Dextromethorphan Hydrobromide 1 MG/ML',
                code: '1020137',
                system: 'http://www.nlm.nih.gov/research/umls/rxnorm'
              }
            ]
          },
          intent: 'order',
          status: 'stopped',
          id: 'c2aab3e4-f789-454c-9d81-03f50a567ed7',
          resourceType: 'MedicationRequest'
        },
        fullUrl: 'urn:uuid:c2aab3e4-f789-454c-9d81-03f50a567ed7'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 255
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:3b0f8006-48b0-41ec-afea-9f3e9ebd67a3'
                }
              ],
              sequence: 1
            }
          ],
          prescription: {
            reference: 'urn:uuid:c2aab3e4-f789-454c-9d81-03f50a567ed7'
          },
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2006-04-06T07:52:44-04:00',
            start: '2006-04-06T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '3e63d4ff-f1be-4f0f-83ea-a62c02031e23',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:3e63d4ff-f1be-4f0f-83ea-a62c02031e23'
      },
      {
        resource: {
          activity: [
            {
              detail: {
                status: 'completed',
                code: {
                  text: 'Recommendation to avoid exercise',
                  coding: [
                    {
                      display: 'Recommendation to avoid exercise',
                      code: '304510005',
                      system: 'http://snomed.info/sct'
                    }
                  ]
                }
              }
            },
            {
              detail: {
                status: 'completed',
                code: {
                  text: 'Deep breathing and coughing exercises',
                  coding: [
                    {
                      display: 'Deep breathing and coughing exercises',
                      code: '371605008',
                      system: 'http://snomed.info/sct'
                    }
                  ]
                }
              }
            }
          ],
          addresses: [
            {
              reference: 'urn:uuid:357bc3fa-93b6-4661-9d45-965756a4d936'
            },
            {
              reference: 'urn:uuid:990968b1-2d8c-4410-a1c8-5abdf3b9ce8f'
            }
          ],
          period: {
            end: '2008-12-28T06:52:44-05:00',
            start: '2006-04-06T07:52:44-04:00'
          },
          context: {
            reference: 'urn:uuid:3b0f8006-48b0-41ec-afea-9f3e9ebd67a3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          category: [
            {
              text: 'Respiratory therapy',
              coding: [
                {
                  display: 'Respiratory therapy',
                  code: '53950000',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          intent: 'order',
          status: 'completed',
          id: '5d245d4d-8355-4955-bccd-81d20602342c',
          resourceType: 'CarePlan'
        },
        fullUrl: 'urn:uuid:5d245d4d-8355-4955-bccd-81d20602342c'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 625
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:3b0f8006-48b0-41ec-afea-9f3e9ebd67a3'
                }
              ],
              sequence: 1
            },
            {
              diagnosisLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 3
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:050c22d0-2862-47b4-85af-094ff0c170b8'
              },
              sequence: 1
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:990968b1-2d8c-4410-a1c8-5abdf3b9ce8f'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2006-04-06T07:52:44-04:00',
            start: '2006-04-06T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '2ca37109-dff4-44a5-b912-3718dbbbb901',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:2ca37109-dff4-44a5-b912-3718dbbbb901'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '2008-12-28T06:52:44-05:00',
            start: '2008-12-28T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '98339010-3bfb-4a62-82d8-3994a3eccfbb',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:98339010-3bfb-4a62-82d8-3994a3eccfbb'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 163.655450450609
          },
          issued: '2008-12-28T06:52:44.948-05:00',
          effectiveDateTime: '2008-12-28T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:98339010-3bfb-4a62-82d8-3994a3eccfbb'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '3c17fd92-2c78-4226-897e-7aadf3d83bf9',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:3c17fd92-2c78-4226-897e-7aadf3d83bf9'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 87.1018420812091
          },
          issued: '2008-12-28T06:52:44.948-05:00',
          effectiveDateTime: '2008-12-28T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:98339010-3bfb-4a62-82d8-3994a3eccfbb'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '7f0047df-6eb9-41ce-9cdd-9ad4d8dd2e5c',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:7f0047df-6eb9-41ce-9cdd-9ad4d8dd2e5c'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 32.5211872656241
          },
          issued: '2008-12-28T06:52:44.948-05:00',
          effectiveDateTime: '2008-12-28T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:98339010-3bfb-4a62-82d8-3994a3eccfbb'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '7a1dfe38-29bf-425e-acc2-7a17d3ac16c8',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:7a1dfe38-29bf-425e-acc2-7a17d3ac16c8'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 84.989347728119
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 135.430426523633
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '2008-12-28T06:52:44.948-05:00',
          effectiveDateTime: '2008-12-28T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:98339010-3bfb-4a62-82d8-3994a3eccfbb'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '074ac5d8-57f8-4ec6-9e01-eeef13943447',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:074ac5d8-57f8-4ec6-9e01-eeef13943447'
      },
      {
        resource: {
          performedDateTime: '2008-12-28T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:98339010-3bfb-4a62-82d8-3994a3eccfbb'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: '613efca6-e237-4338-810b-fc485932defe',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:613efca6-e237-4338-810b-fc485932defe'
      },
      {
        resource: {
          primarySource: true,
          date: '2008-12-28T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:98339010-3bfb-4a62-82d8-3994a3eccfbb'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '292bd0e5-f984-47be-a952-36c6fa93bfdc',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:292bd0e5-f984-47be-a952-36c6fa93bfdc'
      },
      {
        resource: {
          primarySource: true,
          date: '2008-12-28T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:98339010-3bfb-4a62-82d8-3994a3eccfbb'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Td (adult) preservative free',
            coding: [
              {
                display: 'Td (adult) preservative free',
                code: '113',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '6902ceaf-4fc3-4a8e-8275-1e18599b8106',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:6902ceaf-4fc3-4a8e-8275-1e18599b8106'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 897
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:98339010-3bfb-4a62-82d8-3994a3eccfbb'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                2
              ],
              sequence: 3
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 4
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:613efca6-e237-4338-810b-fc485932defe'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:292bd0e5-f984-47be-a952-36c6fa93bfdc'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            },
            {
              valueReference: {
                reference: 'urn:uuid:6902ceaf-4fc3-4a8e-8275-1e18599b8106'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 2
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2008-12-28T06:52:44-05:00',
            start: '2008-12-28T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'b3dabd49-17fe-4809-a186-2d1c55eb49c0',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:b3dabd49-17fe-4809-a186-2d1c55eb49c0'
      },
      {
        resource: {
          address: [
            {
              country: 'US',
              postalCode: '02115',
              state: 'MA',
              city: 'BOSTON',
              line: [
                '300 LONGWOOD AVENUE'
              ]
            }
          ],
          telecom: [
            {
              value: '6177356000',
              system: 'phone'
            }
          ],
          name: "BOSTON CHILDREN'S HOSPITAL",
          type: [
            {
              text: 'Healthcare Provider',
              coding: [
                {
                  display: 'Healthcare Provider',
                  code: 'prov',
                  system: 'Healthcare Provider'
                }
              ]
            }
          ],
          identifier: [
            {
              value: '6e1d1e49-3908-4060-89bc-5906674127c1',
              system: 'https://github.com/synthetichealth/synthea'
            }
          ],
          id: '6bbec055-c4b6-49f8-aec4-eb09cbb4061d',
          resourceType: 'Organization'
        },
        fullUrl: 'urn:uuid:6bbec055-c4b6-49f8-aec4-eb09cbb4061d'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:6bbec055-c4b6-49f8-aec4-eb09cbb4061d'
          },
          period: {
            end: '2011-05-31T07:52:44-04:00',
            start: '2011-05-31T07:52:44-04:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Emergency room admission',
              coding: [
                {
                  display: 'Emergency room admission',
                  code: '50849002',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'emergency'
          },
          status: 'finished',
          id: 'ef801661-2afe-4bf1-97a2-f0b14bd9fb1b',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:ef801661-2afe-4bf1-97a2-f0b14bd9fb1b'
      },
      {
        resource: {
          assertedDate: '2011-05-31T07:52:44-04:00',
          abatementDateTime: '2011-06-14T07:52:44-04:00',
          onsetDateTime: '2011-05-31T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:ef801661-2afe-4bf1-97a2-f0b14bd9fb1b'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Sprain of ankle',
            coding: [
              {
                display: 'Sprain of ankle',
                code: '44465007',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: 'confirmed',
          clinicalStatus: 'resolved',
          id: '5e7fe75b-236e-433a-add6-6af4b83263db',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:5e7fe75b-236e-433a-add6-6af4b83263db'
      },
      {
        resource: {
          dosageInstruction: [
            {
              asNeededBoolean: true,
              sequence: 1
            }
          ],
          authoredOn: '2011-05-31T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:ef801661-2afe-4bf1-97a2-f0b14bd9fb1b'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          medicationCodeableConcept: {
            text: 'Acetaminophen 325 MG Oral Tablet',
            coding: [
              {
                display: 'Acetaminophen 325 MG Oral Tablet',
                code: '313782',
                system: 'http://www.nlm.nih.gov/research/umls/rxnorm'
              }
            ]
          },
          intent: 'order',
          status: 'stopped',
          id: '83635694-2c6b-4bcc-873a-10d3f7adbc76',
          resourceType: 'MedicationRequest'
        },
        fullUrl: 'urn:uuid:83635694-2c6b-4bcc-873a-10d3f7adbc76'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 255
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:ef801661-2afe-4bf1-97a2-f0b14bd9fb1b'
                }
              ],
              sequence: 1
            }
          ],
          prescription: {
            reference: 'urn:uuid:83635694-2c6b-4bcc-873a-10d3f7adbc76'
          },
          organization: {
            reference: 'urn:uuid:6bbec055-c4b6-49f8-aec4-eb09cbb4061d'
          },
          billablePeriod: {
            end: '2011-05-31T07:52:44-04:00',
            start: '2011-05-31T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'c078ab09-ac0a-4abd-845f-e5dcf1551ac6',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:c078ab09-ac0a-4abd-845f-e5dcf1551ac6'
      },
      {
        resource: {
          activity: [
            {
              detail: {
                status: 'completed',
                code: {
                  text: 'Rest, ice, compression and elevation treatment programme',
                  coding: [
                    {
                      display: 'Rest, ice, compression and elevation treatment programme',
                      code: '229586001',
                      system: 'http://snomed.info/sct'
                    }
                  ]
                }
              }
            },
            {
              detail: {
                status: 'completed',
                code: {
                  text: 'Stretching exercises',
                  coding: [
                    {
                      display: 'Stretching exercises',
                      code: '229070002',
                      system: 'http://snomed.info/sct'
                    }
                  ]
                }
              }
            }
          ],
          addresses: [
            {
              reference: 'urn:uuid:5e7fe75b-236e-433a-add6-6af4b83263db'
            }
          ],
          period: {
            end: '2011-06-14T07:52:44-04:00',
            start: '2011-05-31T07:52:44-04:00'
          },
          context: {
            reference: 'urn:uuid:ef801661-2afe-4bf1-97a2-f0b14bd9fb1b'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          category: [
            {
              text: 'Physical therapy procedure',
              coding: [
                {
                  display: 'Physical therapy procedure',
                  code: '91251008',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          intent: 'order',
          status: 'completed',
          id: 'a3176315-ee51-4571-bcfd-e7cfb87d503c',
          resourceType: 'CarePlan'
        },
        fullUrl: 'urn:uuid:a3176315-ee51-4571-bcfd-e7cfb87d503c'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:ef801661-2afe-4bf1-97a2-f0b14bd9fb1b'
                }
              ],
              sequence: 1
            },
            {
              diagnosisLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:5e7fe75b-236e-433a-add6-6af4b83263db'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:6bbec055-c4b6-49f8-aec4-eb09cbb4061d'
          },
          billablePeriod: {
            end: '2011-05-31T07:52:44-04:00',
            start: '2011-05-31T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '5762f526-4c52-49ac-893d-381a0c0250d5',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:5762f526-4c52-49ac-893d-381a0c0250d5'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '2012-01-01T06:52:44-05:00',
            start: '2012-01-01T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '4eb70a41-41d0-4386-b0ca-b6c9732cd1b1',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:4eb70a41-41d0-4386-b0ca-b6c9732cd1b1'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 163.655450450609
          },
          issued: '2012-01-01T06:52:44.948-05:00',
          effectiveDateTime: '2012-01-01T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:4eb70a41-41d0-4386-b0ca-b6c9732cd1b1'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'e594af77-7d74-4f42-9b4c-117c48d564cc',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:e594af77-7d74-4f42-9b4c-117c48d564cc'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 91.2221749989142
          },
          issued: '2012-01-01T06:52:44.948-05:00',
          effectiveDateTime: '2012-01-01T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:4eb70a41-41d0-4386-b0ca-b6c9732cd1b1'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '860690c2-15a5-4488-8675-c6845dda1953',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:860690c2-15a5-4488-8675-c6845dda1953'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 34.0595946656476
          },
          issued: '2012-01-01T06:52:44.948-05:00',
          effectiveDateTime: '2012-01-01T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:4eb70a41-41d0-4386-b0ca-b6c9732cd1b1'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '5df234c4-be1e-4dfb-8942-6d13fa982a4e',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:5df234c4-be1e-4dfb-8942-6d13fa982a4e'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 70.6387603352505
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 114.48913350748
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '2012-01-01T06:52:44.948-05:00',
          effectiveDateTime: '2012-01-01T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:4eb70a41-41d0-4386-b0ca-b6c9732cd1b1'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'c001103c-b4ec-47a5-80c7-2bc00abc1238',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:c001103c-b4ec-47a5-80c7-2bc00abc1238'
      },
      {
        resource: {
          primarySource: true,
          date: '2012-01-01T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:4eb70a41-41d0-4386-b0ca-b6c9732cd1b1'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: '1acf8f83-f197-4434-8ce2-efe0e3c3cf14',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:1acf8f83-f197-4434-8ce2-efe0e3c3cf14'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:4eb70a41-41d0-4386-b0ca-b6c9732cd1b1'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:1acf8f83-f197-4434-8ce2-efe0e3c3cf14'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2012-01-01T06:52:44-05:00',
            start: '2012-01-01T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'caf98322-63aa-40a4-a310-d7dc6070665e',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:caf98322-63aa-40a4-a310-d7dc6070665e'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '2015-01-04T06:52:44-05:00',
            start: '2015-01-04T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '52682387-1bd0-48d7-a223-3b3dea50c4c7',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:52682387-1bd0-48d7-a223-3b3dea50c4c7'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 163.655450450609
          },
          issued: '2015-01-04T06:52:44.948-05:00',
          effectiveDateTime: '2015-01-04T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:52682387-1bd0-48d7-a223-3b3dea50c4c7'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '76839a4e-3dc4-4155-9ea5-2da6389aa79f',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:76839a4e-3dc4-4155-9ea5-2da6389aa79f'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 95.2027319689217
          },
          issued: '2015-01-04T06:52:44.948-05:00',
          effectiveDateTime: '2015-01-04T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:52682387-1bd0-48d7-a223-3b3dea50c4c7'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '38ebf04b-fb76-41ff-b1e9-b7f624bf63f3',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:38ebf04b-fb76-41ff-b1e9-b7f624bf63f3'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 35.5458139642291
          },
          issued: '2015-01-04T06:52:44.948-05:00',
          effectiveDateTime: '2015-01-04T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:52682387-1bd0-48d7-a223-3b3dea50c4c7'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '8ddefc23-c714-4058-8507-26ee370ba3d5',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:8ddefc23-c714-4058-8507-26ee370ba3d5'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 78.1213736919087
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 105.595036304426
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '2015-01-04T06:52:44.948-05:00',
          effectiveDateTime: '2015-01-04T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:52682387-1bd0-48d7-a223-3b3dea50c4c7'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '8f0e2bc9-400f-4c7f-a360-cbea79cbe90b',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:8f0e2bc9-400f-4c7f-a360-cbea79cbe90b'
      },
      {
        resource: {
          primarySource: true,
          date: '2015-01-04T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:52682387-1bd0-48d7-a223-3b3dea50c4c7'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'e4395fd4-6d7a-4709-8da7-fe3f50960f2d',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:e4395fd4-6d7a-4709-8da7-fe3f50960f2d'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 261
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:52682387-1bd0-48d7-a223-3b3dea50c4c7'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:e4395fd4-6d7a-4709-8da7-fe3f50960f2d'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2015-01-04T06:52:44-05:00',
            start: '2015-01-04T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'a07fe54a-4812-4a54-889e-3f15448ffa1a',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:a07fe54a-4812-4a54-889e-3f15448ffa1a'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:6bbec055-c4b6-49f8-aec4-eb09cbb4061d'
          },
          period: {
            end: '2015-05-24T07:52:44-04:00',
            start: '2015-05-24T07:52:44-04:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Emergency room admission',
              coding: [
                {
                  display: 'Emergency room admission',
                  code: '50849002',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'emergency'
          },
          status: 'finished',
          id: 'e47b74ce-0a71-429e-9f99-36d76857de4d',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:e47b74ce-0a71-429e-9f99-36d76857de4d'
      },
      {
        resource: {
          assertedDate: '2015-05-24T07:52:44-04:00',
          abatementDateTime: '2015-08-22T07:52:44-04:00',
          onsetDateTime: '2015-05-24T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:e47b74ce-0a71-429e-9f99-36d76857de4d'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Fracture of clavicle',
            coding: [
              {
                display: 'Fracture of clavicle',
                code: '58150001',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: 'confirmed',
          clinicalStatus: 'resolved',
          id: '78491eb1-9bb6-4d02-9f1b-7658dad94449',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:78491eb1-9bb6-4d02-9f1b-7658dad94449'
      },
      {
        resource: {
          performedDateTime: '2015-05-24T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:e47b74ce-0a71-429e-9f99-36d76857de4d'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Clavicle X-ray',
            coding: [
              {
                display: 'Clavicle X-ray',
                code: '168594001',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: 'bc72abac-3f3a-4815-b7eb-ce31cb5f091d',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:bc72abac-3f3a-4815-b7eb-ce31cb5f091d'
      },
      {
        resource: {
          reasonReference: [
            {
              display: 'Fracture of clavicle',
              reference: 'urn:uuid:78491eb1-9bb6-4d02-9f1b-7658dad94449'
            }
          ],
          performedPeriod: {
            end: '2015-05-24T08:52:44-04:00',
            start: '2015-05-24T07:52:44-04:00'
          },
          context: {
            reference: 'urn:uuid:e47b74ce-0a71-429e-9f99-36d76857de4d'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Admission to orthopedic department',
            coding: [
              {
                display: 'Admission to orthopedic department',
                code: '305428000',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: '35c00942-d7f7-4499-ae17-f12f554db513',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:35c00942-d7f7-4499-ae17-f12f554db513'
      },
      {
        resource: {
          dosageInstruction: [
            {
              doseQuantity: {
                value: 1
              },
              asNeededBoolean: false,
              timing: {
                repeat: {
                  periodUnit: 'h',
                  period: 6,
                  frequency: 1
                }
              },
              sequence: 1
            }
          ],
          authoredOn: '2015-05-24T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:e47b74ce-0a71-429e-9f99-36d76857de4d'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          medicationCodeableConcept: {
            text: 'Acetaminophen 325 MG / HYDROcodone Bitartrate 7.5 MG Oral Tablet',
            coding: [
              {
                display: 'Acetaminophen 325 MG / HYDROcodone Bitartrate 7.5 MG Oral Tablet',
                code: '857005',
                system: 'http://www.nlm.nih.gov/research/umls/rxnorm'
              }
            ]
          },
          intent: 'order',
          status: 'stopped',
          id: 'd6f99301-64fd-4fd3-9f0d-6a5dc9025e50',
          resourceType: 'MedicationRequest'
        },
        fullUrl: 'urn:uuid:d6f99301-64fd-4fd3-9f0d-6a5dc9025e50'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 255
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:e47b74ce-0a71-429e-9f99-36d76857de4d'
                }
              ],
              sequence: 1
            }
          ],
          prescription: {
            reference: 'urn:uuid:d6f99301-64fd-4fd3-9f0d-6a5dc9025e50'
          },
          organization: {
            reference: 'urn:uuid:6bbec055-c4b6-49f8-aec4-eb09cbb4061d'
          },
          billablePeriod: {
            end: '2015-05-24T07:52:44-04:00',
            start: '2015-05-24T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '25bceedb-0aca-4d7a-aace-bd9e8af3fb27',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:25bceedb-0aca-4d7a-aace-bd9e8af3fb27'
      },
      {
        resource: {
          dosageInstruction: [
            {
              asNeededBoolean: true,
              sequence: 1
            }
          ],
          authoredOn: '2015-05-24T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:e47b74ce-0a71-429e-9f99-36d76857de4d'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          medicationCodeableConcept: {
            text: 'Naproxen sodium 220 MG Oral Tablet',
            coding: [
              {
                display: 'Naproxen sodium 220 MG Oral Tablet',
                code: '849574',
                system: 'http://www.nlm.nih.gov/research/umls/rxnorm'
              }
            ]
          },
          intent: 'order',
          status: 'stopped',
          id: '2dfd7d01-913a-402f-83be-7c5b1b6e1936',
          resourceType: 'MedicationRequest'
        },
        fullUrl: 'urn:uuid:2dfd7d01-913a-402f-83be-7c5b1b6e1936'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 255
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:e47b74ce-0a71-429e-9f99-36d76857de4d'
                }
              ],
              sequence: 1
            }
          ],
          prescription: {
            reference: 'urn:uuid:2dfd7d01-913a-402f-83be-7c5b1b6e1936'
          },
          organization: {
            reference: 'urn:uuid:6bbec055-c4b6-49f8-aec4-eb09cbb4061d'
          },
          billablePeriod: {
            end: '2015-05-24T07:52:44-04:00',
            start: '2015-05-24T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '4077a5b6-5059-46c6-b5c5-6c1aee30f15f',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:4077a5b6-5059-46c6-b5c5-6c1aee30f15f'
      },
      {
        resource: {
          activity: [
            {
              detail: {
                status: 'completed',
                code: {
                  text: 'Recommendation to rest',
                  coding: [
                    {
                      display: 'Recommendation to rest',
                      code: '183051005',
                      system: 'http://snomed.info/sct'
                    }
                  ]
                }
              }
            },
            {
              detail: {
                status: 'completed',
                code: {
                  text: 'Physical activity target light exercise',
                  coding: [
                    {
                      display: 'Physical activity target light exercise',
                      code: '408580007',
                      system: 'http://snomed.info/sct'
                    }
                  ]
                }
              }
            }
          ],
          addresses: [
            {
              reference: 'urn:uuid:78491eb1-9bb6-4d02-9f1b-7658dad94449'
            }
          ],
          period: {
            end: '2015-08-22T07:52:44-04:00',
            start: '2015-05-24T07:52:44-04:00'
          },
          context: {
            reference: 'urn:uuid:e47b74ce-0a71-429e-9f99-36d76857de4d'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          category: [
            {
              text: 'Fracture care',
              coding: [
                {
                  display: 'Fracture care',
                  code: '385691007',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          intent: 'order',
          status: 'completed',
          id: 'f926def6-2d17-45ae-bbb6-f40b598e8b76',
          resourceType: 'CarePlan'
        },
        fullUrl: 'urn:uuid:f926def6-2d17-45ae-bbb6-f40b598e8b76'
      },
      {
        resource: {
          series: [
            {
              instance: [
                {
                  title: 'Image of clavicle',
                  sopClass: 'urn:oid:1.2.840.10008.5.1.4.1.1.1.1',
                  number: 1,
                  uid: 'urn:oid:1.2.840.99999999.1.1.23141466.1524491951638'
                }
              ],
              started: '2015-05-24T07:52:44-04:00',
              bodySite: {
                display: 'Clavicle',
                code: '51299004',
                system: 'http://snomed.info/sct'
              },
              availability: 'UNAVAILABLE',
              numberOfInstances: 1,
              modality: {
                display: 'Digital Radiography',
                code: 'DX',
                system: 'http://dicom.nema.org/resources/ontology/DCM'
              },
              number: 1,
              uid: 'urn:oid:1.2.840.99999999.1.82138175.1524491951638'
            }
          ],
          numberOfInstances: 1,
          numberOfSeries: 1,
          started: '2015-05-24T07:52:44-04:00',
          context: {
            reference: 'urn:uuid:e47b74ce-0a71-429e-9f99-36d76857de4d'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          uid: 'urn:oid:1.2.840.99999999.62889363.1524491951638',
          id: 'a49a329c-d468-42cf-9adb-458102b8919f',
          resourceType: 'ImagingStudy'
        },
        fullUrl: 'urn:uuid:a49a329c-d468-42cf-9adb-458102b8919f'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 1125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:e47b74ce-0a71-429e-9f99-36d76857de4d'
                }
              ],
              sequence: 1
            },
            {
              diagnosisLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 3
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                2
              ],
              sequence: 4
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:bc72abac-3f3a-4815-b7eb-ce31cb5f091d'
              },
              sequence: 1
            },
            {
              procedureReference: {
                reference: 'urn:uuid:35c00942-d7f7-4499-ae17-f12f554db513'
              },
              sequence: 2
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:78491eb1-9bb6-4d02-9f1b-7658dad94449'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:6bbec055-c4b6-49f8-aec4-eb09cbb4061d'
          },
          billablePeriod: {
            end: '2015-05-24T07:52:44-04:00',
            start: '2015-05-24T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: 'b9c115b5-7ad0-423f-bc91-5041550b6c04',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:b9c115b5-7ad0-423f-bc91-5041550b6c04'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          reason: [
            {
              coding: [
                {
                  display: 'Fracture of clavicle',
                  code: '58150001',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          period: {
            end: '2015-08-22T07:52:44-04:00',
            start: '2015-08-22T07:52:44-04:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: "Encounter for 'check-up'",
              coding: [
                {
                  display: "Encounter for 'check-up'",
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'ambulatory'
          },
          status: 'finished',
          id: '177322d8-dec9-49c8-bab9-741aa404065d',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:177322d8-dec9-49c8-bab9-741aa404065d'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:177322d8-dec9-49c8-bab9-741aa404065d'
                }
              ],
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2015-08-22T07:52:44-04:00',
            start: '2015-08-22T07:52:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '752d8009-5c3b-4537-b2cd-d6d526a355be',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:752d8009-5c3b-4537-b2cd-d6d526a355be'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          period: {
            end: '2018-01-07T06:52:44-05:00',
            start: '2018-01-07T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for check up (procedure)',
              coding: [
                {
                  display: 'Encounter for check up (procedure)',
                  code: '185349003',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'WELLNESS'
          },
          status: 'finished',
          id: '5d8186a4-9352-4e24-b930-5dbdcbc61cb3',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
      },
      {
        resource: {
          valueQuantity: {
            code: 'cm',
            system: 'http://unitsofmeasure.org',
            unit: 'cm',
            value: 163.655450450609
          },
          issued: '2018-01-07T06:52:44.948-05:00',
          effectiveDateTime: '2018-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Height',
            coding: [
              {
                display: 'Body Height',
                code: '8302-2',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'a1bfce10-b0f6-4ee5-a7ce-ea4c46365c6e',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:a1bfce10-b0f6-4ee5-a7ce-ea4c46365c6e'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg',
            system: 'http://unitsofmeasure.org',
            unit: 'kg',
            value: 100.604999940774
          },
          issued: '2018-01-07T06:52:44.948-05:00',
          effectiveDateTime: '2018-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Weight',
            coding: [
              {
                display: 'Body Weight',
                code: '29463-7',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '94ec6a86-10af-42ad-ae5c-e9a25f6bc892',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:94ec6a86-10af-42ad-ae5c-e9a25f6bc892'
      },
      {
        resource: {
          valueQuantity: {
            code: 'kg/m2',
            system: 'http://unitsofmeasure.org',
            unit: 'kg/m2',
            value: 37.5628570505038
          },
          issued: '2018-01-07T06:52:44.948-05:00',
          effectiveDateTime: '2018-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Body Mass Index',
            coding: [
              {
                display: 'Body Mass Index',
                code: '39156-5',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '3226b626-c760-476f-83eb-6bb15eead06e',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:3226b626-c760-476f-83eb-6bb15eead06e'
      },
      {
        resource: {
          component: [
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 84.1444039672809
              },
              code: {
                text: 'Diastolic Blood Pressure',
                coding: [
                  {
                    display: 'Diastolic Blood Pressure',
                    code: '8462-4',
                    system: 'http://loinc.org'
                  }
                ]
              }
            },
            {
              valueQuantity: {
                code: 'mmHg',
                system: 'http://unitsofmeasure.org',
                unit: 'mmHg',
                value: 113.513834144018
              },
              code: {
                text: 'Systolic Blood Pressure',
                coding: [
                  {
                    display: 'Systolic Blood Pressure',
                    code: '8480-6',
                    system: 'http://loinc.org'
                  }
                ]
              }
            }
          ],
          issued: '2018-01-07T06:52:44.948-05:00',
          effectiveDateTime: '2018-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Blood Pressure',
            coding: [
              {
                display: 'Blood Pressure',
                code: '55284-4',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'e64cf3b8-08cc-431a-8abc-09aae08f0a8e',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:e64cf3b8-08cc-431a-8abc-09aae08f0a8e'
      },
      {
        resource: {
          valueQuantity: {
            code: 'mg/dL',
            system: 'http://unitsofmeasure.org',
            unit: 'mg/dL',
            value: 179.874920196999
          },
          issued: '2018-01-07T06:52:44.948-05:00',
          effectiveDateTime: '2018-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Total Cholesterol',
            coding: [
              {
                display: 'Total Cholesterol',
                code: '2093-3',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'laboratory',
                  code: 'laboratory',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '0c4e17d4-5771-4759-a6e4-09d54a516922',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:0c4e17d4-5771-4759-a6e4-09d54a516922'
      },
      {
        resource: {
          valueQuantity: {
            code: 'mg/dL',
            system: 'http://unitsofmeasure.org',
            unit: 'mg/dL',
            value: 149.098644649195
          },
          issued: '2018-01-07T06:52:44.948-05:00',
          effectiveDateTime: '2018-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Triglycerides',
            coding: [
              {
                display: 'Triglycerides',
                code: '2571-8',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'laboratory',
                  code: 'laboratory',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'fab60317-230b-4d79-8913-fae1a899c860',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:fab60317-230b-4d79-8913-fae1a899c860'
      },
      {
        resource: {
          valueQuantity: {
            code: 'mg/dL',
            system: 'http://unitsofmeasure.org',
            unit: 'mg/dL',
            value: 87.3236517103665
          },
          issued: '2018-01-07T06:52:44.948-05:00',
          effectiveDateTime: '2018-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Low Density Lipoprotein Cholesterol',
            coding: [
              {
                display: 'Low Density Lipoprotein Cholesterol',
                code: '18262-6',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'laboratory',
                  code: 'laboratory',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '2efc5ecf-924b-4007-85e9-aeab1c2ed163',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:2efc5ecf-924b-4007-85e9-aeab1c2ed163'
      },
      {
        resource: {
          valueQuantity: {
            code: 'mg/dL',
            system: 'http://unitsofmeasure.org',
            unit: 'mg/dL',
            value: 62.7315395567933
          },
          issued: '2018-01-07T06:52:44.948-05:00',
          effectiveDateTime: '2018-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'High Density Lipoprotein Cholesterol',
            coding: [
              {
                display: 'High Density Lipoprotein Cholesterol',
                code: '2085-9',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'laboratory',
                  code: 'laboratory',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: 'ad94659a-7b73-4928-a5d8-a870ae1b36ee',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:ad94659a-7b73-4928-a5d8-a870ae1b36ee'
      },
      {
        resource: {
          performedDateTime: '2018-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Documentation of current medications',
            coding: [
              {
                display: 'Documentation of current medications',
                code: '428191000124101',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: '7fd06ac0-6821-45b0-8e68-a693385757f8',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:7fd06ac0-6821-45b0-8e68-a693385757f8'
      },
      {
        resource: {
          primarySource: true,
          date: '2018-01-07T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Influenza, seasonal, injectable, preservative free',
            coding: [
              {
                display: 'Influenza, seasonal, injectable, preservative free',
                code: '140',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'a46b58c5-0455-4088-b5e6-e64646568ad5',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:a46b58c5-0455-4088-b5e6-e64646568ad5'
      },
      {
        resource: {
          primarySource: true,
          date: '2018-01-07T06:52:44-05:00',
          encounter: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          vaccineCode: {
            text: 'Td (adult) preservative free',
            coding: [
              {
                display: 'Td (adult) preservative free',
                code: '113',
                system: 'http://hl7.org/fhir/sid/cvx'
              }
            ]
          },
          notGiven: false,
          status: 'completed',
          id: 'd33f59fb-05f6-4ed0-82b8-e499fc50a7c4',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:d33f59fb-05f6-4ed0-82b8-e499fc50a7c4'
      },
      {
        resource: {
          result: [
            {
              display: 'Blood Pressure',
              reference: 'urn:uuid:e64cf3b8-08cc-431a-8abc-09aae08f0a8e'
            },
            {
              display: 'Total Cholesterol',
              reference: 'urn:uuid:0c4e17d4-5771-4759-a6e4-09d54a516922'
            },
            {
              display: 'Triglycerides',
              reference: 'urn:uuid:fab60317-230b-4d79-8913-fae1a899c860'
            },
            {
              display: 'Low Density Lipoprotein Cholesterol',
              reference: 'urn:uuid:2efc5ecf-924b-4007-85e9-aeab1c2ed163'
            }
          ],
          issued: '2018-01-07T06:52:44.948-05:00',
          effectiveDateTime: '2018-01-07T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Lipid Panel',
            coding: [
              {
                display: 'Lipid Panel',
                code: '57698-3',
                system: 'http://loinc.org'
              }
            ]
          },
          status: 'final',
          id: 'ef909319-dbc9-462a-b29b-d5ed9c220aa5',
          resourceType: 'DiagnosticReport'
        },
        fullUrl: 'urn:uuid:ef909319-dbc9-462a-b29b-d5ed9c220aa5'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 897
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:5d8186a4-9352-4e24-b930-5dbdcbc61cb3'
                }
              ],
              sequence: 1
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 136
              },
              informationLinkId: [
                2
              ],
              sequence: 3
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 4
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:7fd06ac0-6821-45b0-8e68-a693385757f8'
              },
              sequence: 1
            }
          ],
          information: [
            {
              valueReference: {
                reference: 'urn:uuid:a46b58c5-0455-4088-b5e6-e64646568ad5'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            },
            {
              valueReference: {
                reference: 'urn:uuid:d33f59fb-05f6-4ed0-82b8-e499fc50a7c4'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://hl7.org/fhir/claiminformationcategory'
                  }
                ]
              },
              sequence: 2
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2018-01-07T06:52:44-05:00',
            start: '2018-01-07T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '882cd095-be70-4403-bd67-f3be557ea5d1',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:882cd095-be70-4403-bd67-f3be557ea5d1'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          reason: [
            {
              coding: [
                {
                  display: 'Acute bronchitis (disorder)',
                  code: '10509002',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          period: {
            end: '2018-02-10T06:52:44-05:00',
            start: '2018-02-10T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for symptom',
              coding: [
                {
                  display: 'Encounter for symptom',
                  code: '185345009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'ambulatory'
          },
          status: 'finished',
          id: '356f260d-09ed-431c-aec1-79d971b88c21',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:356f260d-09ed-431c-aec1-79d971b88c21'
      },
      {
        resource: {
          assertedDate: '2018-02-10T06:52:44-05:00',
          abatementDateTime: '2018-02-24T06:52:44-05:00',
          onsetDateTime: '2018-02-10T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:356f260d-09ed-431c-aec1-79d971b88c21'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Acute bronchitis (disorder)',
            coding: [
              {
                display: 'Acute bronchitis (disorder)',
                code: '10509002',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: 'confirmed',
          clinicalStatus: 'resolved',
          id: '8bfc7029-94c3-413a-88d0-b2f24aa9bb28',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:8bfc7029-94c3-413a-88d0-b2f24aa9bb28'
      },
      {
        resource: {
          reasonReference: [
            {
              display: 'Acute bronchitis (disorder)',
              reference: 'urn:uuid:357bc3fa-93b6-4661-9d45-965756a4d936'
            },
            {
              display: 'Acute bronchitis (disorder)',
              reference: 'urn:uuid:990968b1-2d8c-4410-a1c8-5abdf3b9ce8f'
            },
            {
              display: 'Acute bronchitis (disorder)',
              reference: 'urn:uuid:8bfc7029-94c3-413a-88d0-b2f24aa9bb28'
            }
          ],
          performedPeriod: {
            end: '2018-02-10T07:14:44-05:00',
            start: '2018-02-10T06:52:44-05:00'
          },
          context: {
            reference: 'urn:uuid:356f260d-09ed-431c-aec1-79d971b88c21'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Measurement of respiratory function (procedure)',
            coding: [
              {
                display: 'Measurement of respiratory function (procedure)',
                code: '23426006',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          status: 'completed',
          id: '7e77e566-ccdd-4364-97ce-61786979213d',
          resourceType: 'Procedure'
        },
        fullUrl: 'urn:uuid:7e77e566-ccdd-4364-97ce-61786979213d'
      },
      {
        resource: {
          reasonReference: [
            {
              reference: 'urn:uuid:357bc3fa-93b6-4661-9d45-965756a4d936'
            },
            {
              reference: 'urn:uuid:990968b1-2d8c-4410-a1c8-5abdf3b9ce8f'
            },
            {
              reference: 'urn:uuid:8bfc7029-94c3-413a-88d0-b2f24aa9bb28'
            }
          ],
          authoredOn: '2018-02-10T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:356f260d-09ed-431c-aec1-79d971b88c21'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          medicationCodeableConcept: {
            text: 'Dextromethorphan Hydrobromide 1 MG/ML',
            coding: [
              {
                display: 'Dextromethorphan Hydrobromide 1 MG/ML',
                code: '1020137',
                system: 'http://www.nlm.nih.gov/research/umls/rxnorm'
              }
            ]
          },
          intent: 'order',
          status: 'stopped',
          id: 'ee8f34e2-f53d-4d17-9b0f-37dc2e95eca3',
          resourceType: 'MedicationRequest'
        },
        fullUrl: 'urn:uuid:ee8f34e2-f53d-4d17-9b0f-37dc2e95eca3'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 255
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:356f260d-09ed-431c-aec1-79d971b88c21'
                }
              ],
              sequence: 1
            }
          ],
          prescription: {
            reference: 'urn:uuid:ee8f34e2-f53d-4d17-9b0f-37dc2e95eca3'
          },
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2018-02-10T06:52:44-05:00',
            start: '2018-02-10T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '03b45bb9-e3d7-4e73-b00f-f0868e01f19e',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:03b45bb9-e3d7-4e73-b00f-f0868e01f19e'
      },
      {
        resource: {
          activity: [
            {
              detail: {
                status: 'in-progress',
                code: {
                  text: 'Recommendation to avoid exercise',
                  coding: [
                    {
                      display: 'Recommendation to avoid exercise',
                      code: '304510005',
                      system: 'http://snomed.info/sct'
                    }
                  ]
                }
              }
            },
            {
              detail: {
                status: 'in-progress',
                code: {
                  text: 'Deep breathing and coughing exercises',
                  coding: [
                    {
                      display: 'Deep breathing and coughing exercises',
                      code: '371605008',
                      system: 'http://snomed.info/sct'
                    }
                  ]
                }
              }
            }
          ],
          addresses: [
            {
              reference: 'urn:uuid:357bc3fa-93b6-4661-9d45-965756a4d936'
            },
            {
              reference: 'urn:uuid:990968b1-2d8c-4410-a1c8-5abdf3b9ce8f'
            },
            {
              reference: 'urn:uuid:8bfc7029-94c3-413a-88d0-b2f24aa9bb28'
            }
          ],
          period: {
            start: '2018-02-10T06:52:44-05:00'
          },
          context: {
            reference: 'urn:uuid:356f260d-09ed-431c-aec1-79d971b88c21'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          category: [
            {
              text: 'Respiratory therapy',
              coding: [
                {
                  display: 'Respiratory therapy',
                  code: '53950000',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          intent: 'order',
          status: 'active',
          id: '08072c74-fcf0-412a-a1f8-45fbfabfa384',
          resourceType: 'CarePlan'
        },
        fullUrl: 'urn:uuid:08072c74-fcf0-412a-a1f8-45fbfabfa384'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 625
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:356f260d-09ed-431c-aec1-79d971b88c21'
                }
              ],
              sequence: 1
            },
            {
              diagnosisLinkId: [
                1
              ],
              sequence: 2
            },
            {
              net: {
                code: 'USD',
                system: 'urn:iso:std:iso:4217',
                value: 500
              },
              procedureLinkId: [
                1
              ],
              sequence: 3
            }
          ],
          procedure: [
            {
              procedureReference: {
                reference: 'urn:uuid:7e77e566-ccdd-4364-97ce-61786979213d'
              },
              sequence: 1
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:8bfc7029-94c3-413a-88d0-b2f24aa9bb28'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2018-02-10T06:52:44-05:00',
            start: '2018-02-10T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '50a9e623-fd9d-47bb-b528-ccf76f957758',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:50a9e623-fd9d-47bb-b528-ccf76f957758'
      },
      {
        resource: {
          serviceProvider: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          reason: [
            {
              coding: [
                {
                  display: 'Acute viral pharyngitis (disorder)',
                  code: '195662009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          period: {
            end: '2018-02-21T06:52:44-05:00',
            start: '2018-02-21T06:52:44-05:00'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          type: [
            {
              text: 'Encounter for symptom',
              coding: [
                {
                  display: 'Encounter for symptom',
                  code: '185345009',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'ambulatory'
          },
          status: 'finished',
          id: '27f45c70-0171-4aa2-bfe5-e46405b7618e',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:27f45c70-0171-4aa2-bfe5-e46405b7618e'
      },
      {
        resource: {
          assertedDate: '2018-02-21T06:52:44-05:00',
          abatementDateTime: '2018-02-28T06:52:44-05:00',
          onsetDateTime: '2018-02-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:27f45c70-0171-4aa2-bfe5-e46405b7618e'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Acute viral pharyngitis (disorder)',
            coding: [
              {
                display: 'Acute viral pharyngitis (disorder)',
                code: '195662009',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: 'confirmed',
          clinicalStatus: 'resolved',
          id: '8a60f0df-e597-48ce-a01b-9ac889ba5d42',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:8a60f0df-e597-48ce-a01b-9ac889ba5d42'
      },
      {
        resource: {
          valueQuantity: {
            code: 'Cel',
            system: 'http://unitsofmeasure.org',
            unit: 'Cel',
            value: 37.5297572845016
          },
          issued: '2018-02-21T06:52:44.948-05:00',
          effectiveDateTime: '2018-02-21T06:52:44-05:00',
          context: {
            reference: 'urn:uuid:27f45c70-0171-4aa2-bfe5-e46405b7618e'
          },
          subject: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          code: {
            text: 'Oral temperature',
            coding: [
              {
                display: 'Oral temperature',
                code: '8331-1',
                system: 'http://loinc.org'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  display: 'vital-signs',
                  code: 'vital-signs',
                  system: 'http://hl7.org/fhir/observation-category'
                }
              ]
            }
          ],
          status: 'final',
          id: '80b93ccb-e082-4998-ae64-afa2af39d711',
          resourceType: 'Observation'
        },
        fullUrl: 'urn:uuid:80b93ccb-e082-4998-ae64-afa2af39d711'
      },
      {
        resource: {
          total: {
            code: 'USD',
            system: 'urn:iso:std:iso:4217',
            value: 125
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:27f45c70-0171-4aa2-bfe5-e46405b7618e'
                }
              ],
              sequence: 1
            },
            {
              diagnosisLinkId: [
                1
              ],
              sequence: 2
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:8a60f0df-e597-48ce-a01b-9ac889ba5d42'
              },
              sequence: 1
            }
          ],
          organization: {
            reference: 'urn:uuid:7f418203-c747-46db-aeae-067b3bd3126f'
          },
          billablePeriod: {
            end: '2018-02-21T06:52:44-05:00',
            start: '2018-02-21T06:52:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:a86c13ad-bbc9-40a2-b9b9-f48c7b9619d0'
          },
          use: 'complete',
          status: 'active',
          id: '0857cd5c-83fa-47e6-b2e1-d80d3f13e120',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:0857cd5c-83fa-47e6-b2e1-d80d3f13e120'
      }
    ],
    type: 'collection',
    resourceType: 'Bundle'
  },
  fhirVersion: 'STU3',
  user: 'kmahalingam',
  __v: 0
};

export default mockPatientStu3;
