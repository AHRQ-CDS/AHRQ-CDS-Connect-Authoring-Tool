const nock = require('nock');
const chai = require('chai');
//const chaiAsPromised = require("chai-as-promised");
chai.use(require("chai-as-promised"));
const expect = chai.expect;

const client = require('../../vsac/FHIRClient');

const FHIRMocks = require('./fixtures/FHIRFixtures');

describe('vsac/FHIRClient', () =>{
  // before the tests, disable network connections to ensure tests never hit real network
  before(() => {
    // if another test suite de-activated nock, we need to re-activate it
    if (!nock.isActive()) nock.activate();
    nock.disableNetConnect()
  });

  // after the tests, re-enable network connections
  after(() => {
    nock.restore();
    nock.enableNetConnect();
  });

  // after each test, check and clean nock
  afterEach(() => {
    nock.isDone();
    nock.cleanAll();
  });

  describe('#getValueSet', () => {
    it('should get a value set by OID', () => {
      const [username, password] = ['test-user', 'test-pass'];

      nock('https://cts.nlm.nih.gov')
        .get('/fhir/ValueSet/1234/$expand')
        .reply(200, FHIRMocks.ValueSet);

      // Invoke the request and verify the result
      const result = client.getValueSet("1234", username, password);
      return expect(result).to.eventually.eql({
        oid: '1234',
        version: '1',
        displayName: 'foo',
        codes: [
          {
            "system": "http://hl7.org/fhir/sid/icd-9-cm",
             "version": "2013",
             "code": "250.00",
             "display": "Diabetes mellitus without mention of complication, type II or unspecified type, not stated as uncontrolled"
          }
        ]
      });
    });
    it('should send a 401 back to the client', () => {
      const [username, password] = ['bad-test-user', 'bad-test-pass'];
      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/1234/$expand')
        .reply(401, '');
      const result = client.getValueSet("1234", username, password);
      return expect(result).to.be.rejectedWith(401);
    })
  });

  describe('#searchForValueSets', () => {
    it('should get a list of oids', () => {
      const [username, password] = ['test-user', 'test-pass'];
      nock('https://cts.nlm.nih.gov').get(/ValueSet/)
        .reply(200, FHIRMocks.Search);
      const result = client.searchForValueSets('Diabetes', username, password);
      const expResults = FHIRMocks.Search.entry.map((v) => {
        return {
          name: v.resource.name,
          steward: v.resource.publisher,
          oid: v.resource.id
        }
      })
      return expect(result).to.eventually.eql({_total: 67, count: 50, page: 1, results: expResults});
    })
  });
});
