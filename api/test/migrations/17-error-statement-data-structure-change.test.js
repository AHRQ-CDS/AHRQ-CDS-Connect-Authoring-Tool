const chai = require('chai');
const {
  convertArtifactErrorStatement
} = require('../../src/migrations/old-migrations/17-error-statement-data-structure-change');

chai.use(require('chai-exclude'));

const { expect } = chai;

describe('Error Statement Data Migration', () => {
  it('converts an artifacts error statement document to the new format', () => {
    const result = convertArtifactErrorStatement({
      errorStatement: {
        statements: [
          {
            condition: {
              label: 'Recommendations is null',
              value: '"Recommendation" is null'
            },
            thenClause: '',
            child: {
              statements: [
                {
                  condition: {
                    label: "Doesn't Meet Inclusion Criteria",
                    value: 'not "MeetsInclusionCriteria"',
                    uniqueId: 'default-subpopulation-1'
                  },
                  thenClause: "Do the doesn't meet inclusion criteria thing",
                  child: null,
                  useThenClause: true
                },
                {
                  condition: {
                    label: 'Meets Exclusion Criteria',
                    value: '"MeetsExclusionCriteria"',
                    uniqueId: 'default-subpopulation-2'
                  },
                  thenClause: 'Do the meets exclusion criteria thing',
                  child: null,
                  useThenClause: true
                }
              ],
              elseClause: 'Do the nested else thing'
            },
            useThenClause: false
          },
          {
            condition: {
              label: 'Subpopulation 1',
              value: '"Subpopulation 1"',
              uniqueId: 'And-cd381de5-9f2e-4463-8004-ef7170e0a819'
            },
            thenClause: 'Do the subpopulation1 thing',
            child: null,
            useThenClause: true
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

  it('converts nulls into empty strings for if and else clauses', () => {
    const result = convertArtifactErrorStatement({
      errorStatement: {
        statements: [
          {
            condition: {
              label: null,
              value: null
            },
            thenClause: null,
            child: null,
            useThenClause: true
          }
        ]
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

  it('converts an empty error statement correctly', () => {
    const result = convertArtifactErrorStatement({
      errorStatement: {
        statements: []
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
});
