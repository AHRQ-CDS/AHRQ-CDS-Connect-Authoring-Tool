const request = require('supertest');
const sandbox = require('sinon').createSandbox();
const { mock, replace, fake } = sandbox;
const { setupExpressApp } = require('./utils');
const UserSettings = require('../../src/models/userSettings');

describe('Route: /authoring/api/settings', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return settings for authenticated users with settings', done => {
      replace(
        UserSettings,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({
            exec: fake.resolves([new UserSettings({ user: 'bob', termsAcceptedDate: '2023-04-05' })])
          })
      );
      request(app)
        .get('/authoring/api/settings')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, { termsAcceptedDate: '2023-04-05T00:00:00.000Z' }, done);
    });

    it('should return HTTP 500 if there is an error finding', done => {
      replace(
        UserSettings,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({
            exec: fake.rejects(new Error('Connection Error'))
          })
      );
      request(app).get('/authoring/api/settings').set('Accept', 'application/json').expect(500, done);
    });

    it('should return HTTP 404 for authenticated users without settings', done => {
      replace(
        UserSettings,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({
            exec: fake.resolves([])
          })
      );
      request(app)
        .get('/authoring/api/settings')
        .set('Accept', 'application/json')
        .expect('Content-Type', /text/)
        .expect(404, done);
    });

    it('should return HTTP 500 for authenticated users with multiple settings', done => {
      replace(
        UserSettings,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({
            exec: fake.resolves([
              new UserSettings({ user: 'bob', termsAcceptedDate: '2023-04-05' }),
              new UserSettings({ user: 'bob', termsAcceptedDate: '2023-06-01' })
            ])
          })
      );
      request(app)
        .get('/authoring/api/settings')
        .set('Accept', 'application/json')
        .expect('Content-Type', /text/)
        .expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .get('/authoring/api/settings')
        .set('Accept', 'application/json')
        .expect('Content-Type', /text/)
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });

  describe('PUT', () => {
    it('should upsert settings for authenticated users', done => {
      replace(
        UserSettings,
        'findOneAndUpdate',
        mock('findOneAndUpdate')
          .withArgs({ user: 'bob' }, { $set: { termsAcceptedDate: '2023-04-05' } }, { upsert: true, new: true })
          .returns({
            exec: fake.resolves(new UserSettings({ user: 'bob', termsAcceptedDate: '2023-04-05' }))
          })
      );
      request(app)
        .put('/authoring/api/settings')
        .send({ termsAcceptedDate: '2023-04-05' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, { termsAcceptedDate: '2023-04-05T00:00:00.000Z' }, done);
    });

    it('should return HTTP 500 if there is an error upserting', done => {
      replace(
        UserSettings,
        'findOneAndUpdate',
        mock('findOneAndUpdate')
          .withArgs({ user: 'bob' }, { $set: { termsAcceptedDate: '2023-04-05' } }, { upsert: true, new: true })
          .returns({
            exec: fake.rejects(new Error('Connection Error'))
          })
      );
      request(app)
        .put('/authoring/api/settings')
        .send({ termsAcceptedDate: '2023-04-05' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .put('/authoring/api/settings')
        .send({ termsAcceptedDate: '2023-04-05' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /text/)
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });
});
