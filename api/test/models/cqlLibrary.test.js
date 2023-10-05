const { expect } = require('chai');
const CQLLibrary = require('../../src/models/cqlLibrary');

describe('CQLLibrary', () => {
  describe('#validate', () => {
    // There isn't much to test, so just check it validates without errors
    it('should validate without errors', done => {
      const library = new CQLLibrary({ name: 'Empty Library' });
      expect(library.name).to.equal('Empty Library');
      library.validate(err => {
        expect(err).to.be.null;
        done();
      });
    });
  });
});
