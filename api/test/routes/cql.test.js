const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const request = require('supertest');
const sandbox = require('sinon').createSandbox();
const { fake, mock, replace, match } = sandbox;
const { expect } = require('chai');
const { setupExpressApp } = require('./utils');
const Artifact = require('../../src/models/artifact');
const cqlHandler = require('../../src/handlers/cqlHandler');
const CQLLibrary = require('../../src/models/cqlLibrary');
const SimpleArtifact = require('./fixtures/SimpleArtifact.json');
const simpleArtifactWithDataModel = Object.assign({ dataModel: { name: 'FHIR', version: '4.0.1' } }, SimpleArtifact);

// TODO: Tests for artifacts with external CQL libraries
// TODO: More tests when CQL-to-ELM returns ELM w/ errors in annotations

describe('Route: /authoring/api/cql/', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('POST', () => {
    it('should return a zip file with compiled ELM for authenticated users', done => {
      mockCQLLibraryFindForSimpleArtifact();
      mockFormatCQLForSimpleArtifact();
      mockArtifactFindOneForSimpleArtifact();
      mockMakeCQLtoELMRequestForSimpleArtifact();
      request(app)
        .post('/authoring/api/cql/')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /zip/)
        .expect(200)
        .buffer()
        .parse(binaryParser)
        .end(function (err, res) {
          if (err) return done(err);
          unzipper.Open.buffer(res.body)
            .then(directory => {
              const files = directory.files.map(f => f.path);
              expect(files).to.have.length(7);
              expect(files).to.contain('Library-SimpleArtifact.json');
              expect(files).to.contain('SimpleArtifact.cql');
              expect(files).to.contain('SimpleArtifact.json');
              expect(files).to.contain('SimpleArtifact.xml');
              expect(files).to.contain('FHIRHelpers.cql');
              expect(files).to.contain('FHIRHelpers.json');
              expect(files).to.contain('FHIRHelpers.xml');
              done();
            })
            .catch(done);
        });
    });

    it('should still return a zip file even if CQL formatting fails', done => {
      mockCQLLibraryFindForSimpleArtifact();
      mockFormatCQLForSimpleArtifact(new Error('ConnectionError'));
      mockArtifactFindOneForSimpleArtifact();
      mockMakeCQLtoELMRequestForSimpleArtifact();
      request(app)
        .post('/authoring/api/cql/')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /zip/)
        .expect(200)
        .buffer()
        .parse(binaryParser)
        .end(function (err, res) {
          if (err) return done(err);
          unzipper.Open.buffer(res.body)
            .then(directory => {
              const files = directory.files.map(f => f.path);
              expect(files).to.have.length(7);
              expect(files).to.contain('Library-SimpleArtifact.json');
              expect(files).to.contain('SimpleArtifact.cql');
              expect(files).to.contain('SimpleArtifact.json');
              expect(files).to.contain('SimpleArtifact.xml');
              expect(files).to.contain('FHIRHelpers.cql');
              expect(files).to.contain('FHIRHelpers.json');
              expect(files).to.contain('FHIRHelpers.xml');
              done();
            })
            .catch(done);
        });
    });

    it('should return a zip without the CPG library if there is an error getting artifact details', done => {
      mockCQLLibraryFindForSimpleArtifact();
      mockFormatCQLForSimpleArtifact();
      mockArtifactFindOneForSimpleArtifact(new Error('Connection Error'));
      mockMakeCQLtoELMRequestForSimpleArtifact();
      request(app)
        .post('/authoring/api/cql/')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /zip/)
        .expect(200)
        .buffer()
        .parse(binaryParser)
        .end(function (err, res) {
          if (err) return done(err);
          unzipper.Open.buffer(res.body)
            .then(directory => {
              const files = directory.files.map(f => f.path);
              expect(files).to.have.length(6);
              expect(files).to.contain('SimpleArtifact.cql');
              expect(files).to.contain('SimpleArtifact.json');
              expect(files).to.contain('SimpleArtifact.xml');
              expect(files).to.contain('FHIRHelpers.cql');
              expect(files).to.contain('FHIRHelpers.json');
              expect(files).to.contain('FHIRHelpers.xml');
              done();
            })
            .catch(done);
        });
    });

    it('should return HTTP 500 if there is an error finding external artifacts', done => {
      mockCQLLibraryFindForSimpleArtifact(new Error('Connection Error'));
      request(app)
        .post('/authoring/api/cql/')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect(500, done);
    });

    it('should return HTTP 500 if there is an error converting CQL to ELM', done => {
      mockCQLLibraryFindForSimpleArtifact();
      mockFormatCQLForSimpleArtifact();
      mockArtifactFindOneForSimpleArtifact();
      mockMakeCQLtoELMRequestForSimpleArtifact(true, new Error('Connection Error'));
      request(app)
        .post('/authoring/api/cql/')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .post('/authoring/api/cql/')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });
});

