const chai = require('chai');
const { fixArtifactErrorStatement } = require('../../src/migrations/old-migrations/18-error-statement-conversion-fix');

chai.use(require('chai-exclude'));

const { expect } = chai;

describe('Error Statement Conversion Fix', () => {
  it('should correct the data format for an empty error statement', () => {
    const result = fixArtifactErrorStatement({
      errorStatement: {
        id: 'root',
        ifThenClauses: [],
        elseClause: ''
      }
    });

    expect(result)
      .excludingEvery('id')
      .to.deep.equal({
        id: 'root',
        ifThenClauses: [{ ifCondition: { value: null, label: null }, statements: [], thenClause: '' }],
        elseClause: ''
      });
  });

  it('should not modify an error statement that has if then clauses', () => {
    const result = fixArtifactErrorStatement({
      errorStatement: {
        id: 'root',
        ifThenClauses: [
          {
            ifCondition: {
              label: 'Recommendations is null',
              value: '"Recommendation" is null'
            },
            statements: [
              {
                id: '235ea117-d2ac-45af-8d1c-79ab0c563d5c',
                ifThenClauses: [
                  {
                    ifCondition: {
                      label: "Doesn't Meet Inclusion Criteria",
                      value: 'not "MeetsInclusionCriteria"',
                      uniqueId: 'default-subpopulation-1'
                    },
                    statements: [],
                    thenClause: "Do the doesn't meet inclusion criteria thing"
                  },
                  {
                    ifCondition: {
                      label: 'Meets Exclusion Criteria',
                      value: '"MeetsExclusionCriteria"',
                      uniqueId: 'default-subpopulation-2'
                    },
                    statements: [],
                    thenClause: 'Do the meets exclusion criteria thing'
                  }
                ],
                elseClause: 'Do the nested else thing'
              }
            ],
            thenClause: ''
          },
          {
            ifCondition: {
              label: 'Subpopulation 1',
              value: '"Subpopulation 1"',
              uniqueId: 'And-cd381de5-9f2e-4463-8004-ef7170e0a819'
            },
            statements: [],
            thenClause: 'Do the subpopulation1 thing'
          }
        ],
        elseClause: 'Do the else thing'
      }
    });

    expect(result)
      .excludingEvery('id')
      .to.deep.equal({
        id: 'root',
        ifThenClauses: [
          {
            ifCondition: {
              label: 'Recommendations is null',
              value: '"Recommendation" is null'
            },
            statements: [
              {
                id: '235ea117-d2ac-45af-8d1c-79ab0c563d5c',
                ifThenClauses: [
                  {
                    ifCondition: {
                      label: "Doesn't Meet Inclusion Criteria",
                      value: 'not "MeetsInclusionCriteria"',
                      uniqueId: 'default-subpopulation-1'
                    },
                    statements: [],
                    thenClause: "Do the doesn't meet inclusion criteria thing"
                  },
                  {
                    ifCondition: {
                      label: 'Meets Exclusion Criteria',
                      value: '"MeetsExclusionCriteria"',
                      uniqueId: 'default-subpopulation-2'
                    },
                    statements: [],
                    thenClause: 'Do the meets exclusion criteria thing'
                  }
                ],
                elseClause: 'Do the nested else thing'
              }
            ],
            thenClause: ''
          },
          {
            ifCondition: {
              label: 'Subpopulation 1',
              value: '"Subpopulation 1"',
              uniqueId: 'And-cd381de5-9f2e-4463-8004-ef7170e0a819'
            },
            statements: [],
            thenClause: 'Do the subpopulation1 thing'
          }
        ],
        elseClause: 'Do the else thing'
      });
  });
});
