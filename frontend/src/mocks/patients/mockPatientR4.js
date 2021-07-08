const mockPatientR4 = {
  _id: '5e4ac10bda93d8775c4ee619',
  updatedAt: '2020-02-17T16:36:27.156Z',
  createdAt: '2020-02-17T16:36:27.156Z',
  patient: {
    entry: [
      {
        request: {
          url: 'Patient',
          method: 'POST'
        },
        resource: {
          communication: [
            {
              language: {
                text: 'Portuguese',
                coding: [
                  {
                    display: 'Portuguese',
                    code: 'pt',
                    system: 'urn:ietf:bcp:47'
                  }
                ]
              }
            }
          ],
          multipleBirthBoolean: false,
          maritalStatus: {
            text: 'Never Married',
            coding: [
              {
                display: 'Never Married',
                code: 'S',
                system: 'http://terminology.hl7.org/CodeSystem/v3-MaritalStatus'
              }
            ]
          },
          address: [
            {
              country: 'US',
              postalCode: '01545',
              state: 'Massachusetts',
              city: 'Worcester',
              line: ['462 Homenick Landing Suite 25'],
              extension: [
                {
                  extension: [
                    {
                      valueDecimal: 42.2894936261063,
                      url: 'latitude'
                    },
                    {
                      valueDecimal: -71.8218075651246,
                      url: 'longitude'
                    }
                  ],
                  url: 'http://hl7.org/fhir/StructureDefinition/geolocation'
                }
              ]
            }
          ],
          birthDate: '1999-10-10',
          gender: 'female',
          telecom: [
            {
              use: 'home',
              value: '555-935-6358',
              system: 'phone'
            }
          ],
          name: [
            {
              prefix: ['Ms.'],
              given: ['Geneva168'],
              family: 'Reynolds644',
              use: 'official'
            }
          ],
          identifier: [
            {
              value: '93c286a8-f2ec-4cac-aed7-2367a9117795',
              system: 'https://github.com/synthetichealth/synthea'
            },
            {
              value: '93c286a8-f2ec-4cac-aed7-2367a9117795',
              system: 'http://hospital.smarthealthit.org',
              type: {
                text: 'Medical Record Number',
                coding: [
                  {
                    display: 'Medical Record Number',
                    code: 'MR',
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0203'
                  }
                ]
              }
            },
            {
              value: '999-51-1344',
              system: 'http://hl7.org/fhir/sid/us-ssn',
              type: {
                text: 'Social Security Number',
                coding: [
                  {
                    display: 'Social Security Number',
                    code: 'SS',
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0203'
                  }
                ]
              }
            },
            {
              value: 'S99918722',
              system: 'urn:oid:2.16.840.1.113883.4.3.25',
              type: {
                text: "Driver's License",
                coding: [
                  {
                    display: "Driver's License",
                    code: 'DL',
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0203'
                  }
                ]
              }
            },
            {
              value: 'X34486008X',
              system: 'http://standardhealthrecord.org/fhir/StructureDefinition/passportNumber',
              type: {
                text: 'Passport Number',
                coding: [
                  {
                    display: 'Passport Number',
                    code: 'PPN',
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0203'
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
                    display: 'White',
                    code: '2106-3',
                    system: 'urn:oid:2.16.840.1.113883.6.238'
                  },
                  url: 'ombCategory'
                },
                {
                  valueString: 'White',
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
              valueString: 'Lourdes258 Haag279',
              url: 'http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName'
            },
            {
              valueCode: 'F',
              url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex'
            },
            {
              valueAddress: {
                country: 'PT',
                state: 'Douro Litoral',
                city: 'Porto'
              },
              url: 'http://hl7.org/fhir/StructureDefinition/patient-birthPlace'
            },
            {
              valueDecimal: 0,
              url: 'http://synthetichealth.github.io/synthea/disability-adjusted-life-years'
            },
            {
              valueDecimal: 20,
              url: 'http://synthetichealth.github.io/synthea/quality-adjusted-life-years'
            }
          ],
          text: {
            div:
              '<div xmlns="http://www.w3.org/1999/xhtml">Generated by <a href="https://github.com/synthetichealth/synthea">Synthea</a>.Version identifier: c02eb98\n .   Person seed: -1322338014254487385  Population seed: 1580910964585</div>',
            status: 'generated'
          },
          id: '5e0fd3ec-85c6-4cc3-a12d-c470a93c3132',
          resourceType: 'Patient'
        },
        fullUrl: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
      },
      {
        request: {
          url: 'Organization',
          method: 'POST'
        },
        resource: {
          address: [
            {
              country: 'US',
              postalCode: '01609',
              state: 'MA',
              city: 'WORCESTER',
              line: ['585 LINCOLN ST']
            }
          ],
          telecom: [
            {
              value: '508-854-3320',
              system: 'phone'
            }
          ],
          name: 'SPECTRUM HEALTH SYSTEMS, INC',
          type: [
            {
              text: 'Healthcare Provider',
              coding: [
                {
                  display: 'Healthcare Provider',
                  code: 'prov',
                  system: 'http://terminology.hl7.org/CodeSystem/organization-type'
                }
              ]
            }
          ],
          active: true,
          identifier: [
            {
              value: '7690c88a-6b49-39dc-b8fc-1340687e0fc2',
              system: 'https://github.com/synthetichealth/synthea'
            }
          ],
          id: '7690c88a-6b49-39dc-b8fc-1340687e0fc2',
          resourceType: 'Organization'
        },
        fullUrl: 'urn:uuid:7690c88a-6b49-39dc-b8fc-1340687e0fc2'
      },
      {
        request: {
          url: 'Practitioner',
          method: 'POST'
        },
        resource: {
          gender: 'male',
          address: [
            {
              country: 'US',
              postalCode: '01609',
              state: 'MA',
              city: 'WORCESTER',
              line: ['585 LINCOLN ST']
            }
          ],
          telecom: [
            {
              use: 'work',
              value: 'Rickey821.Shields502@example.com',
              system: 'email'
            }
          ],
          name: [
            {
              prefix: ['Dr.'],
              given: ['Rickey821'],
              family: 'Shields502'
            }
          ],
          active: true,
          identifier: [
            {
              value: '52700',
              system: 'http://hl7.org/fhir/sid/us-npi'
            }
          ],
          id: '00000170-15a2-ef69-0000-00000000cddc',
          resourceType: 'Practitioner'
        },
        fullUrl: 'urn:uuid:00000170-15a2-ef69-0000-00000000cddc'
      },
      {
        request: {
          url: 'Encounter',
          method: 'POST'
        },
        resource: {
          serviceProvider: {
            display: 'SPECTRUM HEALTH SYSTEMS, INC',
            reference: 'urn:uuid:7690c88a-6b49-39dc-b8fc-1340687e0fc2'
          },
          period: {
            end: '2018-12-09T16:41:44-05:00',
            start: '2018-12-09T16:26:44-05:00'
          },
          participant: [
            {
              individual: {
                display: 'Dr. Rickey821 Shields502',
                reference: 'urn:uuid:00000170-15a2-ef69-0000-00000000cddc'
              }
            }
          ],
          subject: {
            display: 'Ms. Geneva168 Reynolds644',
            reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
          },
          type: [
            {
              text: 'General examination of patient (procedure)',
              coding: [
                {
                  display: 'General examination of patient (procedure)',
                  code: '162673000',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'AMB',
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
          },
          status: 'finished',
          id: 'c8858b09-3543-4f23-9dab-febbbdb6eecb',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:c8858b09-3543-4f23-9dab-febbbdb6eecb'
      },
      {
        request: {
          url: 'Immunization',
          method: 'POST'
        },
        resource: {
          primarySource: true,
          occurrenceDateTime: '2018-12-09T16:26:44-05:00',
          encounter: {
            reference: 'urn:uuid:c8858b09-3543-4f23-9dab-febbbdb6eecb'
          },
          patient: {
            reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
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
          status: 'completed',
          id: '83393068-eb4d-4877-b58e-6e5318ac85c2',
          resourceType: 'Immunization'
        },
        fullUrl: 'urn:uuid:83393068-eb4d-4877-b58e-6e5318ac85c2'
      },
      {
        request: {
          url: 'Claim',
          method: 'POST'
        },
        resource: {
          total: {
            currency: 'USD',
            value: 129.16
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:c8858b09-3543-4f23-9dab-febbbdb6eecb'
                }
              ],
              productOrService: {
                text: 'General examination of patient (procedure)',
                coding: [
                  {
                    display: 'General examination of patient (procedure)',
                    code: '162673000',
                    system: 'http://snomed.info/sct'
                  }
                ]
              },
              sequence: 1
            },
            {
              net: {
                currency: 'USD',
                value: 140.52
              },
              productOrService: {
                text: 'Influenza, seasonal, injectable, preservative free',
                coding: [
                  {
                    display: 'Influenza, seasonal, injectable, preservative free',
                    code: '140',
                    system: 'http://hl7.org/fhir/sid/cvx'
                  }
                ]
              },
              informationSequence: [1],
              sequence: 2
            }
          ],
          insurance: [
            {
              coverage: {
                display: 'Medicaid'
              },
              focal: true,
              sequence: 1
            }
          ],
          supportingInfo: [
            {
              valueReference: {
                reference: 'urn:uuid:83393068-eb4d-4877-b58e-6e5318ac85c2'
              },
              category: {
                coding: [
                  {
                    code: 'info',
                    system: 'http://terminology.hl7.org/CodeSystem/claiminformationcategory'
                  }
                ]
              },
              sequence: 1
            }
          ],
          priority: {
            coding: [
              {
                code: 'normal',
                system: 'http://terminology.hl7.org/CodeSystem/processpriority'
              }
            ]
          },
          provider: {
            display: 'SPECTRUM HEALTH SYSTEMS, INC',
            reference: 'urn:uuid:7690c88a-6b49-39dc-b8fc-1340687e0fc2'
          },
          created: '2018-12-09T16:41:44-05:00',
          billablePeriod: {
            end: '2018-12-09T16:41:44-05:00',
            start: '2018-12-09T16:26:44-05:00'
          },
          patient: {
            display: 'Geneva168 Reynolds644',
            reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
          },
          use: 'claim',
          type: {
            coding: [
              {
                code: 'institutional',
                system: 'http://terminology.hl7.org/CodeSystem/claim-type'
              }
            ]
          },
          status: 'active',
          id: '8d71a9de-e8a6-46a1-b547-56f1f1975151',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:8d71a9de-e8a6-46a1-b547-56f1f1975151'
      },
      {
        request: {
          url: 'ExplanationOfBenefit',
          method: 'POST'
        },
        resource: {
          payment: {
            amount: {
              currency: 'USD',
              value: 112.416
            }
          },
          total: [
            {
              amount: {
                currency: 'USD',
                value: 129.16
              },
              category: {
                text: 'Submitted Amount',
                coding: [
                  {
                    display: 'Submitted Amount',
                    code: 'submitted',
                    system: 'http://terminology.hl7.org/CodeSystem/adjudication'
                  }
                ]
              }
            }
          ],
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:c8858b09-3543-4f23-9dab-febbbdb6eecb'
                }
              ],
              locationCodeableConcept: {
                coding: [
                  {
                    display: 'Off Campus-Outpatient Hospital',
                    code: '19',
                    system: 'http://terminology.hl7.org/CodeSystem/ex-serviceplace'
                  }
                ]
              },
              servicedPeriod: {
                end: '2018-12-09T16:41:44-05:00',
                start: '2018-12-09T16:26:44-05:00'
              },
              productOrService: {
                text: 'General examination of patient (procedure)',
                coding: [
                  {
                    display: 'General examination of patient (procedure)',
                    code: '162673000',
                    system: 'http://snomed.info/sct'
                  }
                ]
              },
              category: {
                coding: [
                  {
                    display: 'Medical care',
                    code: '1',
                    system: 'https://bluebutton.cms.gov/resources/variables/line_cms_type_srvc_cd'
                  }
                ]
              },
              sequence: 1
            },
            {
              adjudication: [
                {
                  amount: {
                    currency: 'USD',
                    value: 28.104
                  },
                  category: {
                    coding: [
                      {
                        display: 'Line Beneficiary Coinsurance Amount',
                        code: 'https://bluebutton.cms.gov/resources/variables/line_coinsrnc_amt',
                        system: 'https://bluebutton.cms.gov/resources/codesystem/adjudication'
                      }
                    ]
                  }
                },
                {
                  amount: {
                    currency: 'USD',
                    value: 112.416
                  },
                  category: {
                    coding: [
                      {
                        display: 'Line Provider Payment Amount',
                        code: 'https://bluebutton.cms.gov/resources/variables/line_prvdr_pmt_amt',
                        system: 'https://bluebutton.cms.gov/resources/codesystem/adjudication'
                      }
                    ]
                  }
                },
                {
                  amount: {
                    currency: 'USD',
                    value: 140.52
                  },
                  category: {
                    coding: [
                      {
                        display: 'Line Submitted Charge Amount',
                        code: 'https://bluebutton.cms.gov/resources/variables/line_sbmtd_chrg_amt',
                        system: 'https://bluebutton.cms.gov/resources/codesystem/adjudication'
                      }
                    ]
                  }
                },
                {
                  amount: {
                    currency: 'USD',
                    value: 140.52
                  },
                  category: {
                    coding: [
                      {
                        display: 'Line Allowed Charge Amount',
                        code: 'https://bluebutton.cms.gov/resources/variables/line_alowd_chrg_amt',
                        system: 'https://bluebutton.cms.gov/resources/codesystem/adjudication'
                      }
                    ]
                  }
                },
                {
                  amount: {
                    currency: 'USD',
                    value: 0
                  },
                  category: {
                    coding: [
                      {
                        display: 'Line Beneficiary Part B Deductible Amount',
                        code: 'https://bluebutton.cms.gov/resources/variables/line_bene_ptb_ddctbl_amt',
                        system: 'https://bluebutton.cms.gov/resources/codesystem/adjudication'
                      }
                    ]
                  }
                },
                {
                  category: {
                    coding: [
                      {
                        display: 'Line Processing Indicator Code',
                        code: 'https://bluebutton.cms.gov/resources/variables/line_prcsg_ind_cd',
                        system: 'https://bluebutton.cms.gov/resources/codesystem/adjudication'
                      }
                    ]
                  }
                }
              ],
              net: {
                currency: 'USD',
                value: 140.52
              },
              locationCodeableConcept: {
                coding: [
                  {
                    display: 'Off Campus-Outpatient Hospital',
                    code: '19',
                    system: 'http://terminology.hl7.org/CodeSystem/ex-serviceplace'
                  }
                ]
              },
              servicedPeriod: {
                end: '2018-12-09T16:41:44-05:00',
                start: '2018-12-09T16:26:44-05:00'
              },
              productOrService: {
                text: 'Influenza, seasonal, injectable, preservative free',
                coding: [
                  {
                    display: 'Influenza, seasonal, injectable, preservative free',
                    code: '140',
                    system: 'http://hl7.org/fhir/sid/cvx'
                  }
                ]
              },
              category: {
                coding: [
                  {
                    display: 'Medical care',
                    code: '1',
                    system: 'https://bluebutton.cms.gov/resources/variables/line_cms_type_srvc_cd'
                  }
                ]
              },
              informationSequence: [1],
              sequence: 2
            }
          ],
          insurance: [
            {
              coverage: {
                display: 'Medicaid',
                reference: '#coverage'
              },
              focal: true
            }
          ],
          careTeam: [
            {
              role: {
                coding: [
                  {
                    display: 'Primary Care Practitioner',
                    code: 'primary',
                    system: 'http://terminology.hl7.org/CodeSystem/claimcareteamrole'
                  }
                ]
              },
              provider: {
                reference: 'urn:uuid:00000170-15a2-ef69-0000-00000000cddc'
              },
              sequence: 1
            }
          ],
          outcome: 'complete',
          claim: {
            reference: 'urn:uuid:8d71a9de-e8a6-46a1-b547-56f1f1975151'
          },
          referral: {
            reference: '#referral'
          },
          provider: {
            reference: 'urn:uuid:00000170-15a2-ef69-0000-00000000cddc'
          },
          insurer: {
            display: 'Medicaid'
          },
          created: '2018-12-09T16:41:44-05:00',
          billablePeriod: {
            end: '2019-12-09T16:41:44-05:00',
            start: '2018-12-09T16:41:44-05:00'
          },
          patient: {
            reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
          },
          use: 'claim',
          type: {
            coding: [
              {
                code: 'institutional',
                system: 'http://terminology.hl7.org/CodeSystem/claim-type'
              }
            ]
          },
          status: 'active',
          identifier: [
            {
              value: '8d71a9de-e8a6-46a1-b547-56f1f1975151',
              system: 'https://bluebutton.cms.gov/resources/variables/clm_id'
            },
            {
              value: '99999999999',
              system: 'https://bluebutton.cms.gov/resources/identifier/claim-group'
            }
          ],
          contained: [
            {
              performer: [
                {
                  reference: 'urn:uuid:00000170-15a2-ef69-0000-00000000cddc'
                }
              ],
              requester: {
                reference: 'urn:uuid:00000170-15a2-ef69-0000-00000000cddc'
              },
              subject: {
                reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
              },
              intent: 'order',
              status: 'completed',
              id: 'referral',
              resourceType: 'ServiceRequest'
            },
            {
              payor: [
                {
                  display: 'Medicaid'
                }
              ],
              beneficiary: {
                reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
              },
              type: {
                text: 'Medicaid'
              },
              status: 'active',
              id: 'coverage',
              resourceType: 'Coverage'
            }
          ],
          id: '65c8e5ea-dcd4-4afd-88b3-463135502177',
          resourceType: 'ExplanationOfBenefit'
        },
        fullUrl: 'urn:uuid:65c8e5ea-dcd4-4afd-88b3-463135502177'
      },
      {
        request: {
          url: 'Organization',
          method: 'POST'
        },
        resource: {
          address: [
            {
              country: 'US',
              postalCode: '01742',
              state: 'MA',
              city: 'W CONCORD',
              line: ['133 OLD ROAD TO 9 ACRE CORNER']
            }
          ],
          telecom: [
            {
              value: '9783691400',
              system: 'phone'
            }
          ],
          name: 'EMERSON HOSPITAL -',
          type: [
            {
              text: 'Healthcare Provider',
              coding: [
                {
                  display: 'Healthcare Provider',
                  code: 'prov',
                  system: 'http://terminology.hl7.org/CodeSystem/organization-type'
                }
              ]
            }
          ],
          active: true,
          identifier: [
            {
              value: '03347b4d-994e-302b-848b-58019a4e274d',
              system: 'https://github.com/synthetichealth/synthea'
            }
          ],
          id: '03347b4d-994e-302b-848b-58019a4e274d',
          resourceType: 'Organization'
        },
        fullUrl: 'urn:uuid:03347b4d-994e-302b-848b-58019a4e274d'
      },
      {
        request: {
          url: 'Practitioner',
          method: 'POST'
        },
        resource: {
          gender: 'female',
          address: [
            {
              country: 'US',
              postalCode: '01742',
              state: 'MA',
              city: 'W CONCORD',
              line: ['133 OLD ROAD TO 9 ACRE CORNER']
            }
          ],
          telecom: [
            {
              use: 'work',
              value: 'Dione665.Heaney114@example.com',
              system: 'email'
            }
          ],
          name: [
            {
              prefix: ['Dr.'],
              given: ['Dione665'],
              family: 'Heaney114'
            }
          ],
          active: true,
          identifier: [
            {
              value: '350',
              system: 'http://hl7.org/fhir/sid/us-npi'
            }
          ],
          id: '00000170-15a2-ef69-0000-00000000015e',
          resourceType: 'Practitioner'
        },
        fullUrl: 'urn:uuid:00000170-15a2-ef69-0000-00000000015e'
      },
      {
        request: {
          url: 'Encounter',
          method: 'POST'
        },
        resource: {
          serviceProvider: {
            display: 'EMERSON HOSPITAL -',
            reference: 'urn:uuid:03347b4d-994e-302b-848b-58019a4e274d'
          },
          diagnosis: [
            {
              rank: 1,
              use: {
                coding: [
                  {
                    code: 'billing',
                    system: 'http://hl7.org/fhir/diagnosis-role'
                  }
                ]
              },
              condition: {
                reference: 'urn:uuid:31cdae5b-efe8-4b4c-bd06-8ca4e2ed48ee'
              }
            }
          ],
          reasonCode: [
            {
              coding: [
                {
                  display: 'Cerebrovascular accident (disorder)',
                  code: '230690007',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          period: {
            end: '2019-10-28T17:26:44-04:00',
            start: '2019-10-14T17:26:44-04:00'
          },
          participant: [
            {
              individual: {
                display: 'Dr. Dione665 Heaney114',
                reference: 'urn:uuid:00000170-15a2-ef69-0000-00000000015e'
              }
            }
          ],
          subject: {
            display: 'Ms. Geneva168 Reynolds644',
            reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
          },
          type: [
            {
              text: 'Emergency hospital admission (procedure)',
              coding: [
                {
                  display: 'Emergency hospital admission (procedure)',
                  code: '183452005',
                  system: 'http://snomed.info/sct'
                }
              ]
            }
          ],
          class: {
            code: 'IMP',
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
          },
          status: 'finished',
          id: '483a8146-3179-40d0-83c9-65240436429c',
          resourceType: 'Encounter'
        },
        fullUrl: 'urn:uuid:483a8146-3179-40d0-83c9-65240436429c'
      },
      {
        request: {
          url: 'Condition',
          method: 'POST'
        },
        resource: {
          recordedDate: '2019-10-14T17:26:44-04:00',
          abatementDateTime: '2019-10-28T17:26:44-04:00',
          onsetDateTime: '2019-10-14T17:26:44-04:00',
          encounter: {
            reference: 'urn:uuid:483a8146-3179-40d0-83c9-65240436429c'
          },
          subject: {
            reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
          },
          code: {
            text: 'Cerebrovascular accident (disorder)',
            coding: [
              {
                display: 'Cerebrovascular accident (disorder)',
                code: '230690007',
                system: 'http://snomed.info/sct'
              }
            ]
          },
          verificationStatus: {
            coding: [
              {
                code: 'confirmed',
                system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status'
              }
            ]
          },
          clinicalStatus: {
            coding: [
              {
                code: 'resolved',
                system: 'http://terminology.hl7.org/CodeSystem/condition-clinical'
              }
            ]
          },
          id: '31cdae5b-efe8-4b4c-bd06-8ca4e2ed48ee',
          resourceType: 'Condition'
        },
        fullUrl: 'urn:uuid:31cdae5b-efe8-4b4c-bd06-8ca4e2ed48ee'
      },
      {
        request: {
          url: 'Claim',
          method: 'POST'
        },
        resource: {
          total: {
            currency: 'USD',
            value: 77.49
          },
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:483a8146-3179-40d0-83c9-65240436429c'
                }
              ],
              productOrService: {
                text: 'Emergency hospital admission (procedure)',
                coding: [
                  {
                    display: 'Emergency hospital admission (procedure)',
                    code: '183452005',
                    system: 'http://snomed.info/sct'
                  }
                ]
              },
              sequence: 1
            },
            {
              productOrService: {
                text: 'Cerebrovascular accident (disorder)',
                coding: [
                  {
                    display: 'Cerebrovascular accident (disorder)',
                    code: '230690007',
                    system: 'http://snomed.info/sct'
                  }
                ]
              },
              diagnosisSequence: [1],
              sequence: 2
            }
          ],
          insurance: [
            {
              coverage: {
                display: 'Medicaid'
              },
              focal: true,
              sequence: 1
            }
          ],
          diagnosis: [
            {
              diagnosisReference: {
                reference: 'urn:uuid:31cdae5b-efe8-4b4c-bd06-8ca4e2ed48ee'
              },
              sequence: 1
            }
          ],
          priority: {
            coding: [
              {
                code: 'normal',
                system: 'http://terminology.hl7.org/CodeSystem/processpriority'
              }
            ]
          },
          provider: {
            display: 'EMERSON HOSPITAL -',
            reference: 'urn:uuid:03347b4d-994e-302b-848b-58019a4e274d'
          },
          created: '2019-10-28T17:26:44-04:00',
          billablePeriod: {
            end: '2019-10-28T17:26:44-04:00',
            start: '2019-10-14T17:26:44-04:00'
          },
          patient: {
            display: 'Geneva168 Reynolds644',
            reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
          },
          use: 'claim',
          type: {
            coding: [
              {
                code: 'institutional',
                system: 'http://terminology.hl7.org/CodeSystem/claim-type'
              }
            ]
          },
          status: 'active',
          id: '8638c9cd-5fcb-4337-892e-e5cb90ebd8c2',
          resourceType: 'Claim'
        },
        fullUrl: 'urn:uuid:8638c9cd-5fcb-4337-892e-e5cb90ebd8c2'
      },
      {
        request: {
          url: 'ExplanationOfBenefit',
          method: 'POST'
        },
        resource: {
          payment: {
            amount: {
              currency: 'USD',
              value: 0
            }
          },
          total: [
            {
              amount: {
                currency: 'USD',
                value: 77.49
              },
              category: {
                text: 'Submitted Amount',
                coding: [
                  {
                    display: 'Submitted Amount',
                    code: 'submitted',
                    system: 'http://terminology.hl7.org/CodeSystem/adjudication'
                  }
                ]
              }
            }
          ],
          item: [
            {
              encounter: [
                {
                  reference: 'urn:uuid:483a8146-3179-40d0-83c9-65240436429c'
                }
              ],
              locationCodeableConcept: {
                coding: [
                  {
                    display: 'Inpatient Hospital',
                    code: '21',
                    system: 'http://terminology.hl7.org/CodeSystem/ex-serviceplace'
                  }
                ]
              },
              servicedPeriod: {
                end: '2019-10-28T17:26:44-04:00',
                start: '2019-10-14T17:26:44-04:00'
              },
              productOrService: {
                text: 'Emergency hospital admission (procedure)',
                coding: [
                  {
                    display: 'Emergency hospital admission (procedure)',
                    code: '183452005',
                    system: 'http://snomed.info/sct'
                  }
                ]
              },
              category: {
                coding: [
                  {
                    display: 'Medical care',
                    code: '1',
                    system: 'https://bluebutton.cms.gov/resources/variables/line_cms_type_srvc_cd'
                  }
                ]
              },
              sequence: 1
            },
            {
              locationCodeableConcept: {
                coding: [
                  {
                    display: 'Inpatient Hospital',
                    code: '21',
                    system: 'http://terminology.hl7.org/CodeSystem/ex-serviceplace'
                  }
                ]
              },
              servicedPeriod: {
                end: '2019-10-28T17:26:44-04:00',
                start: '2019-10-14T17:26:44-04:00'
              },
              productOrService: {
                text: 'Cerebrovascular accident (disorder)',
                coding: [
                  {
                    display: 'Cerebrovascular accident (disorder)',
                    code: '230690007',
                    system: 'http://snomed.info/sct'
                  }
                ]
              },
              category: {
                coding: [
                  {
                    display: 'Medical care',
                    code: '1',
                    system: 'https://bluebutton.cms.gov/resources/variables/line_cms_type_srvc_cd'
                  }
                ]
              },
              diagnosisSequence: [1],
              sequence: 2
            }
          ],
          insurance: [
            {
              coverage: {
                display: 'Medicaid',
                reference: '#coverage'
              },
              focal: true
            }
          ],
          diagnosis: [
            {
              type: [
                {
                  coding: [
                    {
                      code: 'principal',
                      system: 'http://terminology.hl7.org/CodeSystem/ex-diagnosistype'
                    }
                  ]
                }
              ],
              diagnosisReference: {
                reference: 'urn:uuid:31cdae5b-efe8-4b4c-bd06-8ca4e2ed48ee'
              },
              sequence: 1
            }
          ],
          careTeam: [
            {
              role: {
                coding: [
                  {
                    display: 'Primary Care Practitioner',
                    code: 'primary',
                    system: 'http://terminology.hl7.org/CodeSystem/claimcareteamrole'
                  }
                ]
              },
              provider: {
                reference: 'urn:uuid:00000170-15a2-ef69-0000-00000000015e'
              },
              sequence: 1
            }
          ],
          outcome: 'complete',
          claim: {
            reference: 'urn:uuid:8638c9cd-5fcb-4337-892e-e5cb90ebd8c2'
          },
          referral: {
            reference: '#referral'
          },
          provider: {
            reference: 'urn:uuid:00000170-15a2-ef69-0000-00000000015e'
          },
          insurer: {
            display: 'Medicaid'
          },
          created: '2019-10-28T17:26:44-04:00',
          billablePeriod: {
            end: '2020-10-28T17:26:44-04:00',
            start: '2019-10-28T17:26:44-04:00'
          },
          patient: {
            reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
          },
          use: 'claim',
          type: {
            coding: [
              {
                code: 'institutional',
                system: 'http://terminology.hl7.org/CodeSystem/claim-type'
              }
            ]
          },
          status: 'active',
          identifier: [
            {
              value: '8638c9cd-5fcb-4337-892e-e5cb90ebd8c2',
              system: 'https://bluebutton.cms.gov/resources/variables/clm_id'
            },
            {
              value: '99999999999',
              system: 'https://bluebutton.cms.gov/resources/identifier/claim-group'
            }
          ],
          contained: [
            {
              performer: [
                {
                  reference: 'urn:uuid:00000170-15a2-ef69-0000-00000000015e'
                }
              ],
              requester: {
                reference: 'urn:uuid:00000170-15a2-ef69-0000-00000000015e'
              },
              subject: {
                reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
              },
              intent: 'order',
              status: 'completed',
              id: 'referral',
              resourceType: 'ServiceRequest'
            },
            {
              payor: [
                {
                  display: 'Medicaid'
                }
              ],
              beneficiary: {
                reference: 'urn:uuid:5e0fd3ec-85c6-4cc3-a12d-c470a93c3132'
              },
              type: {
                text: 'Medicaid'
              },
              status: 'active',
              id: 'coverage',
              resourceType: 'Coverage'
            }
          ],
          id: '4ff0755a-92a0-40a0-829d-251dab794c31',
          resourceType: 'ExplanationOfBenefit'
        },
        fullUrl: 'urn:uuid:4ff0755a-92a0-40a0-829d-251dab794c31'
      }
    ],
    type: 'transaction',
    resourceType: 'Bundle'
  },
  fhirVersion: 'R4',
  user: 'demo',
  __v: 0
};

export default mockPatientR4;