describe('Route: /authoring/api/cql/validate', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('POST', () => {
    it('should validate ELM that has no errors for authenticated users', done => {
      mockCQLLibraryFindForSimpleArtifact();
      mockFormatCQLForSimpleArtifact();
      mockMakeCQLtoELMRequestForSimpleArtifact(false);
      request(app)
        .post('/authoring/api/cql/validate')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.keys('elmErrors', 'elmFiles');
          expect(res.body.elmErrors).to.have.length(0);
          expect(res.body.elmFiles).to.have.length(2);
        })
        .end(done);
    });

    it('should validate ELM and include CQL when requested for authenticated users', done => {
      mockCQLLibraryFindForSimpleArtifact();
      mockFormatCQLForSimpleArtifact();
      mockMakeCQLtoELMRequestForSimpleArtifact(false);
      request(app)
        .post('/authoring/api/cql/validate?includeCQL=true')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.keys('elmErrors', 'elmFiles', 'cqlFiles');
          expect(res.body.elmErrors).to.have.length(0);
          expect(res.body.elmFiles).to.have.length(2);
          expect(res.body.cqlFiles).to.have.length(1);
        })
        .end(done);
    });

    it('should still validate ELM even if CQL formatting fails', done => {
      mockCQLLibraryFindForSimpleArtifact();
      mockFormatCQLForSimpleArtifact(new Error('ConnectionError'));
      mockMakeCQLtoELMRequestForSimpleArtifact(false);
      request(app)
        .post('/authoring/api/cql/validate')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.keys('elmErrors', 'elmFiles');
          expect(res.body.elmErrors).to.have.length(0);
          expect(res.body.elmFiles).to.have.length(2);
        })
        .end(done);
    });

    it('should return HTTP 500 if there is an error finding external artifacts', done => {
      mockCQLLibraryFindForSimpleArtifact(new Error('Connection Error'));
      request(app)
        .post('/authoring/api/cql/validate')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect(500, done);
    });

    it('should return HTTP 500 if there is an error converting CQL to ELM', done => {
      mockCQLLibraryFindForSimpleArtifact();
      mockFormatCQLForSimpleArtifact();
      mockMakeCQLtoELMRequestForSimpleArtifact(false, new Error('Connection Error'));
      request(app)
        .post('/authoring/api/cql/validate')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .post('/authoring/api/cql/validate')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });
});

describe('Route: /authoring/api/cql/viewCql', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('POST', () => {
    it('should return CQL files for authenticated users', done => {
      mockCQLLibraryFindForSimpleArtifact();
      mockFormatCQLForSimpleArtifact();
      request(app)
        .post('/authoring/api/cql/viewCql')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.keys('cqlFiles');
          expect(res.body.cqlFiles).to.have.length(1);
          expect(res.body.cqlFiles[0].name).to.equal('SimpleArtifact');
          expect(res.body.cqlFiles[0].text).to.match(/library "SimpleArtifact"/);
        })
        .end(done);
    });

    it('should still return CQL files even if CQL formatting fails', done => {
      mockCQLLibraryFindForSimpleArtifact();
      mockFormatCQLForSimpleArtifact(new Error('Connection Error'));
      request(app)
        .post('/authoring/api/cql/viewCql')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.keys('cqlFiles');
          expect(res.body.cqlFiles).to.have.length(1);
          expect(res.body.cqlFiles[0].name).to.equal('SimpleArtifact');
          expect(res.body.cqlFiles[0].text).to.match(/library "SimpleArtifact"/);
        })
        .end(done);
    });

    it('should return HTTP 500 if there is an error finding external artifacts', done => {
      mockCQLLibraryFindForSimpleArtifact(new Error('Connection Error'));
      request(app)
        .post('/authoring/api/cql/viewCql')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect(500, done);
    });

    it('should return HTTP 401 for unauthenticated users', done => {
      options.user = null;
      request(app)
        .post('/authoring/api/cql/viewCql')
        .send(simpleArtifactWithDataModel)
        .set('Content-Type', 'application/json')
        .expect('WWW-Authenticate', 'FormBased')
        .expect(401, done);
    });
  });
});

function mockMakeCQLtoELMRequestForSimpleArtifact(includeXML = true, err) {
  let results;
  if (err == null) {
    results = [];
    const formats = includeXML ? ['json', 'xml'] : ['json'];
    ['FHIRHelpers', 'SimpleArtifact'].forEach(name => {
      formats.forEach(format => {
        results.push({
          name,
          content: fs.readFileSync(path.join(__dirname, 'fixtures', `${name}.elm.${format}`), 'utf-8')
        });
      });
    });
  }
  replace(
    cqlHandler,
    'makeCQLtoELMRequest',
    mock('makeCQLtoELMRequest')
      .withArgs(
        match(v => v.length === 1 && v[0].name === 'SimpleArtifact'),
        match(v => v.length === 1),
        includeXML
      )
      .yields(err, results)
  );
}

function mockArtifactFindOneForSimpleArtifact(err) {
  replace(
    Artifact,
    'findOne',
    mock('findOne')
      .withArgs({ _id: { $ne: null, $eq: '64c2ccf67124220b222f5f91' } })
      .returns({ exec: err ? fake.rejects(err) : fake.resolves(new Artifact(SimpleArtifact)) })
  );
}

function mockFormatCQLForSimpleArtifact(err) {
  replace(
    cqlHandler,
    'formatCQL',
    mock('formatCQL')
      .withArgs(match('library "SimpleArtifact"'))
      .yields(err, err ? undefined : fs.readFileSync(path.join(__dirname, 'fixtures', 'SimpleArtifact.cql'), 'utf-8'))
  );
}

function mockCQLLibraryFindForSimpleArtifact(err) {
  replace(
    CQLLibrary,
    'find',
    mock('find')
      .withArgs({ user: 'bob', linkedArtifactId: { $ne: null, $eq: '64c2ccf67124220b222f5f91' } })
      .returns({ exec: err ? fake.rejects(err) : fake.resolves([]) })
  );
}

// Special parser to convert binary stream to a buffer
function binaryParser(res, callback) {
  res.setEncoding('binary');
  res.data = '';
  res.on('data', function (chunk) {
    res.data += chunk;
  });
  res.on('end', function () {
    callback(null, Buffer.from(res.data, 'binary'));
  });
}
