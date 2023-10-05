const { expect } = require('chai');
const Patient = require('../../src/models/patient');

describe('Patient', () => {
  describe('#validate', () => {
    // There isn't much to test, so just check it validates without errors
    it('should validate without errors', done => {
      const patient = new Patient({ name: 'Bob' });
      expect(patient.name).to.equal('Bob');
      patient.validate(err => {
        expect(err).to.be.null;
        done();
      });
    });
  });
});
