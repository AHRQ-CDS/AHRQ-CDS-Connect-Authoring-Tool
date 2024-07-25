const request = require('supertest');
const passport = require('passport');
const sandbox = require('sinon').createSandbox();
const { assert, fake, replace } = sandbox;
const { setupExpressApp, importChaiExpect } = require('../utils');

describe('Route: /authoring/api/auth/login', () => {
  let app, options, fakeLogout, expect;

  before(async () => {
    expect = await importChaiExpect();
  });

  beforeEach(() => {
    fakeLogout = fake.yields();
    [app, options] = setupExpressApp(app => {
      app.use(async (req, res, next) => {
        req.logout = fakeLogout;
        next();
      });
    });
    options.user = null;
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('POST', () => {
    it('should login users w/ correct credentials', done => {
      const mockAuthInvoker = (req, res, cb) => {
        req.user = { uid: 'bob' };
        cb();
      };
      const mockAuthenticate = fake.returns(mockAuthInvoker);
      replace(passport, 'authenticate', mockAuthenticate);
      request(app)
        .post('/authoring/api/auth/login')
        .send({ username: 'bob', password: 'lemoncurd' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.include({ uid: 'bob' });
        })
        .end(done);
    });

    it('should logout an existing user before logging in', done => {
      const mockAuthInvoker = (req, res, cb) => {
        req.user = { uid: 'bob' };
        cb();
      };
      const mockAuthenticate = fake.returns(mockAuthInvoker);
      replace(passport, 'authenticate', mockAuthenticate);
      options.user = 'leroy';
      request(app)
        .post('/authoring/api/auth/login')
        .send({ username: 'bob', password: 'lemoncurd' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          assert.calledOnce(fakeLogout);
          expect(res.body).to.include({ uid: 'bob' });
        })
        .end(done);
    });

    it('should return HTTP 401 for incorrect credentials', done => {
      const mockAuthInvoker = (req, res, cb) => {
        cb('wrong!');
      };
      const mockAuthenticate = fake.returns(mockAuthInvoker);
      replace(passport, 'authenticate', mockAuthenticate);
      request(app)
        .post('/authoring/api/auth/login')
        .send({ username: 'bob', password: 'limecurd' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });

    it('should return HTTP 401 for incorrect credentials after logging out existing user', done => {
      const mockAuthInvoker = (req, res, cb) => {
        cb('wrong!');
      };
      const mockAuthenticate = fake.returns(mockAuthInvoker);
      replace(passport, 'authenticate', mockAuthenticate);
      options.user = 'leroy';
      request(app)
        .post('/authoring/api/auth/login')
        .send({ username: 'bob', password: 'limecurd' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401)
        .expect(res => {
          assert.calledOnce(fakeLogout);
        })
        .end(done);
    });
  });
});

describe('Route: /authoring/api/auth/logout', () => {
  let app, options, fakeLogout;

  beforeEach(() => {
    fakeLogout = fake.yields();
    [app, options] = setupExpressApp(app => {
      app.use(async (req, res, next) => {
        req.logout = fakeLogout;
        next();
      });
    });
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should logout users', done => {
      request(app)
        .get('/authoring/api/auth/logout')
        .expect(200)
        .expect(() => {
          assert.calledOnce(fakeLogout);
        })
        .end(done);
    });
  });
});

describe('Route: /authoring/api/auth/user', () => {
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
    it('should get the current user', done => {
      request(app)
        .get('/authoring/api/auth/user')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.include({ uid: 'bob' });
        })
        .end(done);
    });

    it('should return HTTP 401 if the user is not logged in', done => {
      options.user = null;
      request(app)
        .get('/authoring/api/auth/user')
        .set('Accept', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });
});
