const path = require('path');
const rewire = require('rewire');
const sinon = require('sinon');
const { importChaiExpect } = require('../utils');

// rewire configPassport so we can set private module variables
const configPassport = rewire('../../src/auth/configPassport');
// eslint-disable-next-line no-underscore-dangle
const getLdapConfiguration = configPassport.__get__('getLdapConfiguration');
// eslint-disable-next-line no-underscore-dangle
const getLocalConfiguration = configPassport.__get__('getLocalConfiguration');

describe('configPassport', () => {
  let expect;
  before(async () => {
    expect = await importChaiExpect();
  });

  describe('#getLdapConfiguration', () => {
    let config;
    beforeEach(() => {
      // Replace the require(../config) w/ a simplified version containing just what we need
      config = {
        auth: {
          ldap: {
            active: true,
            server: {
              url: 'ldap://localhost:389',
              bindDN: 'uid={{username}},ou=People,dc=example,dc=org',
              bindCredentials: '{{password}}',
              searchBase: 'ou=passport-ldapauth',
              searchFilter: '(uid={{username}})'
            }
          }
        }
      };
      // eslint-disable-next-line no-underscore-dangle
      configPassport.__set__({ config: { get: sinon.fake(path => (path === 'auth.ldap' ? config.auth.ldap : null)) } });
    });

    it('should replace the LDAP username and password placeholders with values from the request', done => {
      const req = { body: { username: 'bob', password: 'lemoncurd' } };
      getLdapConfiguration(req, (err, ldapConfig) => {
        expect(err).to.be.null;
        expect(ldapConfig).to.eql({
          active: true,
          server: {
            url: 'ldap://localhost:389',
            bindDN: 'uid=bob,ou=People,dc=example,dc=org',
            bindCredentials: 'lemoncurd',
            searchBase: 'ou=passport-ldapauth',
            searchFilter: '(uid=bob)'
          }
        });
        done();
      });
    });

    it('should replace the LDAP username and password placeholders with values from the request that have special characters', done => {
      const req = { body: { username: 'bob\\bob', password: '"lemon" curd' } };
      getLdapConfiguration(req, (err, ldapConfig) => {
        expect(err).to.be.null;
        expect(ldapConfig).to.eql({
          active: true,
          server: {
            url: 'ldap://localhost:389',
            bindDN: 'uid=bob\\bob,ou=People,dc=example,dc=org',
            bindCredentials: '"lemon" curd',
            searchBase: 'ou=passport-ldapauth',
            searchFilter: '(uid=bob\\bob)'
          }
        });
        done();
      });
    });

    it('should replace the ca file references with file contents', done => {
      config.auth.ldap.server.tlsOptions = {
        ca: [path.join(__dirname, 'fixtures', 'ca1.crt'), path.join(__dirname, 'fixtures', 'ca2.crt')],
        rejectUnauthorized: true
      };
      const req = { body: { username: 'bob', password: 'lemoncurd' } };
      getLdapConfiguration(req, (err, ldapConfig) => {
        expect(err).to.be.null;
        expect(ldapConfig.server.tlsOptions).to.eql({
          ca: [Buffer.from('Fake Cert One', 'utf-8'), Buffer.from('Fake Cert Two', 'utf-8')],
          rejectUnauthorized: true
        });
        done();
      });
    });

    it('should skip ca file references that it cannot load', done => {
      config.auth.ldap.server.tlsOptions = {
        ca: ['first-bad-path', path.join(__dirname, 'fixtures', 'ca1.crt'), 'last-bad-path'],
        rejectUnauthorized: true
      };
      const req = { body: { username: 'bob', password: 'lemoncurd' } };
      getLdapConfiguration(req, (err, ldapConfig) => {
        expect(err).to.be.null;
        expect(ldapConfig.server.tlsOptions).to.eql({
          ca: [Buffer.from('Fake Cert One', 'utf-8')],
          rejectUnauthorized: true
        });
        done();
      });
    });
  });

  describe('#getLocalConfiguration', () => {
    it('should callback with the user when username and passwords match', done => {
      const findLocalUserById = sinon.fake.yields(null, { username: 'bob', password: 'lemoncurd' });
      // eslint-disable-next-line no-underscore-dangle
      configPassport.__set__({ findLocalUserById });
      getLocalConfiguration('bob', 'lemoncurd', (err, user) => {
        expect(findLocalUserById.calledWith('bob')).to.be.true;
        expect(err).to.be.null;
        expect(user).to.eql({ username: 'bob', password: 'lemoncurd' });
        done();
      });
    });

    it('should callback with the false when passwords do not match', done => {
      const findLocalUserById = sinon.fake.yields(null, { username: 'bob', password: 'lemoncurd' });
      // eslint-disable-next-line no-underscore-dangle
      configPassport.__set__({ findLocalUserById });
      getLocalConfiguration('bob', 'lemonyogurt', (err, user) => {
        expect(findLocalUserById.calledWith('bob')).to.be.true;
        expect(err).to.be.null;
        expect(user).to.be.false;
        done();
      });
    });

    it('should callback with the false when user is not found', done => {
      const findLocalUserById = sinon.fake.yields(null, null);
      // eslint-disable-next-line no-underscore-dangle
      configPassport.__set__({ findLocalUserById });
      getLocalConfiguration('bob', 'lemoncurd', (err, user) => {
        expect(findLocalUserById.calledWith('bob')).to.be.true;
        expect(err).to.be.null;
        expect(user).to.be.false;
        done();
      });
    });

    it('should callback with error if findLocalUserById returns an error', done => {
      const findLocalUserById = sinon.fake.yields('oopsy', null);
      // eslint-disable-next-line no-underscore-dangle
      configPassport.__set__({ findLocalUserById });
      getLocalConfiguration('bob', 'lemoncurd', (err, user) => {
        expect(findLocalUserById.calledWith('bob')).to.be.true;
        expect(err).to.equal('oopsy');
        expect(user).to.be.undefined;
        done();
      });
    });
  });
});
