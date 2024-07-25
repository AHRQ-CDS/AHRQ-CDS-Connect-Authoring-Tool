const request = require('supertest');
const sandbox = require('sinon').createSandbox();
const { assert, fake, mock, replace } = sandbox;
const { setupExpressApp } = require('../utils');
const FHIRClient = require('../../src/vsac/FHIRClient');
const HL7AdministrativeGenderVS = require('./fixtures/hl7-administrative-gender-vs.json');
const HyperproinsulinemiaCode = require('./fixtures/hyperproinsulinemia-code.json');
const ONCAdministrativeSexFhirVS = require('./fixtures/onc-administrative-sex-fhir-vs.json');
const VSSearchResults = require('./fixtures/vs-search-results.json');

describe('Route: /authoring/api/fhir/login', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('POST', () => {
    it('should login to VSAC when proper credentials are supplied', done => {
      replace(
        FHIRClient,
        'getOneValueSet',
        mock('getOneValueSet').withArgs('', 'my-api-key').resolves(ONCAdministrativeSexFhirVS)
      );
      request(app)
        .post('/authoring/api/fhir/login')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .expect(200, done);
    });

    it('should login to VSAC when proper credentials are supplied even when VS is not found', done => {
      replace(
        FHIRClient,
        'getOneValueSet',
        mock('getOneValueSet')
          .withArgs('', 'my-api-key')
          .rejects({ response: { status: 404 } })
      );
      request(app)
        .post('/authoring/api/fhir/login')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .expect(200, done);
    });

    it('should return HTTP 401 when wrong credentials are supplied', done => {
      replace(
        FHIRClient,
        'getOneValueSet',
        mock('getOneValueSet')
          .withArgs('', 'my-wrong-api-key')
          .rejects({ response: { status: 401 } })
      );
      request(app)
        .post('/authoring/api/fhir/login')
        .set('Authorization', `Basic ${Buffer.from(':my-wrong-api-key').toString('base64')}`)
        .expect(401, done);
    });

    it('should return HTTP 401 when no credentials are supplied', done => {
      const clientFake = fake.rejects('should not be called');
      replace(FHIRClient, 'getOneValueSet', clientFake);
      request(app)
        .post('/authoring/api/fhir/login')
        .expect(401)
        .expect(() => {
          assert.notCalled(clientFake);
        })
        .end(done);
    });

    it('should relay any error code from the VSAC FHIR API', done => {
      replace(
        FHIRClient,
        'getOneValueSet',
        mock('getOneValueSet')
          .withArgs('', 'my-api-key')
          .rejects({ response: { status: 502 } })
      );
      request(app)
        .post('/authoring/api/fhir/login')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .expect(502, done);
    });

    it('should return HTTP 500 when unknown error occurs w/ no response code from VSAC FHIR API', done => {
      replace(FHIRClient, 'getOneValueSet', mock('getOneValueSet').withArgs('', 'my-api-key').rejects(new Error()));
      request(app)
        .post('/authoring/api/fhir/login')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .expect(500, done);
    });
  });
});

describe('Route: /authoring/api/fhir/search', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return search results', done => {
      replace(
        FHIRClient,
        'searchForValueSets',
        mock('searchForValueSets').withArgs('administrative', '', 'my-api-key').resolves(VSSearchResults)
      );
      request(app)
        .get('/authoring/api/fhir/search?keyword=administrative')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, VSSearchResults, done);
    });

    it('should return HTTP 401 when wrong credentials are supplied', done => {
      replace(
        FHIRClient,
        'searchForValueSets',
        mock('searchForValueSets')
          .withArgs('administrative', '', 'my-api-key')
          .rejects({ response: { status: 401 } })
      );
      request(app)
        .get('/authoring/api/fhir/search?keyword=administrative')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect(401, done);
    });

    it('should return HTTP 401 when no credentials are supplied', done => {
      const clientFake = fake.rejects('should not be called');
      replace(FHIRClient, 'searchForValueSets', clientFake);
      request(app)
        .get('/authoring/api/fhir/search?keyword=administrative')
        .set('Accept', 'application/json')
        .expect(401)
        .expect(() => {
          assert.notCalled(clientFake);
        })
        .end(done);
    });

    it('should relay any error code from the VSAC FHIR API', done => {
      replace(
        FHIRClient,
        'searchForValueSets',
        mock('searchForValueSets')
          .withArgs('administrative', '', 'my-api-key')
          .rejects({ response: { status: 502 } })
      );
      request(app)
        .get('/authoring/api/fhir/search?keyword=administrative')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect(502, done);
    });

    it('should return HTTP 500 when unknown error occurs w/ no response code from VSAC FHIR API', done => {
      replace(
        FHIRClient,
        'searchForValueSets',
        mock('searchForValueSets').withArgs('administrative', '', 'my-api-key').rejects(new Error())
      );
      request(app)
        .get('/authoring/api/fhir/search?keyword=administrative')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect(500, done);
    });
  });
});

