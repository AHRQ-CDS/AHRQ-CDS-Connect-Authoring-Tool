const request = require('supertest');
const sandbox = require('sinon').createSandbox();
const { mock, replace, fake } = sandbox;
const { setupExpressApp, importChaiExpect } = require('../utils');
const Patient = require('../../src/models/patient');
const patientIncluded = require('./fixtures/patient-included.json');
const patientExcluded = require('./fixtures/patient-excluded.json');
const { cloneDeep } = require('lodash');

describe('Route: /authoring/api/testing', () => {
  let app, options, expect;

  before(async () => {
    [app, options] = setupExpressApp();
    expect = await importChaiExpect();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return all test patients for authenticated users', done => {
      replace(
        Patient,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({
            exec: fake.resolves([new Patient(patientIncluded), new Patient(patientExcluded)])
          })
      );
      request(app)
        .get('/authoring/api/testing')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length(2);
          expect(res.body[0]).to.eql(patientIncluded);
          expect(res.body[1]).to.eql(patientExcluded);
        })
        .end(done);
    });

    it('should return HTTP 500 if there is an error finding test patients', done => {
      replace(
        Patient,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({
            exec: fake.rejects(new Error('Connection Error'))
          })
      );
      request(app).get('/authoring/api/testing').set('Accept', 'application/json').expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .get('/authoring/api/testing')
        .set('Accept', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });

  describe('POST', () => {
    it('should create a new test patient for authenticated users', done => {
      replace(Patient, 'create', mock('create').withArgs(patientIncluded).resolves(new Patient(patientIncluded)));
      const patientIncludedNoUser = cloneDeep(patientIncluded);
      delete patientIncludedNoUser.user;
      request(app)
        .post('/authoring/api/testing')
        .send(patientIncludedNoUser)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .expect(res => {
          expect(res.body).to.eql(patientIncluded);
          expect(res.body.user).to.eql('bob'); // just to be sure
        })
        .end(done);
    });

    it('should return HTTP 500 if there is an error creating the test patient', done => {
      replace(Patient, 'create', mock('create').withArgs(patientIncluded).rejects(new Error('Connection Error')));
      const patientIncludedNoUser = cloneDeep(patientIncluded);
      delete patientIncludedNoUser.user;
      request(app)
        .post('/authoring/api/testing')
        .send(patientIncludedNoUser)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      const patientIncludedNoUser = cloneDeep(patientIncluded);
      delete patientIncludedNoUser.user;
      request(app)
        .post('/authoring/api/testing')
        .send(patientIncludedNoUser)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });
});

describe('Route: /authoring/api/testing/:patient', () => {
  let app, options, expect;

  before(async () => {
    [app, options] = setupExpressApp();
    expect = await importChaiExpect();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return single test patient for authenticated users', done => {
      replace(
        Patient,
        'find',
        mock('find')
          .withArgs({ user: 'bob', _id: '1629d0f315a38860011068c9323' })
          .returns({
            exec: fake.resolves([new Patient(patientIncluded)])
          })
      );
      request(app)
        .get('/authoring/api/testing/1629d0f315a38860011068c9323')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.eql(patientIncluded);
        })
        .end(done);
    });

    it('should return HTTP 404 if the test patient is not found', done => {
      replace(
        Patient,
        'find',
        mock('find')
          .withArgs({ user: 'bob', _id: '789' })
          .returns({
            exec: fake.resolves([])
          })
      );
      request(app).get('/authoring/api/testing/789').set('Accept', 'application/json').expect(404, done);
    });

    it('should return HTTP 500 if there is an error finding test patients', done => {
      replace(
        Patient,
        'find',
        mock('find')
          .withArgs({ user: 'bob', _id: '1629d0f315a38860011068c9323' })
          .returns({
            exec: fake.rejects(new Error('Connection Error'))
          })
      );
      request(app)
        .get('/authoring/api/testing/1629d0f315a38860011068c9323')
        .set('Accept', 'application/json')
        .expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .get('/authoring/api/testing/1629d0f315a38860011068c9323')
        .set('Accept', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });

  describe('DELETE', () => {
    it('delete a test patient for authenticated users', done => {
      replace(
        Patient,
        'deleteMany',
        mock('deleteMany')
          .withArgs({ user: 'bob', _id: '123' })
          .returns({
            exec: fake.resolves({ n: 1 })
          })
      );
      request(app).delete('/authoring/api/testing/123').expect(200, done);
    });

    it('should return HTTP 404 if the test patient does not exist', done => {
      replace(
        Patient,
        'deleteMany',
        mock('deleteMany')
          .withArgs({ user: 'bob', _id: '123' })
          .returns({
            exec: fake.resolves({ n: 0 })
          })
      );
      request(app).delete('/authoring/api/testing/123').expect(404, done);
    });

    it('should return HTTP 500 if there is an error deleting the test patient', done => {
      replace(
        Patient,
        'deleteMany',
        mock('deleteMany')
          .withArgs({ user: 'bob', _id: '123' })
          .returns({
            exec: fake.rejects(new Error('Connection Error'))
          })
      );
      request(app).delete('/authoring/api/testing/123').expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app).delete('/authoring/api/testing/123').expect('WWW-Authenticate', 'FormBased').expect(401, done);
    });
  });
});
