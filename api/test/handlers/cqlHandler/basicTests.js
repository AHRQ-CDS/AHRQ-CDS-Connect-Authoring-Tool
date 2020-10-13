const { expect } = require('chai');
const { buildCQL } = require('../../../handlers/cqlHandler');
const _ = require('lodash');
const Artifact = require('../../../models/artifact');

const testEmptyPublishableLibrary = require('../../data/Library-Test-Empty-Artifact');
const testPublishableLibraryWithDates = require('../../data/Library-Test-Artifact-With-Dates');
const testPublishableLibraryWithDatesAndContext = require('../../data/Library-Test-Artifact-With-Dates-And-Context');
const testPublishableLibrary = require('../../data/Library-Test-CPG-Export');
const testExpandedContext = require('../../data/Library-Test-Expanded-Context');


const baseArtifact = {
  name: 'a test',
  version: null,
  dataModel: { name: 'FHIR', version: '1.0.2' },
  expTreeInclude: {},
  expTreeExclude: {},
  subpopulations: [],
  baseElements: [],
  recommendations: [],
  parameters: [],
  errorStatement: {},
  uniqueIdCounter: 9999
};

//despite it being empty, we still need a name
const emptyCPGArtifact = {
  name: "Test Empty Artifact",
};

const datesCPGArtifact = {
  name: "Test Artifact With Dates",
  approvalDate: "2020-09-01T04:00:00.000Z",
  lastReviewDate: "2020-09-10T04:00:00.000Z",
  effectivePeriod: {start: "2020-09-12T04:00:00.000Z", end: "2020-09-19T04:00:00.000Z"},
};

const datesAndContextCPGArtifact = {
  name: "Test Artifact With Dates and Context",
  approvalDate: "2020-09-01T04:00:00.000Z",
  lastReviewDate: "2020-09-10T04:00:00.000Z",
  effectivePeriod: {start: "2020-09-12T04:00:00.000Z", end: "2020-09-19T04:00:00.000Z"},
  context: [{gender: "male", contextType: "gender"},{system: "RXNORM", code: "435", contextType: "clinicalFocus"}],
};

const baseCPGArtifact = {
  name: "Test CPG Export",
  version: "1.0.0",
  description: "An artifact for testing CPG Publishable Libraries",
  url: "https://test.hl7.test",
  status: "draft",
  experimental: true,
  publisher: "NULL Publishing",
  context: [{gender: "male", contextType: "gender"},{system: "RXNORM", code: "435", contextType: "clinicalFocus"}],
  purpose: "Testing purposes.",
  usage: "Only use for testing.",
  copyright: "NULL",
  approvalDate: "2020-09-01T04:00:00.000Z",
  lastReviewDate: "2020-09-10T04:00:00.000Z",
  effectivePeriod: {start: "2020-09-12T04:00:00.000Z", end: "2020-09-19T04:00:00.000Z"},
  topic: [{system: "RXNORM", code: "435"}],
  author: [{author: "Mr. Tester"}, {author: "Ms. Tester (no relation)"}],
  reviewer: [{reviewer: "Dr. Reviewer"}],
  endorser: [],
  relatedArtifact: [{citation: "Journal of Testing Artifacts, 2020", url: "https://test.test.test",
    description: "This citation is fictional purely for the use of testing.",
    relatedArtifactType: "citation"}],
};

const contextCPGArtifact = {
  name: "Testing CPG Context",
  version: "1.0.0",
  context: [{
    system: "LOINC",
    code: "80350-2",
    contextType: "species"
  },{
    gender: "female",
    contextType: "gender"
  },{
    ageRangeUnitOfTime: "weeks",
    ageRangeMax: "5",
    ageRangeMin: "1",
    contextType: "ageRange"
  },{
    contextType: "userType",
    userType: "user-101Y00000X",
  },{
    contextType: "workflowSetting",
    workflowSetting: "inpatientEncounter"
  },{
    contextType: "workflowTask",
    workflowTask: "ALLERLREV",
  },{
    contextType: "clinicalVenue",
    clinicalVenue: "ECHO",
  },{
    contextType: "program",
    program: "?",
  },{
    contextType: "clinicalFocus",
    code: "435",
    system: "RXNORM"
  }],
  lastReviewDate: "2020-08-28T04:00:00.000+00:00",
  effectivePeriod: {start: "2020-08-26T04:00:00.000+00:00"},
  author: [{author:"Original Author"}],
  reviewer: [{reviewer:"The Reviewer"}],
  endorser: [{endorser:"Endorser 1"}, {endorser:"Endorser II"}],
  relatedArtifact: [{citation: "NULL", url: "https://test.test.test",
    description: "Test Description", relatedArtifactType: "citation"}],
};

