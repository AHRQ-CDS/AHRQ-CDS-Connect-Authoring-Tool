const request = require('supertest');
const sandbox = require('sinon').createSandbox();
const { stub } = sandbox;
const { setupExpressApp, importChaiExpect } = require('../utils');
const config = require('../../src/config');

describe('Route: /authoring/api/foresee.js', () => {
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
    it('should get the foresee staging embed script when it is configured', done => {
      stub(config, 'get').withArgs('foreSee.active').returns(true);
      config.get.callThrough();

      request(app)
        .get('/authoring/api/foresee.js')
        .expect('Content-Type', /javascript/)
        .expect(200)
        .expect(res => {
          expect(res.text).to.match(/ForeSee Staging Embed Script/);
        })
        .end(done);
    });

    it('should not get the foresee staging embed script when it is not configured', done => {
      stub(config, 'get').withArgs('foreSee.active').returns(false);
      config.get.callThrough();

      request(app)
        .get('/authoring/api/foresee.js')
        .expect('Content-Type', /javascript/)
        .expect(200)
        .expect(res => {
          expect(res.text).to.match(/ForeSee not configured/);
        })
        .end(done);
    });
  });
});
