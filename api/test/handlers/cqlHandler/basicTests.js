const { expect } = require('chai');
const { buildCQL } = require('../../../handlers/cqlHandler');
const _ = require('lodash');

const baseArtifact = {
  name: 'a test',
  version: null,
  expTreeInclude: {},
  expTreeExclude: {},
  subpopulations: [],
  recommendations: [],
  booleanParameters: [],
  errorStatement: {},
  uniqueIdCounter: 9999
};

describe('Basic CQL Handler Tests', () => {
  const raw = _.cloneDeep(baseArtifact);
  raw.expTreeInclude = {
    id: 'And',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    parameters: [{
      id: 'element_name',
      type: 'string',
      name: 'Group Name',
      value: 'MeetsInclusionCriteria'
    }],
    uniqueId: 'And-1',
    childInstances: [{
      id: 'ASCVD',
      name: 'ASCVD',
      extends: 'GenericCondition',
      parameters: [
        {
          id: 'element_name',
          value: 'HasASCVD',
          type: 'string',
          name: 'Element Name'
        }, {
          id: 'condition',
          static: true,
          value: 'has_ascvd',
          type: 'condition',
          name: 'Condition'
        }
      ],
      returnType: 'list_of_conditions',
      type: 'element',
      uniqueId: 'ASCVD-3',
      modifiers: []
    }],
    path: ''
  };
  raw.expTreeExclude = {
    id: 'And',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    parameters: [{
      id: 'element_name',
      type: 'string',
      name: 'Group Name',
      value: 'MeetsExclusionCriteria'
    }],
    uniqueId: 'And-2',
    childInstances: [{
      id: 'TotalCholesterol',
      name: 'Total Cholesterol',
      extends: 'GenericObservation',
      surpressedModifiers: ['ConceptValue'],
      parameters: [
        {
          id: 'element_name',
          value: 'TotalCholesterol',
          type: 'string',
          name: 'Element Name'
        }, {
          id: 'observation',
          static: true,
          value: 'total_cholesterol',
          type: 'observation',
          name: 'Observation'
        }
      ],
      returnType: 'list_of_observations',
      type: 'element',
      uniqueId: 'TotalCholesterol-4',
      modifiers: []
    }],
    path: ''
  };
  raw.recommendations = [{ uid: 'rec-53', grade: 'A', subpopulations: [], text: 'One rec.', rationale: '' }];
  raw.subpopulations = [
    {
      special: true,
      subpopulationName: "Doesn't Meet Inclusion Criteria",
      special_subpopulationName: 'not "MeetsInclusionCriteria"',
      uniqueId: 'default-subpopulation-1'
    }, {
      special: true,
      subpopulationName: 'Meets Exclusion Criteria',
      special_subpopulationName: '"MeetsExclusionCriteria"',
      uniqueId: 'default-subpopulation-2'
    }, {
      id: 'And',
      name: '',
      conjunction: true,
      returnType: 'boolean',
      parameters: [{ id: 'element_name', type: 'string', name: 'Group Name' }],
      uniqueId: 'And-0',
      childInstances: [{
        id: 'AgeRange',
        name: 'Age Range',
        returnType: 'boolean',
        surpressedModifiers: ['BooleanNot', 'BooleanComparison'],
        parameters: [
          {
            id: 'element_name',
            type: 'string',
            name: 'Element Name',
            value: 'foo'
          }, {
            id: 'min_age',
            type: 'number',
            typeOfNumber: 'integer',
            name: 'Minimum Age',
            value: 3
          }, {
            id: 'max_age',
            type: 'number',
            typeOfNumber: 'integer',
            name: 'Maximum Age',
            value: 10
          }
        ],
        uniqueId: 'AgeRange-5',
        modifiers: []
      }],
      path: '',
      subpopulationName: 'Subpopulation 1',
      expanded: true
    }
  ];
  raw.errorStatement = {
    statements: [{
      condition: { label: 'Recommendations is null', value: '"Recommendation" is null' },
      thenClause: 'Oh no!',
      child: null,
      useThenClause: true
    }],
    else: 'null'
  };
  it('Ensure output definitions have the correct names', () => {
    const artifact = buildCQL(raw);
    const converted = artifact.toString();
    expect(converted).to.contain('define "Recommendation":');
    expect(converted).to.contain('define "MeetsInclusionCriteria":');
    expect(converted).to.contain('define "MeetsExclusionCriteria":');
    expect(converted).to.contain('define "Errors":');
    expect(converted).to.contain('define "Subpopulation 1":');
    expect(converted).to.match(/.*^\s*define "InPopulation":\s+"MeetsInclusionCriteria" and not "MeetsExclusionCriteria"\s+/m);
  });
});

