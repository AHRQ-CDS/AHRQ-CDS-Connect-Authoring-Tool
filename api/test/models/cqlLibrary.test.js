const { expect } = require('chai');
const CQLLibrary = require('../../src/models/cqlLibrary');

describe('CQLLibrary', () => {
  describe('#validate', () => {
    // There isn't much to test, so just check it validates without errors
    it('should validate without errors', async () => {
      const library = new CQLLibrary({ name: 'Empty Library' });
      expect(library.name).to.equal('Empty Library');
      return library.validate();
    });
  });
});
