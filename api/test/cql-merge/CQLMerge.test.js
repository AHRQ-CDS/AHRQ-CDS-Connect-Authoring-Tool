const path = require('path');
const fs = require('fs');
const { expect } = require('chai');

const { importCQL } = require('../../src/cql-merge/import/importCQL');
const { exportCQL } = require('../../src/cql-merge/export/exportCQL');
const { RawCQL } = require('../../src/cql-merge/utils/RawCQL');

const dependencyRawCQLs = [
  new RawCQL(fs.readFileSync(path.join(__dirname, 'fixtures', 'CDS_Connect_Commons_for_FHIRv400.cql'), 'utf-8')),
  new RawCQL(fs.readFileSync(path.join(__dirname, 'fixtures', 'CDS_Connect_Conversions.cql'), 'utf-8'))
];

const assertCQLOutput = inputName => {
  const inputText = fs.readFileSync(path.join(__dirname, 'fixtures', 'in', inputName), 'utf-8');
  const outputText = fs.readFileSync(path.join(__dirname, 'fixtures', 'out', inputName), 'utf-8');
  const mergedCQL = exportCQL(importCQL(new RawCQL(inputText), dependencyRawCQLs));
  expect(mergedCQL.split(/\r?\n/g)).to.deep.equal(outputText.split(/\r?\n/g));
};

describe('cql-merge', () => {
  it('should output for a CQL file', () => {
    assertCQLOutput('Standard.cql');
  });

  it('should output for a CQL file without parameters', () => {
    assertCQLOutput('WithoutParameter.cql');
  });

  it('should output for a CQL file with multiple instances of a library function', () => {
    assertCQLOutput('WithDuplicateFunctions.cql');
  });

  it('should output for a CQL file with existing codesystems, codes, and concepts', () => {
    assertCQLOutput('WithCodesystemsCodesAndConcepts.cql');
  });

  it('should output for a CQL file with a function in a function one level deep', () => {
    assertCQLOutput('WithFunctionInFunction.cql');
  });
});
