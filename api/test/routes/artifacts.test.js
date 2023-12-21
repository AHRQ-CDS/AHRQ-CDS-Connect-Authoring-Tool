const request = require('supertest');
const sandbox = require('sinon').createSandbox();
const mongoose = require('mongoose');
const { fake, mock, replace } = sandbox;
const { expect } = require('chai');
const { setupExpressApp } = require('./utils');
const Artifact = require('../../src/models/artifact');
const CQLLibrary = require('../../src/models/cqlLibrary');

describe('Route: /authoring/api/artifacts/', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return all artifacts for authenticated users', done => {
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({
            exec: fake.resolves([new Artifact({ name: 'Artifact A' }), new Artifact({ name: 'Artifact B' })])
          })
      );
      request(app)
        .get('/authoring/api/artifacts')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length(2);
          expect(res.body[0]).to.include({ name: 'Artifact A' });
          expect(res.body[1]).to.include({ name: 'Artifact B' });
        })
        .end(done);
    });

    it('should return HTTP 500 if there is an error finding artifacts', done => {
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({ exec: fake.rejects(new Error('Connection Error')) })
      );
      request(app).get('/authoring/api/artifacts').set('Accept', 'application/json').expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .get('/authoring/api/artifacts')
        .set('Accept', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });

  describe('POST', () => {
    it('should create a new artifact for authenticated users', done => {
      replace(
        Artifact,
        'create',
        mock('create')
          .withArgs({ user: 'bob', name: 'Artifact A' })
          .resolves(new Artifact({ user: 'bob', name: 'Artifact A' }))
      );
      request(app)
        .post('/authoring/api/artifacts')
        .send({ name: 'Artifact A' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .expect(res => {
          expect(res.body).to.include({ name: 'Artifact A' });
        })
        .end(done);
    });

    it('should return HTTP 500 if there is an error creating the artifact', done => {
      replace(
        Artifact,
        'create',
        mock('create').withArgs({ user: 'bob', name: 'Artifact A' }).rejects(new Error('Connection Error'))
      );
      request(app)
        .post('/authoring/api/artifacts')
        .send({ name: 'Artifact A' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .post('/authoring/api/artifacts')
        .send({ name: 'Artifact A' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });

  describe('PUT', () => {
    it('update an artifact for authenticated users', done => {
      replace(
        Artifact,
        'updateOne',
        mock('updateOne')
          .withArgs({ user: 'bob', _id: '123' }, { $set: { _id: '123', name: 'Artifact A' } })
          .returns({ exec: fake.resolves({ n: 1 }) })
      );
      request(app)
        .put('/authoring/api/artifacts')
        .send({ _id: '123', name: 'Artifact A' })
        .set('Content-Type', 'application/json')
        .expect(200, done);
    });

    it('should return HTTP 404 if the artifact is not found', done => {
      replace(
        Artifact,
        'updateOne',
        mock('updateOne')
          .withArgs({ user: 'bob', _id: '123' }, { $set: { _id: '123', name: 'Artifact A' } })
          .returns({ exec: fake.resolves({ n: 0 }) })
      );
      request(app)
        .put('/authoring/api/artifacts')
        .send({ _id: '123', name: 'Artifact A' })
        .set('Content-Type', 'application/json')
        .expect(404, done);
    });

    it('should return HTTP 500 if there is an error updating the artifact', done => {
      replace(
        Artifact,
        'updateOne',
        mock('updateOne')
          .withArgs({ user: 'bob', _id: '123' }, { $set: { _id: '123', name: 'Artifact A' } })
          .returns({ exec: fake.rejects(new Error('Connection Error')) })
      );
      request(app)
        .put('/authoring/api/artifacts')
        .send({ _id: '123', name: 'Artifact A' })
        .set('Content-Type', 'application/json')
        .expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .put('/authoring/api/artifacts')
        .send({ _id: '123', name: 'Artifact A' })
        .set('Content-Type', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });
});

describe('Route: /authoring/api/artifacts/:artifact', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return single artifact for authenticated users', done => {
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob', _id: '123' })
          .returns({ exec: fake.resolves([new Artifact({ name: 'Artifact A' })]) })
      );
      request(app)
        .get('/authoring/api/artifacts/123')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.include({ name: 'Artifact A' });
        })
        .end(done);
    });

    it('should return HTTP 404 if the artifact is not found', done => {
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob', _id: '123' })
          .returns({ exec: fake.resolves([]) })
      );
      request(app).get('/authoring/api/artifacts/123').set('Accept', 'application/json').expect(404, done);
    });

    it('should return HTTP 500 if there is an error finding artifacts', done => {
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob', _id: '123' })
          .returns({ exec: fake.rejects(new Error('Connection Error')) })
      );
      request(app).get('/authoring/api/artifacts/123').set('Accept', 'application/json').expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .get('/authoring/api/artifacts/123')
        .set('Accept', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });

  describe('DELETE', () => {
    it('delete an artifact and associated libraries for authenticated users', done => {
      replace(
        Artifact,
        'deleteMany',
        mock('deleteMany')
          .withArgs({ user: 'bob', _id: '123' })
          .returns({ exec: fake.resolves({ n: 1 }) })
      );
      replace(
        CQLLibrary,
        'deleteMany',
        mock('deleteMany')
          .withArgs({ user: 'bob', linkedArtifactId: '123' })
          .returns({ exec: fake.resolves({ n: 2 }) })
      );
      request(app).delete('/authoring/api/artifacts/123').expect(200, done);
    });

    it('delete an artifact with no associated libraries for authenticated users', done => {
      replace(
        Artifact,
        'deleteMany',
        mock('deleteMany')
          .withArgs({ user: 'bob', _id: '123' })
          .returns({ exec: fake.resolves({ n: 1 }) })
      );
      replace(
        CQLLibrary,
        'deleteMany',
        mock('deleteMany')
          .withArgs({ user: 'bob', linkedArtifactId: '123' })
          .returns({ exec: fake.resolves({ n: 0 }) })
      );
      request(app).delete('/authoring/api/artifacts/123').expect(200, done);
    });

    it('should return HTTP 404 if the artifact does not exist', done => {
      replace(
        Artifact,
        'deleteMany',
        mock('deleteMany')
          .withArgs({ user: 'bob', _id: '123' })
          .returns({ exec: fake.resolves({ n: 0 }) })
      );
      request(app).delete('/authoring/api/artifacts/123').expect(404, done);
    });

    it('should return HTTP 500 if there is an error deleting the artifact', done => {
      replace(
        Artifact,
        'deleteMany',
        mock('deleteMany')
          .withArgs({ user: 'bob', _id: '123' })
          .returns({ exec: fake.rejects(new Error('Connection Error')) })
      );
      request(app).delete('/authoring/api/artifacts/123').expect(500, done);
    });

    it('should return HTTP 500 if there is an error deleting the associated libraries', done => {
      replace(Artifact, 'deleteMany', mock('deleteMany').withArgs({ user: 'bob', _id: '123' }).resolves({ n: 1 }));
      replace(
        CQLLibrary,
        'deleteMany',
        mock('deleteMany')
          .withArgs({ user: 'bob', linkedArtifactId: '123' })
          .returns({ exec: fake.rejects(new Error('Connection Error')) })
      );
      request(app).delete('/authoring/api/artifacts/123').expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app).delete('/authoring/api/artifacts/123').expect('WWW-Authenticate', 'FormBased').expect(401, done);
    });
  });
});

describe('Route: /authoring/api/artifacts/:artifact/duplicate', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('POST', () => {
    it('should create a duplicate artifact and libraries for authenticated users', done => {
      // This is tied tighter to the implementation than I'd like, but there's not a great way around that...
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({
            exec: fake.resolves([
              new Artifact({ _id: '123', user: 'bob', name: 'Artifact A' }),
              new Artifact({ _id: '456', user: 'bob', name: 'Artifact B' }),
              new Artifact({ _id: '789', user: 'bob', name: 'Artifact C' })
            ])
          })
      );
      replace(
        Artifact,
        'findById',
        mock('findById')
          .withArgs('456')
          .returns({
            exec: fake.resolves(
              new Artifact({
                _id: '456',
                user: 'bob',
                name: 'Artifact B',
                createdAt: new Date('2021-04-20T12:16:46.683Z'),
                updatedAt: new Date('2023-02-06T08:56:17.508Z')
              })
            )
          })
      );
      const fakeArtifactCreate = fake.resolves(new Artifact({ user: 'bob', name: 'Copy of Artifact B' }));
      replace(Artifact, 'create', fakeArtifactCreate);
      replace(
        CQLLibrary,
        'find',
        mock('find')
          .withArgs({ linkedArtifactId: '456' })
          .returns({
            exec: fake.resolves([
              new CQLLibrary({
                _id: 'lib1-for-456',
                linkedArtifactId: '456',
                createdAt: new Date('2021-04-22T13:56:45.673Z'),
                updatedAt: new Date('2023-02-06T09:42:17.008Z'),
                name: 'CQL Library X'
              }),
              new CQLLibrary({
                _id: 'lib2-for-456',
                linkedArtifactId: '456',
                createdAt: new Date('2021-04-22T13:57:12.597Z'),
                updatedAt: new Date('2023-02-06T09:42:56.386Z'),
                name: 'CQL Library Y'
              })
            ])
          })
      );
      const fakeLibraryCreate = fake.resolves();
      replace(CQLLibrary, 'create', fakeLibraryCreate);
      request(app)
        .post('/authoring/api/artifacts/456/duplicate')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          // Check the response
          expect(res.body).to.include({ user: 'bob', name: 'Copy of Artifact B' });
          expect(res.body._id).to.not.eql('456');
          // Ensure the duplicate artifact was created with right name and fresh id / dates
          const artifactCreateArg = fakeArtifactCreate.firstCall.firstArg;
          expect(artifactCreateArg).to.include({
            user: 'bob',
            name: 'Copy of Artifact B'
          });
          expect(artifactCreateArg._id).to.be.undefined;
          expect(artifactCreateArg.updatedAt).to.be.undefined;
          expect(artifactCreateArg.createdAt).to.be.undefined;
          // Ensure the first duplicate library was created with right linkage, right name, and fresh id / dates
          const libraryCreateArg1 = fakeLibraryCreate.firstCall.firstArg;
          expect(libraryCreateArg1).to.include.eql({
            linkedArtifactId: new mongoose.Types.ObjectId(res.body._id),
            name: 'CQL Library X'
          });
          expect(libraryCreateArg1._id).to.be.undefined;
          expect(libraryCreateArg1.updatedAt).to.be.undefined;
          expect(libraryCreateArg1.createdAt).to.be.undefined;
          // Ensure the second duplicate library was created with right linkage, right name, and fresh id / dates
          const libraryCreateArg2 = fakeLibraryCreate.secondCall.firstArg;
          expect(libraryCreateArg2).to.include.eql({
            linkedArtifactId: new mongoose.Types.ObjectId(res.body._id),
            name: 'CQL Library Y'
          });
          expect(libraryCreateArg2._id).to.be.undefined;
          expect(libraryCreateArg2.updatedAt).to.be.undefined;
          expect(libraryCreateArg2.createdAt).to.be.undefined;
        })
        .end(done);
    });

    it('should create a duplicate artifact with no libraries for authenticated users', done => {
      // This is tied tighter to the implementation than I'd like, but there's not a great way around that...
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({
            exec: fake.resolves([
              new Artifact({ _id: '123', user: 'bob', name: 'Artifact A' }),
              new Artifact({ _id: '456', user: 'bob', name: 'Artifact B' }),
              new Artifact({ _id: '789', user: 'bob', name: 'Artifact C' })
            ])
          })
      );
      replace(
        Artifact,
        'findById',
        mock('findById')
          .withArgs('456')
          .returns({
            exec: fake.resolves(
              new Artifact({
                _id: '456',
                user: 'bob',
                name: 'Artifact B',
                createdAt: new Date('2021-04-20T12:16:46.683Z'),
                updatedAt: new Date('2023-02-06T08:56:17.508Z')
              })
            )
          })
      );
      const fakeArtifactCreate = fake.resolves(new Artifact({ user: 'bob', name: 'Copy of Artifact B' }));
      replace(Artifact, 'create', fakeArtifactCreate);
      replace(
        CQLLibrary,
        'find',
        mock('find')
          .withArgs({ linkedArtifactId: '456' })
          .returns({ exec: fake.resolves([]) })
      );
      const fakeLibraryCreate = fake.resolves();
      replace(CQLLibrary, 'create', fakeLibraryCreate);
      request(app)
        .post('/authoring/api/artifacts/456/duplicate')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          // Check the response
          expect(res.body).to.include({ user: 'bob', name: 'Copy of Artifact B' });
          expect(res.body._id).to.not.eql('456');
          // Ensure the duplicate artifact was created with right name and fresh id / dates
          const artifactCreateArg = fakeArtifactCreate.firstCall.firstArg;
          expect(artifactCreateArg).to.include({
            user: 'bob',
            name: 'Copy of Artifact B'
          });
          expect(artifactCreateArg._id).to.be.undefined;
          expect(artifactCreateArg.updatedAt).to.be.undefined;
          expect(artifactCreateArg.createdAt).to.be.undefined;
          // Ensure that no libraries were created
          expect(fakeLibraryCreate.notCalled).to.be.true;
        })
        .end(done);
    });

    it('should return HTTP 404 if the artifact cannot be found', done => {
      // This is tied tighter to the implementation than I'd like, but there's not a great way around that...
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({
            exec: fake.resolves([
              new Artifact({ _id: '123', user: 'bob', name: 'Artifact A' }),
              new Artifact({ _id: '456', user: 'bob', name: 'Artifact B' }),
              new Artifact({ _id: '789', user: 'bob', name: 'Artifact C' })
            ])
          })
      );
      replace(
        Artifact,
        'findById',
        mock('findById')
          .withArgs('456')
          .returns({ exec: fake.resolves([]) })
      );
      request(app).post('/authoring/api/artifacts/456/duplicate').set('Accept', 'application/json').expect(404, done);
    });

    it("should return HTTP 500 if there is an error finding the user's artifacts", done => {
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .returns({ exec: fake.rejects(new Error('Connection Error')) })
      );
      request(app).post('/authoring/api/artifacts/456/duplicate').set('Accept', 'application/json').expect(500, done);
    });

    it('should return HTTP 500 if there is an error finding the specific artifacts', done => {
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .resolves([
            new Artifact({ _id: '123', user: 'bob', name: 'Artifact A' }),
            new Artifact({ _id: '456', user: 'bob', name: 'Artifact B' }),
            new Artifact({ _id: '789', user: 'bob', name: 'Artifact C' })
          ])
      );
      replace(
        Artifact,
        'findById',
        mock('findById')
          .withArgs('456')
          .returns({ exec: fake.rejects(new Error('Connection Error')) })
      );
      request(app).post('/authoring/api/artifacts/456/duplicate').set('Accept', 'application/json').expect(500, done);
    });

    it('should return HTTP 500 if there is an error creating the duplicate artifact', done => {
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .resolves([
            new Artifact({ _id: '123', user: 'bob', name: 'Artifact A' }),
            new Artifact({ _id: '456', user: 'bob', name: 'Artifact B' }),
            new Artifact({ _id: '789', user: 'bob', name: 'Artifact C' })
          ])
      );
      replace(
        Artifact,
        'findById',
        mock('findById')
          .withArgs('456')
          .resolves(
            new Artifact({
              _id: '456',
              user: 'bob',
              name: 'Artifact B',
              createdAt: new Date('2021-04-20T12:16:46.683Z'),
              updatedAt: new Date('2023-02-06T08:56:17.508Z')
            })
          )
      );
      const fakeArtifactCreate = fake.rejects(new Error('Unexpected Error'));
      replace(Artifact, 'create', fakeArtifactCreate);
      request(app).post('/authoring/api/artifacts/456/duplicate').set('Accept', 'application/json').expect(500, done);
    });

    it('should return HTTP 500 if there is an error creating a duplicate library', done => {
      // This is tied tighter to the implementation than I'd like, but there's not a great way around that...
      replace(
        Artifact,
        'find',
        mock('find')
          .withArgs({ user: 'bob' })
          .resolves([
            new Artifact({ _id: '123', user: 'bob', name: 'Artifact A' }),
            new Artifact({ _id: '456', user: 'bob', name: 'Artifact B' }),
            new Artifact({ _id: '789', user: 'bob', name: 'Artifact C' })
          ])
      );
      replace(
        Artifact,
        'findById',
        mock('findById')
          .withArgs('456')
          .resolves(
            new Artifact({
              _id: '456',
              user: 'bob',
              name: 'Artifact B',
              createdAt: new Date('2021-04-20T12:16:46.683Z'),
              updatedAt: new Date('2023-02-06T08:56:17.508Z')
            })
          )
      );
      const fakeArtifactCreate = fake.resolves(new Artifact({ user: 'bob', name: 'Copy of Artifact B' }));
      replace(Artifact, 'create', fakeArtifactCreate);
      replace(
        CQLLibrary,
        'find',
        mock('find')
          .withArgs({ linkedArtifactId: '456' })
          .resolves([
            new CQLLibrary({
              _id: 'lib1-for-456',
              linkedArtifactId: '456',
              createdAt: new Date('2021-04-22T13:56:45.673Z'),
              updatedAt: new Date('2023-02-06T09:42:17.008Z'),
              name: 'CQL Library X'
            })
          ])
      );
      const fakeLibraryCreate = fake.rejects(new Error('Connection Error'));
      replace(CQLLibrary, 'create', fakeLibraryCreate);
      request(app).post('/authoring/api/artifacts/456/duplicate').set('Accept', 'application/json').expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .post('/authoring/api/artifacts/456/duplicate')
        .set('Accept', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });
});
