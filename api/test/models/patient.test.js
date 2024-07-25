const Patient = require('../../src/models/patient');
const { importChaiExpect } = require('../utils');

describe('Patient', () => {
  let expect;
  before(async () => {
    expect = await importChaiExpect();
  });

  describe('#validate', () => {
    // There isn't much to test, so just check it validates without errors
    it('should validate without errors', async () => {
      const patient = new Patient({ name: 'Bob' });
      expect(patient.name).to.equal('Bob');
      return patient.validate();
    });
  });
});
