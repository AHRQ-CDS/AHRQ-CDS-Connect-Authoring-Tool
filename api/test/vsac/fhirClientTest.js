const lodash = require('lodash');
const nock = require('nock');
const chai = require('chai');
const expect = chai.expect;

const client = require('../../src/vsac/FHIRClient');

const FHIRMocks = require('./fixtures/FHIRfixtures');

// Helper function for testing promises that are expected to return an error
function shouldThrowError(result, errorCode) {
  const errorMessage = `expected a response with status ${errorCode}`;
  return result
    .then(() => {
      throw new Error(errorMessage);
    })
    .catch(err => {
      if (err.message === errorMessage) {
        throw err;
      }
      expect(err.response?.status).to.equal(errorCode);
    });
}

describe('FHIRClient', () => {
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
      return result.then(res =>
        expect(res).to.eql({
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
        })
      );
    });

    it('should get a value set by OID and strip |{version}', () => {
      const [username, password] = ['test-user', 'test-pass'];

      const vsWithVersion = lodash.cloneDeep(FHIRMocks.ValueSet);
      vsWithVersion.id = '2468|13579';

      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/2468/$expand').reply(200, vsWithVersion);

      // Invoke the request and verify the result
      const result = client.getValueSet('2468', username, password);
      return result.then(res =>
        expect(res).to.eql({
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
        })
      );
    });

    it('should get a value set by OID and strip -{version}', () => {
      const [username, password] = ['test-user', 'test-pass'];

      const vsWithVersion = lodash.cloneDeep(FHIRMocks.ValueSet);
      vsWithVersion.id = '9876-54321';
      vsWithVersion.version = '54321';

      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/9876/$expand').reply(200, vsWithVersion);

      // Invoke the request and verify the result
      const result = client.getValueSet('9876', username, password);
      return result.then(res =>
        expect(res).to.eql({
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
        })
      );
    });

    it('should get a value set by OID and NOT strip anything after a - if it is just part of the id', () => {
      const [username, password] = ['test-user', 'test-pass'];

      const vsWithVersion = lodash.cloneDeep(FHIRMocks.ValueSet);
      vsWithVersion.id = '9876-6789-321'; // Valid id with - characters
      vsWithVersion.version = '54321'; // version differs from the last -321 portion

      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/9876-6789-321/$expand').reply(200, vsWithVersion);

      // Invoke the request and verify the result
      const result = client.getValueSet('9876-6789-321', username, password);
      return result.then(res =>
        expect(res).to.eql({
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
        })
      );
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
      return result.then(res =>
        expect(res).to.eql({
          system: 'http://loinc.org',
          systemName: 'LOINC',
          systemOID: '2.16.840.1.113883.6.1',
          version: '2.63',
          code: '1963-8',
          display: 'Bicarbonate [Moles/volume] in Serum'
        })
      );
    });

    it('should 404', () => {
      const [username, password] = ['test-user', 'test-pass'];

      nock('https://cts.nlm.nih.gov')
        .get('/fhir/CodeSystem/$lookup?code=abcd&system=http://not-a-system.org')
        .reply(404, FHIRMocks.Code);
      const result = client.getCode('abcd', 'http://not-a-system.org', username, password);
      return shouldThrowError(result, 404);
    });
  });

  it('should send a 401 back to the client', () => {
    const [username, password] = ['bad-test-user', 'bad-test-pass'];
    nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/1234/$expand').reply(401, '');
    const result = client.getValueSet('1234', username, password);
    return shouldThrowError(result, 401);
  });

  describe('#searchForValueSets', () => {
    it('should get a list of oids', () => {
      const [username, password] = ['test-user', 'test-pass'];
      nock('https://cts.nlm.nih.gov')
        .get(/ValueSet/)
        .reply(200, FHIRMocks.Search);
      nock('https://cts.nlm.nih.gov')
        .get(/expand/)
        .times(67)
        .reply(200, FHIRMocks.ValueSetWithCounts);
      const result = client.searchForValueSets('Diabetes', username, password);
      const expResults = FHIRMocks.Search.entry.map(v => {
        return {
          codeSystem: [],
          name: v.resource.name,
          steward: v.resource.publisher,
          oid: v.resource.id,
          codeCount: 33,
          description: v.resource.description || '',
          experimental: v.resource.experimental || false,
          date: v.resource.date || '',
          lastReviewDate:
            v.resource.extension?.find(e => e.url === 'http://hl7.org/fhir/StructureDefinition/resource-lastReviewDate')
              ?.valueDate || '',
          purpose: null // Note: purpose construction tested separately
        };
      });
      return result.then(res => expect(res).to.eql({ total: 67, count: 50, page: 1, results: expResults }));
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
      nock('https://cts.nlm.nih.gov')
        .get(/expand/)
        .times(67)
        .reply(200, FHIRMocks.ValueSetWithCounts);
      const result = client.searchForValueSets('Diabetes', username, password);
      // Build results using original (non-modified / non-versioned results mock)
      const expResults = FHIRMocks.Search.entry.map(v => {
        return {
          codeSystem: [],
          name: v.resource.name,
          steward: v.resource.publisher,
          oid: v.resource.id,
          codeCount: 33,
          description: v.resource.description || '',
          experimental: v.resource.experimental || false,
          date: v.resource.date || '',
          lastReviewDate:
            v.resource.extension?.find(e => e.url === 'http://hl7.org/fhir/StructureDefinition/resource-lastReviewDate')
              ?.valueDate || '',
          purpose: null // Note: purpose construction tested separately
        };
      });
      return result.then(res => expect(res).to.eql({ total: 67, count: 50, page: 1, results: expResults }));
    });

    it('should construct purpose object if specified purpose matches expected format', () => {
      const [username, password] = ['test-user', 'test-pass'];
      nock('https://cts.nlm.nih.gov')
        .get(/ValueSet/)
        .reply(200, FHIRMocks.SearchWithPurpose);
      nock('https://cts.nlm.nih.gov')
        .get(/expand/)
        .times(67)
        .reply(200, FHIRMocks.ValueSetWithCounts);
      const result = client.searchForValueSets('Diabetes', username, password);
      const expResults = FHIRMocks.SearchWithPurpose.entry.map(v => {
        return {
          codeSystem: [],
          name: v.resource.name,
          steward: v.resource.publisher,
          oid: v.resource.id,
          codeCount: 33,
          description: v.resource.description || '',
          experimental: v.resource.experimental || false,
          date: v.resource.date || '',
          lastReviewDate:
            v.resource.extension?.find(e => e.url === 'http://hl7.org/fhir/StructureDefinition/resource-lastReviewDate')
              ?.valueDate || '',
          purpose: null // purpose added next for the first entries where it is defined
        };
      });

      // purpose matches format so parses out meaning
      expResults[0].purpose = {
        clinicalFocus: 'CPT codes for AETNA Diabetes: Hemoglobin A1c testing measure numerator',
        dataElementScope: 'Codes defined in measure.', // trims white space
        inclusionCriteria: 'Codes \rdefined in \nmeasure.', // handles \r and \n
        exclusionCriteria: `None specified (TBD).` // handles () chars within content
      };
      // purpose is defined but doesn't match format so leaves it as is
      expResults[1].purpose = {
        purpose: 'A different format purpose definition'
      };
      // expResults[2] has no purpose, so it stays null
      // expResults[3] has no meaningful content within the expected format, so it stays null

      return result.then(res => expect(res).to.eql({ total: 4, count: 4, page: 1, results: expResults }));
    });
  });

  describe('#getOneValueSet', () => {
    it('should get a list of one valueset with good credentials', () => {
      const [username, password] = ['test-user', 'test-pass'];
      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/2.16.840.1.113762.1.4.1').reply(200, '');
      const result = client.getOneValueSet(username, password);
      // No data manipulation happens in this function. The request should succeed and return the result.
      return result.then(res => expect(res).to.exist);
    });

    it('should handle bad authentication and send 401 back', () => {
      const [username, password] = ['test-user', 'test-wrong-pass'];
      nock('https://cts.nlm.nih.gov').get('/fhir/ValueSet/2.16.840.1.113762.1.4.1').reply(401, '');
      const result = client.getOneValueSet(username, password);
      // No data manipulation happens in this function. The request should success and return the result.
      return shouldThrowError(result, 401);
    });
  });
});
