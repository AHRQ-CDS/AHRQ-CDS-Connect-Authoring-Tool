const lodash = require('lodash');
const nock = require('nock');
const chai = require('chai');
//const chaiAsPromised = require("chai-as-promised");
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const client = require('../../vsac/FHIRClient');

const FHIRMocks = require('./fixtures/FHIRfixtures');

describe('vsac/FHIRClient', () => {
  // before the tests, disable network connections to ensure tests never hit real network
  before(() => {
    // if another test suite de-activated nock, we need to re-activate it
    if (!nock.isActive()) nock.activate();
    nock.disableNetConnect();
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

      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/1234/$expand').reply(200, FHIRMocks.ValueSet);

      // Invoke the request and verify the result
      const result = client.getValueSet('1234', username, password);
      return expect(result).to.eventually.eql({
        oid: '1234',
        version: '1',
        displayName: 'foo',
        codes: [
          {
            code: '250.00',
            codeSystemName: 'ICD9CM',
            codeSystemURI: 'http://hl7.org/fhir/sid/icd-9-cm',
            codeSystemVersion: '2013',
            displayName:
              'Diabetes mellitus without mention of complication, type II or unspecified type, ' +
              'not stated as uncontrolled'
          }
        ]
      });
    });

    it('should get a value set by OID and strip |{version}', () => {
      const [username, password] = ['test-user', 'test-pass'];

      const vsWithVersion = lodash.cloneDeep(FHIRMocks.ValueSet);
      vsWithVersion.id = '2468|13579';

      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/2468/$expand').reply(200, vsWithVersion);

      // Invoke the request and verify the result
      const result = client.getValueSet('2468', username, password);
      return expect(result).to.eventually.eql({
        oid: '2468',
        version: '1',
        displayName: 'foo',
        codes: [
          {
            code: '250.00',
            codeSystemName: 'ICD9CM',
            codeSystemURI: 'http://hl7.org/fhir/sid/icd-9-cm',
            codeSystemVersion: '2013',
            displayName:
              'Diabetes mellitus without mention of complication, type II or unspecified type, ' +
              'not stated as uncontrolled'
          }
        ]
      });
    });

    it('should get a value set by OID and strip -{version}', () => {
      const [username, password] = ['test-user', 'test-pass'];

      const vsWithVersion = lodash.cloneDeep(FHIRMocks.ValueSet);
      vsWithVersion.id = '9876-54321';
      vsWithVersion.version = '54321';

      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/9876/$expand').reply(200, vsWithVersion);

      // Invoke the request and verify the result
      const result = client.getValueSet('9876', username, password);
      return expect(result).to.eventually.eql({
        oid: '9876',
        version: '1',
        displayName: 'foo',
        codes: [
          {
            code: '250.00',
            codeSystemName: 'ICD9CM',
            codeSystemURI: 'http://hl7.org/fhir/sid/icd-9-cm',
            codeSystemVersion: '2013',
            displayName:
              'Diabetes mellitus without mention of complication, type II or unspecified type, ' +
              'not stated as uncontrolled'
          }
        ]
      });
    });

    it('should get a value set by OID and NOT strip anything after a - if it is just part of the id', () => {
      const [username, password] = ['test-user', 'test-pass'];

      const vsWithVersion = lodash.cloneDeep(FHIRMocks.ValueSet);
      vsWithVersion.id = '9876-6789-321'; // Valid id with - characters
      vsWithVersion.version = '54321'; // version differs from the last -321 portion

      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/9876-6789-321/$expand').reply(200, vsWithVersion);

      // Invoke the request and verify the result
      const result = client.getValueSet('9876-6789-321', username, password);
      return expect(result).to.eventually.eql({
        oid: '9876-6789-321',
        version: '1',
        displayName: 'foo',
        codes: [
          {
            code: '250.00',
            codeSystemName: 'ICD9CM',
            codeSystemURI: 'http://hl7.org/fhir/sid/icd-9-cm',
            codeSystemVersion: '2013',
            displayName:
              'Diabetes mellitus without mention of complication, type II or unspecified type, ' +
              'not stated as uncontrolled'
          }
        ]
      });
    });
  });

  describe('#getCode', () => {
    it('should get a code', () => {
      const [username, password] = ['test-user', 'test-pass'];

      nock('https://cts.nlm.nih.gov')
        .get('/fhir/CodeSystem/$lookup?code=1963-8&system=http://loinc.org')
        .reply(200, FHIRMocks.Code);

      // Invoke the request and verify the result
      const result = client.getCode('1963-8', 'http://loinc.org', username, password);
      return expect(result).to.eventually.eql({
        system: 'http://loinc.org',
        systemName: 'LOINC',
        systemOID: '2.16.840.1.113883.6.1',
        version: '2.63',
        code: '1963-8',
        display: 'Bicarbonate [Moles/volume] in Serum'
      });
    });
    it('should 404', () => {
      const [username, password] = ['test-user', 'test-pass'];

      nock('https://cts.nlm.nih.gov')
        .get('/fhir/CodeSystem/$lookup?code=abcd&system=http://not-a-system.org')
        .reply(404, FHIRMocks.Code);
      const result = client.getCode('abcd', 'http://not-a-system.org', username, password);
      return expect(result).to.be.rejectedWith(404);
    });
  });

  it('should send a 401 back to the client', () => {
    const [username, password] = ['bad-test-user', 'bad-test-pass'];
    nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/1234/$expand').reply(401, '');
    const result = client.getValueSet('1234', username, password);
    return expect(result).to.be.rejectedWith(401);
  });

  describe('#searchForValueSets', () => {
    it('should get a list of oids', () => {
      const [username, password] = ['test-user', 'test-pass'];
      nock('https://cts.nlm.nih.gov')
        .get(/ValueSet/)
        .reply(200, FHIRMocks.Search);
      const result = client.searchForValueSets('Diabetes', username, password);
      const expResults = FHIRMocks.Search.entry.map(v => {
        return {
          codeSystem: [],
          name: v.resource.name,
          steward: v.resource.publisher,
          oid: v.resource.id,
          codeCount: 0
        };
      });
      return expect(result).to.eventually.eql({ _total: 67, count: 50, page: 1, results: expResults });
    });

    it('should get a list of OIDs and strip versions', () => {
      const searchWithVersions = lodash.cloneDeep(FHIRMocks.Search);
      searchWithVersions.entry.forEach(entry => {
        entry.resource.id = `${entry.resource.id}|12345`;
      });

      const [username, password] = ['test-user', 'test-pass'];
      nock('https://cts.nlm.nih.gov')
        .get(/ValueSet/)
        .reply(200, searchWithVersions);
      const result = client.searchForValueSets('Diabetes', username, password);
      // Build results using original (non-modified / non-versioned results mock)
      const expResults = FHIRMocks.Search.entry.map(v => {
        return {
          codeSystem: [],
          name: v.resource.name,
          steward: v.resource.publisher,
          oid: v.resource.id,
          codeCount: 0
        };
      });
      return expect(result).to.eventually.eql({ _total: 67, count: 50, page: 1, results: expResults });
    });
  });

  describe('#getOneValueSet', () => {
    it('should get a list of one valueset with good credentials', () => {
      const [username, password] = ['test-user', 'test-pass'];
      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/2.16.840.1.113762.1.4.1034.65').reply(200, '');
      const result = client.getOneValueSet(username, password);
      // No data manipulation happens in this function. The request should succeed and return the result.
      return expect(result).to.eventually.be.fulfilled;
    });

    it('should handle bad authentication and send 401 back', () => {
      const [username, password] = ['test-user', 'test-wrong-pass'];
      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/2.16.840.1.113762.1.4.1034.65').reply(401, '');
      const result = client.getOneValueSet(username, password);
      // No data manipulation happens in this function. The request should success and return the result.
      return expect(result).to.be.rejectedWith(/401/);
    });
  });
});