describe('Subpopulation tests', () => {
  const raw = _.cloneDeep(baseArtifact);
  raw.expTreeInclude = {
    id: 'And',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    parameters: [{ id: 'element_name', type: 'string', name: 'Group Name', value: 'MeetsInclusionCriteria' }],
    uniqueId: 'And-1',
    childInstances: [{
      id: 'StatinAllergen',
      name: 'Statin Allergen',
      extends: 'GenericAllergyIntolerance',
      parameters: [
        {
          id: 'element_name',
          value: 'StatinAllergen',
          type: 'string',
          name: 'Element Name'
        }, {
          id: 'allergyIntolerance',
          static: true,
          value: 'statin_allergen',
          type: 'allergyIntolerance',
          name: 'Allergy Intolerance'
        }
      ],
      returnType: 'list_of_allergy_intolerances',
      type: 'element',
      uniqueId: 'StatinAllergen-3',
      modifiers: [{
        id: 'ActiveOrConfirmedAllergyIntolerance',
        name: 'Active Or Confirmed',
        inputTypes: ['list_of_allergy_intolerances'],
        returnType: 'list_of_allergy_intolerances',
        cqlTemplate: 'BaseModifier',
        cqlLibraryFunction: 'C3F.ActiveOrConfirmedAllergyIntolerance'
      }]
    }],
    path: ''
  };
  raw.expTreeExclude = {
    id: 'And',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    parameters: [{ id: 'element_name', type: 'string', name: 'Group Name', value: 'MeetsExclusionCriteria' }],
    uniqueId: 'And-2',
    childInstances: [],
    path: ''
  };
  raw.recommendations = [
    {
      uid: 'rec-36',
      grade: 'A',
      subpopulations: [
        {
          uniqueId: 'And-0',
          subpopulationName: 'Subpopulation 1'
        }, {
          uniqueId: 'And-5',
          subpopulationName: 'Subpopulation 2'
        }
      ],
      text: 'Both subpopulations rec.',
      rationale: ''
    }, {
      uid: 'rec-37',
      grade: 'A',
      subpopulations: [{ uniqueId: 'And-0', subpopulationName: 'Subpopulation 1' }],
      text: 'subpop 1 only',
      rationale: ''
    }, {
      uid: 'rec-38',
      grade: 'A',
      subpopulations: [{ uniqueId: 'And-5', subpopulationName: 'Subpopulation 2' }],
      text: 'subpop 2 only',
      rationale: ''
    }, {
      uid: 'rec-39',
      grade: 'A',
      subpopulations: [{
        uniqueId: 'default-subpopulation-1',
        subpopulationName: "Doesn't Meet Inclusion Criteria",
        special: true,
        special_subpopulationName: 'not "MeetsInclusionCriteria"'
      }],
      text: 'Not included rec.',
      rationale: ''
    }, {
      uid: 'rec-40',
      grade: 'A',
      subpopulations: [],
      text: 'Fallback rec.',
      rationale: ''
    }
  ];
  raw.subpopulations = [
    {
      special: true,
      subpopulationName: "Doesn't Meet Inclusion Criteria",
      special_subpopulationName: 'not "MeetsInclusionCriteria"',
      uniqueId: 'default-subpopulation-1'
    }, {
      special: true,
      subpopulationName: 'Meets Exclusion Criteria',
      special_subpopulationName: '"MeetsExclusionCriteria"',
      uniqueId: 'default-subpopulation-2'
    }, {
      id: 'And',
      name: '',
      conjunction: true,
      returnType: 'boolean',
      parameters: [{ id: 'element_name', type: 'string', name: 'Group Name' }],
      uniqueId: 'And-0',
      childInstances: [{
        id: 'Diabetes',
        name: 'Diabetes',
        extends: 'GenericCondition',
        parameters: [
          { id: 'element_name', value: 'HasDiabetes', type: 'string', name: 'Element Name' },
          { id: 'condition', static: true, value: 'diabetes', type: 'condition', name: 'Condition' }
        ],
        returnType: 'list_of_conditions',
        type: 'element',
        uniqueId: 'Diabetes-4',
        modifiers: [{
          id: 'ConfirmedCondition',
          name: 'Confirmed',
          inputTypes: ['list_of_conditions'],
          returnType: 'list_of_conditions',
          cqlTemplate: 'BaseModifier',
          cqlLibraryFunction: 'C3F.Confirmed'
        }]
      }],
      path: '',
      subpopulationName: 'Subpopulation 1',
      expanded: true
    }, {
      id: 'And',
      name: '',
      conjunction: true,
      returnType: 'boolean',
      parameters: [{ id: 'element_name', type: 'string', name: 'Group Name' }],
      uniqueId: 'And-5',
      childInstances: [{
        id: 'Breastfeeding',
        name: 'Breastfeeding',
        template: 'Breastfeeding',
        returnType: 'boolean',
        extends: 'Base',
        suppressedModifiers: ['BooleanComparison', 'WithUnit', 'CheckExistence'],
        parameters: [
          { id: 'element_name', value: 'IsBreastfeeding', type: 'string', name: 'Element Name' },
          { id: 'observation', type: 'breastfeeding', static: true, value: 'breastfeeding' }
        ],
        type: 'element',
        uniqueId: 'Breastfeeding-6',
        modifiers: []
      }],
      path: '',
      subpopulationName: 'Subpopulation 2',
      expanded: true
    }
  ];
  raw.errorStatement = { statements: [], else: 'null' };

  it('multiple recommendations and subpopulations', () => {
    const artifact = buildCQL(_.cloneDeep(raw));
    const converted = artifact.toString();
    // if "Subpopulation 1" and "Subpopulation 2" then 'Both subpopulations rec.'
    // else if "Subpopulation 1" then 'subpop 1 only'
    // else if "Subpopulation 2" then 'subpop 2 only'
    // else if not "MeetsInclusionCriteria" then 'Not included rec.'
    // else if "InPopulation" then 'Fallback rec.'
    // else null
    expect(converted).to.contain('define "Subpopulation 1":');
    expect(converted).to.contain('define "Subpopulation 2":');
    expect(converted).to.match(/.*^\s*define "Recommendation":\s+if "Subpopulation 1" and "Subpopulation 2" then 'Both subpopulations rec.'\s+else if "Subpopulation 1" then 'subpop 1 only'\s+else if "Subpopulation 2" then 'subpop 2 only'\s+else if not "MeetsInclusionCriteria" then 'Not included rec.'\s+else if "InPopulation" then 'Fallback rec.'\s+else null\s+/m);
  });
  it('second subpopulation is detected in a recommendation', () => {
    const withOneRec = _.cloneDeep(raw);
    withOneRec.recommendations.splice(1);
    const artifact = buildCQL(withOneRec);
    const converted = artifact.toString();
    // define "Subpopulation 1":
    //   if "InPopulation" is not true then
    //     null
    //   else
    // "HasDiabetes"

    const inPopSuffic = '\\s+if "InPopulation" is not true then\\s+null\\s+else\\s+';
    expect(converted).to.match(new RegExp(`.*^\\s*define "Subpopulation 1":${inPopSuffic}`, 'm'));
    expect(converted).to.match(new RegExp(`.*^\\s*define "Subpopulation 2":${inPopSuffic}`, 'm'));
  });
  it('rationales', () => {
    const withRationales = _.cloneDeep(raw);
    withRationales.recommendations[1].rationale = 'subpop 1 with rationale';
    withRationales.recommendations[4].rationale = 'fallback rationale';
    const artifact = buildCQL(withRationales);
    const converted = artifact.toString();
    // if "Subpopulation 1" and "Subpopulation 2" then null
    // else if "Subpopulation 1" then 'subpop 1 with rationale'
    // else if "Subpopulation 2" then null
    // else if not "MeetsInclusionCriteria" then null
    // else if "InPopulation" then 'fallback rationale'
    // else null
    expect(converted).to.match(/.*^\s*define "Rationale":\s+if "Subpopulation 1" and "Subpopulation 2" then null\s+else if "Subpopulation 1" then 'subpop 1 with rationale'\s+else if "Subpopulation 2" then null\s+else if not "MeetsInclusionCriteria" then null\s+else if "InPopulation" then 'fallback rationale'\s+else null\s+/m);
  });
  it('errors', () => {
    const withErrors = _.cloneDeep(raw);
    withErrors.errorStatement = {
      statements: [
        {
          condition: { label: 'Recommendations is null', value: '"Recommendation" is null' },
          thenClause: 'Something went wrong.',
          child: null,
          useThenClause: true
        }, {
          condition: { label: 'Subpopulation 1', value: '"Subpopulation 1"' },
          thenClause: '',
          child: {
            statements: [{
              condition: { label: 'Subpopulation 2', value: '"Subpopulation 2"' },
              thenClause: 'Dual subpopulation error.',
              child: null,
              useThenClause: true
            }],
            elseClause: ''
          },
          useThenClause: false
        }, {
          condition: { label: 'Meets Exclusion Criteria', value: '"MeetsExclusionCriteria"' },
          thenClause: 'default sp 2',
          child: null,
          useThenClause: true
        }, {
          condition: { label: "Doesn't Meet Inclusion Criteria", value: 'not "MeetsInclusionCriteria"' },
          thenClause: 'default sp 1',
          child: null,
          useThenClause: true
        }
      ],
      else: 'null'
    };
    const artifact = buildCQL(withErrors);
    const converted = artifact.toString();

    // define "Errors":
    //   if "Recommendation" is null then
    //     {'Something went wrong.'}
    //   else if "Subpopulation 1" then
    //     if "Subpopulation 2" then
    //       {'Dual subpopulation error.'}
    //     else
    //       null
    //   else if "MeetsExclusionCriteria" then
    //     {'default sp 2'}
    //   else if not "MeetsInclusionCriteria" then
    //     {'default sp 1'}
    //   else null
    expect(converted).to.match(/.*^\s*define "Errors":\s+if "Recommendation" is null then\s+{'Something went wrong\.'}\s+else if "Subpopulation 1" then\s+if "Subpopulation 2" then\s+{'Dual subpopulation error\.'}\s+else\s+null\s+else if "MeetsExclusionCriteria" then\s+{'default sp 2'}\s+else if not "MeetsInclusionCriteria" then\s+{'default sp 1'}\s+else\s+null\s+/m);
  });
  it('subpopulations not used in recommendations do not include in population check.', () => {
    const noRecs = _.cloneDeep(raw);
    noRecs.recommendations = [];
    const artifact = buildCQL(noRecs);
    const converted = artifact.toString();
    // define "Subpopulation 1":
    //   if "InPopulation" is not true then
    //     null
    //   else
    // "HasDiabetes"

    expect(converted).to.match(/.*^\s*define "Subpopulation 1":\s+"HasDiabetes"\s+/m);
    expect(converted).to.match(/.*^\s*define "Subpopulation 2":\s+"IsBreastfeeding"\s+/m);
  });
});
