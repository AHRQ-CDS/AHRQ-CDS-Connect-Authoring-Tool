const chai = require('chai');
//const chaiAsPromised = require("chai-as-promised");
chai.use(require("chai-as-promised"));
const expect = chai.expect;
const nock = require('nock');
const client = require('../../vsac/client');

describe('vsac/client', () =>{
  // before the tests, disable network connections to ensure tests never hit real network
  before(() => nock.disableNetConnect());

  // after the tests, re-enable network connections
  after(() => {
    nock.restore();
    nock.enableNetConnect();
  })

  // after each test, check and clean nock
  afterEach(() => {
    nock.isDone();
    nock.cleanAll();
  });

  describe('#getTicketGrantingTicket', () => {
    it('should get a ticket granting ticket', () => {
      const [username, password] = ['test-user', 'test-pass'];

      // Setup the mock API server
      nock('https://vsac.nlm.nih.gov')
        .post('/vsac/ws/Ticket', { username, password })
        .reply(200, 'TGT-TEST')

      const result = client.getTicketGrantingTicket(username, password);
      return expect(result).to.eventually.equal('TGT-TEST');
    });

    it('should handle bad authentication', () => {
      const [username, password] = ['test-user', 'test-wrong-pass'];

      // Setup the mock API server
      nock('https://vsac.nlm.nih.gov')
        .post('/vsac/ws/Ticket', { username, password })
        .reply(401, '')

      const result = client.getTicketGrantingTicket(username, password);
      return expect(result).to.be.rejectedWith(/401/);
    });
  });

  describe('#getServiceTicket', () => {
    it('should get a service ticket', () => {
      // Setup the mock API server
      nock('https://vsac.nlm.nih.gov')
        .post('/vsac/ws/Ticket/TGT-TEST', { service: 'http://umlsks.nlm.nih.gov' })
        .reply(200, 'ST-TEST')

      const result = client.getServiceTicket('TGT-TEST');
      return expect(result).to.eventually.equal('ST-TEST');
    });

    it('should handle a bad tocket granting ticket', () => {
      // Setup the mock API server
      nock('https://vsac.nlm.nih.gov')
        .post('/vsac/ws/Ticket/BAD-TGT-TEST', { service: 'http://umlsks.nlm.nih.gov' })
        .reply(401, '')

      const result = client.getServiceTicket('BAD-TGT-TEST');
      return expect(result).to.be.rejectedWith(/401/);
    });
  });
});