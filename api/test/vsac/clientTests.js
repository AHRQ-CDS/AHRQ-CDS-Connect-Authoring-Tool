const chai = require('chai');
//const chaiAsPromised = require("chai-as-promised");
chai.use(require("chai-as-promised"));
const expect = chai.expect;
const nock = require('nock');
const client = require('../../vsac/client');

describe('vsac/client', () =>{
  // before the tests, disable network connections to ensure tests never hit real network
  before(() => {
    // if another test suite de-activated nock, we need to re-activate it
    if (!nock.isActive()) nock.activate();
    nock.disableNetConnect()
  });

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

      // Invoke the request and verify the result
      const result = client.getTicketGrantingTicket(username, password);
      return expect(result).to.eventually.equal('TGT-TEST');
    });

    it('should handle bad authentication', () => {
      const [username, password] = ['test-user', 'test-wrong-pass'];

      // Setup the mock API server
      nock('https://vsac.nlm.nih.gov')
        .post('/vsac/ws/Ticket', { username, password })
        .reply(401, '')

      // Invoke the request and verify the result
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

      // Invoke the request and verify the result
      const result = client.getServiceTicket('TGT-TEST');
      return expect(result).to.eventually.equal('ST-TEST');
    });

    it('should handle a bad ticket granting ticket', () => {
      // Setup the mock API server
      nock('https://vsac.nlm.nih.gov')
        .post('/vsac/ws/Ticket/BAD-TGT-TEST', { service: 'http://umlsks.nlm.nih.gov' })
        .reply(401, '')

      // Invoke the request and verify the result
      const result = client.getServiceTicket('BAD-TGT-TEST');
      return expect(result).to.be.rejectedWith(/401/);
    });
  });

  describe('#getVSDetailsByOID', () => {
    it('should get a value set in JSON format', () => {
      // Setup the mock API server
      nock('https://vsac.nlm.nih.gov')
        .get('/vsac/svs/RetrieveValueSet?id=1.00.000.0.000000.0.000.0.0000&ticket=ST-TEST')
        .replyWithFile(200, `${__dirname}/fixtures/BradyBunch.xml`, { 'Content-Type': 'text/xml;charset=utf-8' });

      // Invoke the request and verify the result
      const result = client.getVSDetailsByOID('1.00.000.0.000000.0.000.0.0000', 'ST-TEST');
      return expect(result).to.eventually.eql({
        oid: '1.00.000.0.000000.0.000.0.0000',
        version: '19740308',
        displayName: 'Brady Bunch',
        codes: [
          { code: '1', codeSystem: '2.00.000.0.000000.0.0', codeSystemName: 'BRADY', codeSystemVersion: '1.00',
            displayName: 'Mike Brady' },
          { code: '2', codeSystem: '2.00.000.0.000000.0.0', codeSystemName: 'BRADY', codeSystemVersion: '1.00',
            displayName: 'Carol Brady' },
          { code: '10', codeSystem: '2.00.000.0.000000.0.0', codeSystemName: 'BRADY', codeSystemVersion: '1.00',
            displayName: 'Greg Brady' },
          { code: '11', codeSystem: '2.00.000.0.000000.0.0', codeSystemName: 'BRADY', codeSystemVersion: '1.00',
            displayName: 'Marcia Brady' },
          { code: '12', codeSystem: '2.00.000.0.000000.0.0', codeSystemName: 'BRADY', codeSystemVersion: '1.00',
            displayName: 'Peter Brady' },
          { code: '13', codeSystem: '2.00.000.0.000000.0.0', codeSystemName: 'BRADY', codeSystemVersion: '1.00',
            displayName: 'Jan Brady' },
          { code: '14', codeSystem: '2.00.000.0.000000.0.0', codeSystemName: 'BRADY', codeSystemVersion: '1.00',
            displayName: 'Bobby Brady' },
          { code: '15', codeSystem: '2.00.000.0.000000.0.0', codeSystemName: 'BRADY', codeSystemVersion: '1.00',
            displayName: 'Cindy Brady' }
        ]
      });
    });

    it('should handle a bad OID', () => {
      // Setup the mock API server
      nock('https://vsac.nlm.nih.gov')
        .get('/vsac/svs/RetrieveValueSet?id=9.99.999.9.999999.9.999.9.9999&ticket=ST-TEST')
        .reply(404, '')

      // Invoke the request and verify the result
      const result = client.getVSDetailsByOID('9.99.999.9.999999.9.999.9.9999', 'ST-TEST');
      return expect(result).to.be.rejectedWith(/404/);
    });
  });
});