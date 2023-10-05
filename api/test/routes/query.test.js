const request = require('supertest');
const sandbox = require('sinon').createSandbox();
const { expect } = require('chai');
const { setupExpressApp } = require('./utils');

// NOTE: Most of the data exposed by /query is NOT user-dependent; therefore
// authentication is not required. In normal use, however, the use will be
// authenticated; so we test w/ authentication, but don't worry about testing
// without authentication since no sensitive data is at risk.
describe('Route: /authoring/api/query/implicitconversion', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return implicit conversion info', done => {
      request(app)
        .get('/authoring/api/query/implicitconversion')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect({
          FHIRToSystem: {
            'FHIR.boolean': 'System.Boolean',
            'FHIR.integer': 'System.Integer',
            'FHIR.decimal': 'System.Decimal',
            'FHIR.date': 'System.Date',
            'FHIR.dateTime': 'System.DateTime',
            'FHIR.time': 'System.Time',
            'FHIR.string': 'System.String',
            'FHIR.Quantity': 'System.Quantity',
            'FHIR.Ratio': 'System.Ratio',
            'FHIR.Any': 'System.Any',
            'FHIR.Coding': 'System.Code',
            'FHIR.CodeableConcept': 'System.Concept',
            'FHIR.Period': 'Interval<System.DateTime>',
            'FHIR.Range': 'Interval<System.Quantity>'
          }
        })
        .end(done);
    });
  });
});

// Usage: /authoring/api/query/operator?typeSpecifier=<Type>&elementType=<elementType>
describe('Route: /authoring/api/query/operator', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return operators for the given typeSpecifier and elementType', done => {
      request(app)
        .get('/authoring/api/query/operator?typeSpecifier=NamedTypeSpecifier&elementType=System.Quantity')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          // Check at least one has all the data
          expect(res.body).to.deep.include({
            id: 'quantityComparison',
            name: 'Compare',
            displayName: '',
            description: 'Compare two quantities with the same unit',
            operatorTemplate: 'quantityComparison',
            primaryOperand: {
              typeSpecifier: 'NamedTypeSpecifier',
              elementTypes: ['System.Quantity']
            },
            userSelectedOperands: [
              {
                id: 'comparisonOperator',
                name: 'Comparison',
                type: 'selector',
                selectionValues: [
                  { value: '<', label: 'less than' },
                  { value: '>', label: 'greater than' },
                  { value: '<=', label: 'less than or equal to' },
                  { value: '>=', label: 'greater than or equal to' },
                  { value: '=', label: 'equal to' }
                ]
              },
              {
                id: 'quantity',
                type: 'editor',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  editorType: 'System.Quantity',
                  requiredFields: ['quantity'],
                  displayField: 'str'
                }
              }
            ]
          });
          // Check that they're all there
          const opIds = res.body.map(op => op.id);
          expect(opIds).to.eql(['isNull', 'isNotNull', 'quantityComparison', 'quantityIsBetweenQuantities']);
        })
        .end(done);
    });

    it('should return only System.Any type for an unknown elementType', done => {
      request(app)
        .get('/authoring/api/query/operator?typeSpecifier=NamedTypeSpecifier&elementType=System.NewType')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          const opIds = res.body.map(op => op.id);
          expect(opIds).to.eql(['isNull', 'isNotNull']);
        })
        .end(done);
    });

    it('should return HTTP 404 for an unknown typeSpecifier', done => {
      request(app)
        .get('/authoring/api/query/operator?typeSpecifier=NewTypeSpecifier&elementType=System.Quantity')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should return HTTP 400 if typeSpecifier is not specified in the HTTP query', done => {
      request(app)
        .get('/authoring/api/query/operator?elementType=System.Quantity')
        .set('Accept', 'application/json')
        .expect(400, done);
    });

    it('should return HTTP 400 if elementType is not specified in the HTTP query', done => {
      request(app)
        .get('/authoring/api/query/operator?typeSpecifier=NamedTypeSpecifier')
        .set('Accept', 'application/json')
        .expect(400, done);
    });
  });
});

