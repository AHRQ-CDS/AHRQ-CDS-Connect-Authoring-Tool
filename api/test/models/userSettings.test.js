const { expect } = require('chai');
const UserSettings = require('../../src/models/userSettings');

describe('UserSettings', () => {
  describe('#validate', () => {
    // There isn't much to test, so just check it validates without errors
    it('should validate without errors', done => {
      const settings = new UserSettings({ user: 'Bob' });
      expect(settings.user).to.equal('Bob');
      settings.validate(err => {
        expect(err).to.be.null;
        done();
      });
    });
  });
});