describe('Route: /authoring/api/fhir/vs/:id', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return requested value set', done => {
      replace(
        FHIRClient,
        'getValueSet',
        mock('getValueSet').withArgs('2.16.840.1.113883.1.11.1', '', 'my-api-key').resolves(HL7AdministrativeGenderVS)
      );
      request(app)
        .get('/authoring/api/fhir/vs/2.16.840.1.113883.1.11.1')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, HL7AdministrativeGenderVS, done);
    });

    it('should return HTTP 401 when wrong credentials are supplied', done => {
      replace(
        FHIRClient,
        'getValueSet',
        mock('getValueSet')
          .withArgs('2.16.840.1.113883.1.11.1', '', 'my-api-key')
          .rejects({ response: { status: 401 } })
      );
      request(app)
        .get('/authoring/api/fhir/vs/2.16.840.1.113883.1.11.1')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect(401, done);
    });

    it('should return HTTP 401 when no credentials are supplied', done => {
      const clientFake = fake.rejects('should not be called');
      replace(FHIRClient, 'getValueSet', clientFake);
      request(app)
        .get('/authoring/api/fhir/vs/2.16.840.1.113883.1.11.1')
        .set('Accept', 'application/json')
        .expect(401)
        .expect(() => {
          assert.notCalled(clientFake);
        })
        .end(done);
    });

    it('should relay any error code from the VSAC FHIR API', done => {
      replace(
        FHIRClient,
        'getValueSet',
        mock('getValueSet')
          .withArgs('2.16.840.1.113883.1.11.1', '', 'my-api-key')
          .rejects({ response: { status: 404 } })
      );
      request(app)
        .get('/authoring/api/fhir/vs/2.16.840.1.113883.1.11.1')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should return HTTP 500 when unknown error occurs w/ no response code from VSAC FHIR API', done => {
      replace(
        FHIRClient,
        'getValueSet',
        mock('getValueSet').withArgs('2.16.840.1.113883.1.11.1', '', 'my-api-key').rejects(new Error())
      );
      request(app)
        .get('/authoring/api/fhir/vs/2.16.840.1.113883.1.11.1')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect(500, done);
    });
  });
});

describe('Route: /authoring/api/fhir/code', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return search results', done => {
      replace(
        FHIRClient,
        'getCode',
        mock('getCode')
          .withArgs('237613005', 'http://snomed.info/sct', '', 'my-api-key')
          .resolves(HyperproinsulinemiaCode)
      );
      request(app)
        .get('/authoring/api/fhir/code?code=237613005&system=http:%2F%2Fsnomed.info%2Fsct')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, HyperproinsulinemiaCode, done);
    });

    it('should return HTTP 401 when wrong credentials are supplied', done => {
      replace(
        FHIRClient,
        'getCode',
        mock('getCode')
          .withArgs('237613005', 'http://snomed.info/sct', '', 'my-api-key')
          .rejects({ response: { status: 401 } })
      );
      request(app)
        .get('/authoring/api/fhir/code?code=237613005&system=http:%2F%2Fsnomed.info%2Fsct')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect(401, done);
    });

    it('should return HTTP 401 when no credentials are supplied', done => {
      const clientFake = fake.rejects('should not be called');
      replace(FHIRClient, 'getCode', clientFake);
      request(app)
        .get('/authoring/api/fhir/code?code=237613005&system=http:%2F%2Fsnomed.info%2Fsct')
        .set('Accept', 'application/json')
        .expect(401)
        .expect(() => {
          assert.notCalled(clientFake);
        })
        .end(done);
    });

    it('should relay any error code from the VSAC FHIR API', done => {
      replace(
        FHIRClient,
        'getCode',
        mock('getCode')
          .withArgs('237613005', 'http://snomed.info/sct', '', 'my-api-key')
          .rejects({ response: { status: 404 } })
      );
      request(app)
        .get('/authoring/api/fhir/code?code=237613005&system=http:%2F%2Fsnomed.info%2Fsct')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should return HTTP 500 when unknown error occurs w/ no response code from VSAC FHIR API', done => {
      replace(
        FHIRClient,
        'getCode',
        mock('getCode').withArgs('237613005', 'http://snomed.info/sct', '', 'my-api-key').rejects(new Error())
      );
      request(app)
        .get('/authoring/api/fhir/code?code=237613005&system=http:%2F%2Fsnomed.info%2Fsct')
        .set('Authorization', `Basic ${Buffer.from(':my-api-key').toString('base64')}`)
        .set('Accept', 'application/json')
        .expect(500, done);
    });
  });
});