describe('Basic CQL Handler Tests', () => {
  const raw = _.cloneDeep(baseArtifact);
  raw.expTreeInclude = {
    id: 'And',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    fields: [{
      id: 'element_name',
      type: 'string',
      name: 'Group Name',
      value: 'MeetsInclusionCriteria'
    },
    {
      id: 'comment',
      name: 'Comment',
      type: 'textarea',
    }],
    uniqueId: 'And-1',
    childInstances: [{
      id: 'ASCVD',
      name: 'ASCVD',
      extends: 'GenericCondition',
      fields: [
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
        },
        {
          id: 'comment',
          name: 'Comment',
          type: 'textarea',
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
    fields: [{
      id: 'element_name',
      type: 'string',
      name: 'Group Name',
      value: 'MeetsExclusionCriteria'
    },
    {
      id: 'comment',
      name: 'Comment',
      type: 'textarea',
    }],
    uniqueId: 'And-2',
    childInstances: [{
      id: 'TotalCholesterol',
      name: 'Total Cholesterol',
      extends: 'GenericObservation',
      surpressedModifiers: ['ConceptValue'],
      fields: [
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
        },
        {
          id: 'comment',
          name: 'Comment',
          type: 'textarea',
        }
      ],
      returnType: 'list_of_observations',
      type: 'element',
      uniqueId: 'TotalCholesterol-4',
      modifiers: []
    }],
    path: ''
  };
  raw.recommendations = [
    { uid: 'rec-53', grade: 'A', subpopulations: [], text: 'One rec.', rationale: '', comment: '' }
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
      fields: [
        { id: 'element_name', type: 'string', name: 'Group Name' },
        { id: 'comment', name: 'Comment', type: 'textarea' }
      ],
      uniqueId: 'And-0',
      childInstances: [{
        id: 'AgeRange',
        name: 'Age Range',
        returnType: 'boolean',
        surpressedModifiers: ['BooleanNot', 'BooleanComparison'],
        fields: [
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
          },
          {
            id: 'unit_of_time',
            type: 'valueset',
            select: 'demographics/units_of_time',
            name: 'Unit of Time',
            value: {
              id: 'a',
              name: 'years',
              value: "AgeInYears()"
            }
          },
          {
            id: 'comment',
            name: 'Comment',
            type: 'textarea',
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
    fields: [
      { id: 'element_name', type: 'string', name: 'Group Name', value: 'MeetsInclusionCriteria' },
      { id: 'comment', name: 'Comment', type: 'textarea' }
    ],
    uniqueId: 'And-1',
    childInstances: [{
      id: 'StatinAllergen',
      name: 'Statin Allergen',
      extends: 'GenericAllergyIntolerance',
      fields: [
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
        },
        {
          id: 'comment',
          name: 'Comment',
          type: 'textarea',
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
    fields: [
      { id: 'element_name', type: 'string', name: 'Group Name', value: 'MeetsExclusionCriteria' },
      { id: 'comment', name: 'Comment', type: 'textarea' }
    ],
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
      rationale: '',
      comment: '',
    }, {
      uid: 'rec-37',
      grade: 'A',
      subpopulations: [{ uniqueId: 'And-0', subpopulationName: 'Subpopulation 1' }],
      text: 'subpop 1 only',
      rationale: '',
      comment: '',
    }, {
      uid: 'rec-38',
      grade: 'A',
      subpopulations: [{ uniqueId: 'And-5', subpopulationName: 'Subpopulation 2' }],
      text: 'subpop 2 only',
      rationale: '',
      comment: '',
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
      rationale: '',
      comment: '',
    }, {
      uid: 'rec-40',
      grade: 'A',
      subpopulations: [],
      text: 'Fallback rec.',
      rationale: '',
      comment: '',
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
      fields: [
        { id: 'element_name', type: 'string', name: 'Group Name' },
        { id: 'comment', name: 'Comment', type: 'textarea' }
      ],
      uniqueId: 'And-0',
      childInstances: [{
        id: 'Diabetes',
        name: 'Diabetes',
        extends: 'GenericCondition',
        fields: [
          { id: 'element_name', value: 'HasDiabetes', type: 'string', name: 'Element Name' },
          { id: 'condition', static: true, value: 'diabetes', type: 'condition', name: 'Condition' },
          { id: 'comment', name: 'Comment', type: 'textarea' }
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
      fields: [
        { id: 'element_name', type: 'string', name: 'Group Name' },
        { id: 'comment', name: 'Comment', type: 'textarea' }
      ],
      uniqueId: 'And-5',
      childInstances: [{
        id: 'GenericObservation_vsac',
        name: 'Observation',
        template: 'GenericObservation',
        returnType: 'list_of_observations',
        extends: 'Base',
        suppressedModifiers: ['ConvertToMgPerdL'],
        fields: [
          { id: 'element_name', value: 'My Observation', type: 'string', name: 'Element Name' },
          { id: 'observation', type: 'observation_vsac', static: true, value: 'Observation' },
          { id: 'comment', name: 'Comment', type: 'textarea' }
        ],
        type: 'element',
        uniqueId: 'observation-6',
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
    expect(converted).to.match(/.*^\s*define "Subpopulation 2":\s+"My Observation"\s+/m);
  });
});

describe('CPG Publishable Library tests', () => {
  //function below referenced from https://gist.github.com/Yimiprod/7ee176597fef230d1451
  //using to diff two objects, as _.isEqual returns false if array elements are not in the same order
  /**
   * Deep diff between two object, using lodash
   * @param  {Object} object Object compared
   * @param  {Object} base   Object to compare with
   * @return {Object}        Return a new object who represent the diff
   */
  function difference(object, base) {
    function changes(object, base) {
      return _.transform(object, function(result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    }
    return changes(object, base);
  }

  it('Creates an empty CPG Artifact and exports as a Publishable Library', () => {
    //create a CPG artifact with fields defined above
    const testEmptyArtifact = new Artifact(emptyCPGArtifact);
    //convert it to a publishable library JSON object
    const emptyPL = testEmptyArtifact.toPublishableLibrary();
    //compare it to the known "good" example file
    expect(_.isEqual(emptyPL,testEmptyPublishableLibrary)).to.equal(true);
  });
  it('Creates a CPG Artifact with context and exports as a Publishable Library',() => {
    const testDates = new Artifact(datesCPGArtifact);
    const datePL = testDates.toPublishableLibrary();
    expect(_.isEqual(difference(datePL,testPublishableLibraryWithDates),{})).to.equal(true);
  });
  it('Creates a CPG Artifact with context and dates and exports as a Publishable Library',() => {
    const testContext = new Artifact(datesAndContextCPGArtifact);
    const contextPL = testContext.toPublishableLibrary();
    expect(_.isEqual(difference(contextPL,testPublishableLibraryWithDatesAndContext),{})).to.equal(true);
  });
  it('Creates a mostly complete CPG Artifact and exports as a Publishable Library', () => {
    const testArtifact = new Artifact(baseCPGArtifact);
    const cpgPL = testArtifact.toPublishableLibrary();
    expect(_.isEqual(difference(cpgPL,testPublishableLibrary),{})).to.equal(true);
  });
  it('Creates a mostly complete CPG Artifact with expanded context and exports as a Publishable Library', () => {
    const testCtxArtifact = new Artifact(contextCPGArtifact);
    const ecPL = testCtxArtifact.toPublishableLibrary();
    expect(_.isEqual(difference(ecPL,testExpandedContext),{})).to.equal(true);
  });
});