// Usage: /authoring/api/query/resources/<resourceName>?fhirVersion=<1.0.2|3.0.0|4.0.0|4.0.1>
describe('Route: /resources/:resourceName', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return resource info for the given DSTU2 resource', done => {
      request(app)
        .get('/authoring/api/query/resources/MedicationOrder?fhirVersion=1.0.2')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect([
          {
            name: 'MedicationOrder',
            properties: [
              {
                name: 'status',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.code'
                },
                predefinedCodes: ['active', 'on-hold', 'completed', 'entered-in-error', 'stopped', 'draft'],
                allowsCustomCodes: false
              },
              {
                name: 'dateWritten',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.dateTime'
                }
              }
            ]
          }
        ])
        .end(done);
    });

    it('should return resource info for the given STU3 resource', done => {
      request(app)
        .get('/authoring/api/query/resources/MedicationRequest?fhirVersion=3.0.0')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect([
          {
            name: 'MedicationRequest',
            properties: [
              {
                name: 'status',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.code'
                },
                predefinedCodes: [
                  'active',
                  'on-hold',
                  'canceled',
                  'completed',
                  'entered-in-error',
                  'stopped',
                  'draft',
                  'unknown'
                ],
                allowsCustomCodes: false
              },
              {
                name: 'intent',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.code'
                },
                predefinedCodes: ['proposal', 'plan', 'order', 'instance-order'],
                allowsCustomCodes: false
              },
              {
                name: 'authoredOn',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.dateTime'
                }
              }
            ]
          }
        ])
        .end(done);
    });

    it('should return resource info for the given R4 4.0.0 resource', done => {
      request(app)
        .get('/authoring/api/query/resources/ServiceRequest?fhirVersion=4.0.0')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect([
          {
            name: 'ServiceRequest',
            properties: [
              {
                name: 'status',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.code'
                },
                predefinedCodes: ['draft', 'active', 'on-hold', 'revoked', 'completed', 'entered-in-error', 'unknown'],
                allowsCustomCodes: false
              },
              {
                name: 'intent',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.code'
                },
                predefinedCodes: [
                  'proposal',
                  'plan',
                  'directive',
                  'order',
                  'original-order',
                  'reflex-order',
                  'filler-order',
                  'instance-order',
                  'option'
                ],
                allowsCustomCodes: false
              },
              {
                name: 'priority',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.code'
                },
                predefinedCodes: ['routine', 'urgent', 'asap', 'stat'],
                allowsCustomCodes: false
              },
              {
                name: 'doNotPerform',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.boolean'
                }
              },
              {
                name: 'occurrence',
                typeSpecifier: {
                  type: 'ChoiceTypeSpecifier',
                  elementType: [
                    {
                      name: 'occurrenceDateTime',
                      typeSpecifier: {
                        type: 'NamedTypeSpecifier',
                        elementType: 'FHIR.dateTime'
                      }
                    },
                    {
                      name: 'occurrencePeriod',
                      typeSpecifier: {
                        type: 'NamedTypeSpecifier',
                        elementType: 'FHIR.Period'
                      }
                    },
                    {
                      name: 'occurrenceTiming',
                      typeSpecifier: {
                        type: 'NamedTypeSpecifier',
                        elementType: 'FHIR.Timing'
                      }
                    }
                  ]
                }
              },
              {
                name: 'authoredOn',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.dateTime'
                }
              }
            ]
          }
        ])
        .end(done);
    });

    it('should return resource info for the given R4 4.0.1 resource', done => {
      request(app)
        .get('/authoring/api/query/resources/ServiceRequest?fhirVersion=4.0.1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect([
          {
            name: 'ServiceRequest',
            properties: [
              {
                name: 'status',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.code'
                },
                predefinedCodes: ['draft', 'active', 'on-hold', 'revoked', 'completed', 'entered-in-error', 'unknown'],
                allowsCustomCodes: false
              },
              {
                name: 'intent',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.code'
                },
                predefinedCodes: [
                  'proposal',
                  'plan',
                  'directive',
                  'order',
                  'original-order',
                  'reflex-order',
                  'filler-order',
                  'instance-order',
                  'option'
                ],
                allowsCustomCodes: false
              },
              {
                name: 'priority',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.code'
                },
                predefinedCodes: ['routine', 'urgent', 'asap', 'stat'],
                allowsCustomCodes: false
              },
              {
                name: 'doNotPerform',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.boolean'
                }
              },
              {
                name: 'occurrence',
                typeSpecifier: {
                  type: 'ChoiceTypeSpecifier',
                  elementType: [
                    {
                      name: 'occurrenceDateTime',
                      typeSpecifier: {
                        type: 'NamedTypeSpecifier',
                        elementType: 'FHIR.dateTime'
                      }
                    },
                    {
                      name: 'occurrencePeriod',
                      typeSpecifier: {
                        type: 'NamedTypeSpecifier',
                        elementType: 'FHIR.Period'
                      }
                    },
                    {
                      name: 'occurrenceTiming',
                      typeSpecifier: {
                        type: 'NamedTypeSpecifier',
                        elementType: 'FHIR.Timing'
                      }
                    }
                  ]
                }
              },
              {
                name: 'authoredOn',
                typeSpecifier: {
                  type: 'NamedTypeSpecifier',
                  elementType: 'FHIR.dateTime'
                }
              }
            ]
          }
        ])
        .end(done);
    });

    it('should return HTTP 404 for a resource not in DSTU2', done => {
      request(app)
        .get('/authoring/api/query/resources/MedicationRequest?fhirVersion=1.0.2')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should return HTTP 404 for a resource not in STU3', done => {
      request(app)
        .get('/authoring/api/query/resources/ServiceRequest?fhirVersion=3.0.0')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should return HTTP 404 for a resource not in R4 4.0.0', done => {
      request(app)
        .get('/authoring/api/query/resources/MedicationOrder?fhirVersion=4.0.0')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should return HTTP 404 for a resource not in R4 4.0.1', done => {
      request(app)
        .get('/authoring/api/query/resources/MedicationOrder?fhirVersion=4.0.1')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should return HTTP 400 if unsupported version of FHIR is passed in', done => {
      request(app)
        .get('/authoring/api/query/resources/Observation?fhirVersion=5.0.0')
        .set('Accept', 'application/json')
        .expect(400, done);
    });

    it('should return HTTP 400 if no version of FHIR is passed in', done => {
      request(app)
        .get('/authoring/api/query/resources/Observation')
        .set('Accept', 'application/json')
        .expect(400, done);
    });
  });
});
