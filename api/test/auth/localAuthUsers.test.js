const rewire = require('rewire');
const { importChaiExpect } = require('../utils');

// rewire localAuthUsers so we can set private module variables
const localAuthUsers = rewire('../../src/auth/localAuthUsers');
// eslint-disable-next-line no-underscore-dangle
localAuthUsers.__set__({
  // Since the users get set from a local file relative to the working directory,
  // there isn't a good way to override that, so just set these vars directly
  users: { bob: 'p@$$w0rd!', sue: '1l0v3h0r$3$!' },
  userNames: ['bob', 'sue']
});
const findByUsername = localAuthUsers.findByUsername;

describe('localAuthUsers', () => {
  let expect;
  before(async () => {
    expect = await importChaiExpect();
  });

  describe('#findByUsername', () => {
    it('should callback with a user object when a user is found', done => {
      findByUsername('bob', (err, user) => {
        expect(err).to.be.null;
        expect(user).to.eql({ uid: 'bob', password: 'p@$$w0rd!' });
        done();
      });
    });

    it('should callback with nulls when a user is not found', done => {
      findByUsername('gerald', (err, user) => {
        expect(err).to.be.null;
        expect(user).to.be.null;
        done();
      });
    });
  });
});
