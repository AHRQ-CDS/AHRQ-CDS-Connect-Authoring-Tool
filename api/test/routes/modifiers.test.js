const request = require('supertest');
const sandbox = require('sinon').createSandbox();
const { mock, fake, replace } = sandbox;
const { setupExpressApp, importChaiExpect } = require('../utils');
const CQLLibrary = require('../../src/models/cqlLibrary');
const multiFunctionLib = require('./fixtures/multifunction-external-lib.json');

describe('Route: /authoring/api/modifiers/:artifact', () => {
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
    it('should return standard modifiers for authenticated users when there are no linked external libraries', done => {
      replace(
        CQLLibrary,
        'find',
        mock('find')
          .withArgs({ user: 'bob', linkedArtifactId: '123' })
          .returns({
            exec: fake.resolves([])
          })
      );
      request(app)
        .get('/authoring/api/modifiers/123')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length(66);
          // first
          expect(res.body).to.deep.include({
            id: 'VerifiedObservation',
            name: 'Verified',
            inputTypes: ['list_of_observations'],
            returnType: 'list_of_observations',
            cqlTemplate: 'BaseModifier',
            cqlLibraryFunction: 'C3F.Verified'
          });
          // middle
          expect(res.body).to.deep.include({
            id: 'ContainsDateTime',
            name: 'Contains',
            inputTypes: ['interval_of_datetime'],
            returnType: 'boolean',
            validator: { type: 'require', fields: ['date'], args: [] },
            values: {},
            cqlTemplate: 'CenterModifierDateTime',
            cqlLibraryFunction: 'contains'
          });
          // last
          expect(res.body).to.deep.include({
            id: 'CompletedServiceRequest',
            name: 'Completed',
            inputTypes: ['list_of_service_requests'],
            returnType: 'list_of_service_requests',
            cqlTemplate: 'BaseModifier',
            cqlLibraryFunction: 'C3F.CompletedServiceRequest'
          });
        })
        .end(done);
    });

    it('should return standard and custom modifiers from linked external libraries for authenticated users', done => {
      replace(
        CQLLibrary,
        'find',
        mock('find')
          .withArgs({ user: 'bob', linkedArtifactId: '603e453ad6242800116cfd6c' })
          .returns({
            exec: fake.resolves([multiFunctionLib])
          })
      );
      request(app)
        .get('/authoring/api/modifiers/603e453ad6242800116cfd6c')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length(66 + 4);
          // standard modifier
          expect(res.body).to.deep.include({
            id: 'VerifiedObservation',
            name: 'Verified',
            inputTypes: ['list_of_observations'],
            returnType: 'list_of_observations',
            cqlTemplate: 'BaseModifier',
            cqlLibraryFunction: 'C3F.Verified'
          });
          // 1st custom modifier
          expect(res.body).to.deep.include({
            id: 'Increment (from FunctionsMultiTest)',
            type: 'ExternalModifier',
            name: 'Increment (from FunctionsMultiTest)',
            inputTypes: ['integer'],
            returnType: 'integer',
            cqlTemplate: 'ExternalModifier',
            cqlLibraryFunction: '"FunctionsMultiTest"."Increment"',
            values: { value: [] },
            functionName: 'Increment',
            libraryName: 'FunctionsMultiTest',
            arguments: [
              {
                name: 'int',
                operandTypeSpecifier: {
                  localId: '4',
                  locator: '5:31-5:37',
                  resultTypeName: '{urn:hl7-org:elm-types:r1}Integer',
                  name: '{urn:hl7-org:elm-types:r1}Integer',
                  type: 'NamedTypeSpecifier'
                }
              }
            ],
            argumentTypes: [{ calculated: 'integer' }]
          });
          // Just check names of the rest
          const names = res.body.map(m => m.name);
          expect(names).to.include('SumTwo (from FunctionsMultiTest)');
          expect(names).to.include('SumThree (from FunctionsMultiTest)');
          expect(names).to.include('UseAll (from FunctionsMultiTest)');
        })
        .end(done);
    });

    it('should return standard modifiers for authenticated users when there is an error finding external libraries', done => {
      replace(
        CQLLibrary,
        'find',
        mock('find')
          .withArgs({ user: 'bob', linkedArtifactId: '123' })
          .returns({
            exec: fake.rejects('Connection Error')
          })
      );
      request(app)
        .get('/authoring/api/modifiers/123')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length(66);
        })
        .end(done);
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
});
