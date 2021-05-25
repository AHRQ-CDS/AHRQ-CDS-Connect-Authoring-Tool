import moment from 'moment';

const mockTestResultsDstu2 = {
  data: {
    localIdPatientResultsMap: {
      '505bcdd9-5cc3-4ef3-8eea-6d479b1d4dc9': {
        'Untitled-Artifact': {
          10: true,
          11: true,
          12: true,
          13: true,
          14: 'Do adult things',
          16: 'Do adult things',
          17: 'Do adult things',
          18: true,
          19: null,
          21: null,
          22: null,
          23: null,
          24: null,
          5: moment().diff(moment('1985-02-04'), 'years'),
          6: 18,
          7: true,
          8: true,
          9: true
        }
      }
    },
    patientResults: {
      '505bcdd9-5cc3-4ef3-8eea-6d479b1d4dc9': {
        Errors: null,
        InPopulation: true,
        'Is Adult': true,
        MeetsInclusionCriteria: true,
        Patient: {
          address: [
            {
              city: {
                value: 'Worcester'
              },
              country: {
                value: 'US'
              },
              extension: [
                {
                  extension: [
                    {
                      url: 'latitude',
                      valueDecimal: {
                        value: -71.807783
                      }
                    },
                    {
                      url: 'longitude',
                      valueDecimal: {
                        value: 42.269478
                      }
                    }
                  ],
                  url: 'http://hl7.org/fhir/StructureDefinition/geolocation'
                }
              ],
              line: [
                {
                  value: '114 Fahey Station Apt 9'
                }
              ],
              postalCode: {
                value: '01545'
              },
              state: {
                value: 'Massachusetts'
              }
            }
          ],
          birthDate: {
            value: '1985-02-04'
          },
          communication: [
            {
              language: {
                coding: [
                  {
                    code: {
                      value: 'zh'
                    },
                    display: {
                      value: 'Chinese'
                    },
                    system: {
                      value: 'urn:ietf:bcp:47'
                    }
                  }
                ],
                text: {
                  value: 'Chinese'
                }
              }
            }
          ],
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/us-core-race',
              valueCodeableConcept: {
                coding: [
                  {
                    code: {
                      value: '2028-9'
                    },
                    display: {
                      value: 'Asian'
                    },
                    system: {
                      value: 'http://hl7.org/fhir/v3/Race'
                    }
                  }
                ],
                text: {
                  value: 'Asian'
                }
              }
            },
            {
              url: 'http://hl7.org/fhir/StructureDefinition/us-core-ethnicity',
              valueCodeableConcept: {
                coding: [
                  {
                    code: {
                      value: '2186-5'
                    },
                    display: {
                      value: 'Not Hispanic or Latino'
                    },
                    system: {
                      value: 'http://hl7.org/fhir/v3/Ethnicity'
                    }
                  }
                ],
                text: {
                  value: 'Not Hispanic or Latino'
                }
              }
            },
            {
              url: 'http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName',
              valueString: {
                value: 'Lavonne167 Lockman863'
              }
            },
            {
              url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
              valueCode: {
                value: 'F'
              }
            },
            {
              url: 'http://hl7.org/fhir/StructureDefinition/birthPlace',
              valueAddress: {
                city: {
                  value: 'Newton'
                },
                country: {
                  value: 'US'
                },
                state: {
                  value: 'Massachusetts'
                }
              }
            },
            {
              url: 'http://synthetichealth.github.io/synthea/disability-adjusted-life-years',
              valueDecimal: {
                value: 0.01509327630927441
              }
            },
            {
              url: 'http://synthetichealth.github.io/synthea/quality-adjusted-life-years',
              valueDecimal: {
                value: 31.984906723690724
              }
            }
          ],
          gender: {
            value: 'female'
          },
          id: {
            value: '505bcdd9-5cc3-4ef3-8eea-6d479b1d4dc9'
          },
          identifier: [
            {
              system: {
                value: 'https://github.com/synthetichealth/synthea'
              },
              value: {
                value: '649b1d29-f95f-4bbd-8ada-ba3af20222af'
              }
            },
            {
              system: {
                value: 'http://hospital.smarthealthit.org'
              },
              type: {
                coding: [
                  {
                    code: {
                      value: 'MR'
                    },
                    system: {
                      value: 'http://hl7.org/fhir/v2/0203'
                    }
                  }
                ]
              },
              value: {
                value: '649b1d29-f95f-4bbd-8ada-ba3af20222af'
              }
            },
            {
              system: {
                value: 'http://hl7.org/fhir/sid/us-ssn'
              },
              type: {
                coding: [
                  {
                    code: {
                      value: 'SB'
                    },
                    system: {
                      value: 'http://hl7.org/fhir/identifier-type'
                    }
                  }
                ]
              },
              value: {
                value: '999-89-8439'
              }
            },
            {
              system: {
                value: 'urn:oid:2.16.840.1.113883.4.3.25'
              },
              type: {
                coding: [
                  {
                    code: {
                      value: 'DL'
                    },
                    system: {
                      value: 'http://hl7.org/fhir/v2/0203'
                    }
                  }
                ]
              },
              value: {
                value: 'S99966785'
              }
            }
          ],
          maritalStatus: {
            coding: [
              {
                code: {
                  value: 'S'
                },
                system: {
                  value: 'http://hl7.org/fhir/v3/MaritalStatus'
                }
              }
            ]
          },
          multipleBirthBoolean: {
            value: false
          },
          name: [
            {
              family: [
                {
                  value: 'Baumbach677'
                }
              ],
              given: [
                {
                  value: 'Robin67'
                }
              ],
              prefix: [
                {
                  value: 'Ms.'
                }
              ],
              use: {
                value: 'official'
              }
            }
          ],
          telecom: [
            {
              system: {
                value: 'phone'
              },
              use: {
                value: 'home'
              },
              value: {
                value: '555-605-1169'
              }
            }
          ],
          text: {
            status: {
              value: 'generated'
            }
          }
        },
        Rationale: null,
        Recommendation: 'Do adult things'
      }
    },
    populationResults: {}
  }
};

export default mockTestResultsDstu2;
