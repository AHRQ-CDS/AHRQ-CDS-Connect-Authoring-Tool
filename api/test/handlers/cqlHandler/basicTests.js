const fs = require('fs');
const path = require('path');
const nock = require('nock');
const { expect } = require('chai');
const { buildCQL, makeCQLtoELMRequest, formatCQL } = require('../../../src/handlers/cqlHandler');
const _ = require('lodash');
const Artifact = require('../../../src/models/artifact');

const testEmptyPublishableLibrary = require('./fixtures/Library-Test-Empty-Artifact');
const testPublishableLibraryWithDates = require('./fixtures/Library-Test-Artifact-With-Dates');
const testPublishableLibraryWithDatesAndContext = require('./fixtures/Library-Test-Artifact-With-Dates-And-Context');
const testPublishableLibrary = require('./fixtures/Library-Test-CPG-Export');
const testExpandedContext = require('./fixtures/Library-Test-Expanded-Context');

const baseArtifact = {
  name: 'a test',
  version: null,
  dataModel: { name: 'FHIR', version: '4.0.1' },
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
  name: 'Test Empty Artifact'
};

const datesCPGArtifact = {
  name: 'Test Artifact With Dates',
  approvalDate: '2020-09-01T04:00:00.000Z',
  lastReviewDate: '2020-09-10T04:00:00.000Z',
  effectivePeriod: {
    start: '2020-09-12T04:00:00.000Z',
    end: '2020-09-19T04:00:00.000Z'
  }
};

const datesAndContextCPGArtifact = {
  name: 'Test Artifact With Dates and Context',
  approvalDate: '2020-09-01T04:00:00.000Z',
  lastReviewDate: '2020-09-10T04:00:00.000Z',
  effectivePeriod: {
    start: '2020-09-12T04:00:00.000Z',
    end: '2020-09-19T04:00:00.000Z'
  },
  context: [
    { gender: 'male', contextType: 'gender' },
    { system: 'RXNORM', code: '435', contextType: 'clinicalFocus' }
  ]
};

const baseCPGArtifact = {
  name: 'Test CPG Export',
  version: '1.0.0',
  description: 'An artifact for testing CPG Publishable Libraries',
  url: 'https://test.hl7.test',
  status: 'draft',
  experimental: true,
  publisher: 'NULL Publishing',
  context: [
    { gender: 'male', contextType: 'gender' },
    { system: 'RXNORM', code: '435', contextType: 'clinicalFocus' }
  ],
  purpose: 'Testing purposes.',
  usage: 'Only use for testing.',
  strengthOfRecommendation: { strengthOfRecommendation: 'strong', code: '', system: '' },
  qualityOfEvidence: { qualityOfEvidence: 'high', code: '', system: '' },
  copyright: 'NULL',
  approvalDate: '2020-09-01T04:00:00.000Z',
  lastReviewDate: '2020-09-10T04:00:00.000Z',
  effectivePeriod: {
    start: '2020-09-12T04:00:00.000Z',
    end: '2020-09-19T04:00:00.000Z'
  },
  topic: [{ system: 'RXNORM', code: '435' }],
  author: [{ author: 'Mr. Tester' }, { author: 'Ms. Tester (no relation)' }],
  reviewer: [{ reviewer: 'Dr. Reviewer' }],
  endorser: [],
  relatedArtifact: [
    {
      citation: 'Journal of Testing Artifacts, 2020',
      url: 'https://test.test.test',
      description: 'This citation is fictional purely for the use of testing.',
      relatedArtifactType: 'citation'
    }
  ]
};

const contextCPGArtifact = {
  name: 'Testing CPG Context',
  version: '1.0.0',
  context: [
    {
      system: 'LOINC',
      code: '80350-2',
      contextType: 'species'
    },
    {
      gender: 'female',
      contextType: 'gender'
    },
    {
      ageRangeUnitOfTime: 'weeks',
      ageRangeMax: '5',
      ageRangeMin: '1',
      contextType: 'ageRange'
    },
    {
      contextType: 'userType',
      userType: 'user-101Y00000X'
    },
    {
      contextType: 'workflowSetting',
      workflowSetting: 'inpatientEncounter'
    },
    {
      contextType: 'workflowTask',
      workflowTask: 'ALLERLREV'
    },
    {
      contextType: 'clinicalVenue',
      clinicalVenue: 'ECHO'
    },
    {
      contextType: 'program',
      program: '?'
    },
    {
      contextType: 'clinicalFocus',
      code: '435',
      system: 'RXNORM'
    }
  ],
  lastReviewDate: '2020-08-28T04:00:00.000+00:00',
  effectivePeriod: { start: '2020-08-26T04:00:00.000+00:00' },
  author: [{ author: 'Original Author' }],
  reviewer: [{ reviewer: 'The Reviewer' }],
  endorser: [{ endorser: 'Endorser 1' }, { endorser: 'Endorser II' }],
  relatedArtifact: [
    {
      citation: 'NULL',
      url: 'https://test.test.test',
      description: 'Test Description',
      relatedArtifactType: 'citation'
    }
  ]
};

describe('Basic CQL Handler Tests', () => {
  const raw = _.cloneDeep(baseArtifact);
  raw.expTreeInclude = {
    id: 'And',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    fields: [
      {
        id: 'element_name',
        type: 'string',
        name: 'Group Name',
        value: 'MeetsInclusionCriteria'
      },
      {
        id: 'comment',
        name: 'Comment',
        type: 'textarea'
      }
    ],
    uniqueId: 'And-1',
    childInstances: [
      {
        id: 'ASCVD',
        name: 'ASCVD',
        extends: 'GenericCondition',
        fields: [
          {
            id: 'element_name',
            value: 'HasASCVD',
            type: 'string',
            name: 'Element Name'
          },
          {
            id: 'condition',
            static: true,
            value: 'has_ascvd',
            type: 'condition',
            name: 'Condition'
          },
          {
            id: 'comment',
            name: 'Comment',
            type: 'textarea'
          }
        ],
        returnType: 'list_of_conditions',
        type: 'element',
        uniqueId: 'ASCVD-3',
        modifiers: []
      }
    ],
    path: ''
  };
  raw.expTreeExclude = {
    id: 'And',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    fields: [
      {
        id: 'element_name',
        type: 'string',
        name: 'Group Name',
        value: 'MeetsExclusionCriteria'
      },
      {
        id: 'comment',
        name: 'Comment',
        type: 'textarea'
      }
    ],
    uniqueId: 'And-2',
    childInstances: [
      {
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
          },
          {
            id: 'observation',
            static: true,
            value: 'total_cholesterol',
            type: 'observation',
            name: 'Observation'
          },
          {
            id: 'comment',
            name: 'Comment',
            type: 'textarea'
          }
        ],
        returnType: 'list_of_observations',
        type: 'element',
        uniqueId: 'TotalCholesterol-4',
        modifiers: []
      }
    ],
    path: ''
  };
  raw.recommendations = [
    {
      uid: 'rec-53',
      grade: 'A',
      subpopulations: [],
      text: 'One rec.',
      rationale: '',
      comment: ''
    }
  ];
  raw.subpopulations = [
    {
      special: true,
      subpopulationName: "Doesn't Meet Inclusion Criteria",
      special_subpopulationName: 'not "MeetsInclusionCriteria"',
      uniqueId: 'default-subpopulation-1'
    },
    {
      special: true,
      subpopulationName: 'Meets Exclusion Criteria',
      special_subpopulationName: '"MeetsExclusionCriteria"',
      uniqueId: 'default-subpopulation-2'
    },
    {
      id: 'And',
      name: '',
      conjunction: true,
      returnType: 'boolean',
      fields: [
        { id: 'element_name', type: 'string', name: 'Group Name' },
        { id: 'comment', name: 'Comment', type: 'textarea' }
      ],
      uniqueId: 'And-0',
      childInstances: [
        {
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
            },
            {
              id: 'min_age',
              type: 'number',
              typeOfNumber: 'integer',
              name: 'Minimum Age',
              value: 3
            },
            {
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
                value: 'AgeInYears()'
              }
            },
            {
              id: 'comment',
              name: 'Comment',
              type: 'textarea'
            }
          ],
          uniqueId: 'AgeRange-5',
          modifiers: []
        }
      ],
      path: '',
      subpopulationName: 'Subpopulation 1',
      expanded: true
    }
  ];
  raw.errorStatement = {
    ifThenClauses: [
      {
        ifCondition: { label: 'Recommendations is null', value: '"Recommendation" is null' },
        thenClause: 'Oh no!',
        statements: []
      }
    ],
    else: ''
  };
  it('Ensure output definitions have the correct names', () => {
    const artifact = buildCQL(raw);
    const converted = artifact.toString();
    expect(converted).to.contain('define "Recommendation":');
    expect(converted).to.contain('define "MeetsInclusionCriteria":');
    expect(converted).to.contain('define "MeetsExclusionCriteria":');
    expect(converted).to.contain('define "Errors":');
    expect(converted).to.contain('define "Subpopulation 1":');
    expect(converted).to.match(
      /.*^\s*define "InPopulation":\s+"MeetsInclusionCriteria" and not "MeetsExclusionCriteria"\s+/m
    );
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
      {
        id: 'element_name',
        type: 'string',
        name: 'Group Name',
        value: 'MeetsInclusionCriteria'
      },
      { id: 'comment', name: 'Comment', type: 'textarea' }
    ],
    uniqueId: 'And-1',
    childInstances: [
      {
        id: 'StatinAllergen',
        name: 'Statin Allergen',
        extends: 'GenericAllergyIntolerance',
        fields: [
          {
            id: 'element_name',
            value: 'StatinAllergen',
            type: 'string',
            name: 'Element Name'
          },
          {
            id: 'allergyIntolerance',
            static: true,
            value: 'statin_allergen',
            type: 'allergyIntolerance',
            name: 'Allergy Intolerance'
          },
          {
            id: 'comment',
            name: 'Comment',
            type: 'textarea'
          }
        ],
        returnType: 'list_of_allergy_intolerances',
        type: 'element',
        uniqueId: 'StatinAllergen-3',
        modifiers: [
          {
            id: 'ActiveOrConfirmedAllergyIntolerance',
            name: 'Active Or Confirmed',
            inputTypes: ['list_of_allergy_intolerances'],
            returnType: 'list_of_allergy_intolerances',
            cqlTemplate: 'BaseModifier',
            cqlLibraryFunction: 'C3F.ActiveOrConfirmedAllergyIntolerance'
          }
        ]
      }
    ],
    path: ''
  };
  raw.expTreeExclude = {
    id: 'And',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    fields: [
      {
        id: 'element_name',
        type: 'string',
        name: 'Group Name',
        value: 'MeetsExclusionCriteria'
      },
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
        },
        {
          uniqueId: 'And-5',
          subpopulationName: 'Subpopulation 2'
        }
      ],
      text: 'Both subpopulations rec.',
      rationale: '',
      comment: ''
    },
    {
      uid: 'rec-37',
      grade: 'A',
      subpopulations: [{ uniqueId: 'And-0', subpopulationName: 'Subpopulation 1' }],
      text: 'subpop 1 only',
      rationale: '',
      comment: ''
    },
    {
      uid: 'rec-38',
      grade: 'A',
      subpopulations: [{ uniqueId: 'And-5', subpopulationName: 'Subpopulation 2' }],
      text: 'subpop 2 only',
      rationale: '',
      comment: ''
    },
    {
      uid: 'rec-39',
      grade: 'A',
      subpopulations: [
        {
          uniqueId: 'default-subpopulation-1',
          subpopulationName: "Doesn't Meet Inclusion Criteria",
          special: true,
          special_subpopulationName: 'not "MeetsInclusionCriteria"'
        }
      ],
      text: 'Not included rec.',
      rationale: '',
      comment: ''
    },
    {
      uid: 'rec-40',
      grade: 'A',
      subpopulations: [],
      text: 'Fallback rec.',
      rationale: '',
      comment: ''
    }
  ];
  raw.subpopulations = [
    {
      special: true,
      subpopulationName: "Doesn't Meet Inclusion Criteria",
      special_subpopulationName: 'not "MeetsInclusionCriteria"',
      uniqueId: 'default-subpopulation-1'
    },
    {
      special: true,
      subpopulationName: 'Meets Exclusion Criteria',
      special_subpopulationName: '"MeetsExclusionCriteria"',
      uniqueId: 'default-subpopulation-2'
    },
    {
      id: 'And',
      name: '',
      conjunction: true,
      returnType: 'boolean',
      fields: [
        { id: 'element_name', type: 'string', name: 'Group Name' },
        { id: 'comment', name: 'Comment', type: 'textarea' }
      ],
      uniqueId: 'And-0',
      childInstances: [
        {
          id: 'Diabetes',
          name: 'Diabetes',
          extends: 'GenericCondition',
          fields: [
            {
              id: 'element_name',
              value: 'HasDiabetes',
              type: 'string',
              name: 'Element Name'
            },
            {
              id: 'condition',
              static: true,
              value: 'diabetes',
              type: 'condition',
              name: 'Condition'
            },
            { id: 'comment', name: 'Comment', type: 'textarea' }
          ],
          returnType: 'list_of_conditions',
          type: 'element',
          uniqueId: 'Diabetes-4',
          modifiers: [
            {
              id: 'ConfirmedCondition',
              name: 'Confirmed',
              inputTypes: ['list_of_conditions'],
              returnType: 'list_of_conditions',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'C3F.Confirmed'
            }
          ]
        }
      ],
      path: '',
      subpopulationName: 'Subpopulation 1',
      expanded: true
    },
    {
      id: 'And',
      name: '',
      conjunction: true,
      returnType: 'boolean',
      fields: [
        { id: 'element_name', type: 'string', name: 'Group Name' },
        { id: 'comment', name: 'Comment', type: 'textarea' }
      ],
      uniqueId: 'And-5',
      childInstances: [
        {
          id: 'GenericObservation_vsac',
          name: 'Observation',
          template: 'GenericObservation',
          returnType: 'list_of_observations',
          extends: 'Base',
          suppressedModifiers: ['ConvertToMgPerdL'],
          fields: [
            {
              id: 'element_name',
              value: 'My Observation',
              type: 'string',
              name: 'Element Name'
            },
            {
              id: 'observation',
              type: 'observation_vsac',
              static: true,
              value: 'Observation'
            },
            { id: 'comment', name: 'Comment', type: 'textarea' }
          ],
          type: 'element',
          uniqueId: 'observation-6',
          modifiers: []
        }
      ],
      path: '',
      subpopulationName: 'Subpopulation 2',
      expanded: true
    }
  ];
  raw.errorStatement = { ifThenClauses: [], elseClause: '' };

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
    expect(converted).to.match(
      /.*^\s*define "Recommendation":\s+if "Subpopulation 1" and "Subpopulation 2" then 'Both subpopulations rec.'\s+else if "Subpopulation 1" then 'subpop 1 only'\s+else if "Subpopulation 2" then 'subpop 2 only'\s+else if not "MeetsInclusionCriteria" then 'Not included rec.'\s+else if "InPopulation" then 'Fallback rec.'\s+else null\s+/m
    );
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
    expect(converted).to.match(
      /.*^\s*define "Rationale":\s+if "Subpopulation 1" and "Subpopulation 2" then null\s+else if "Subpopulation 1" then 'subpop 1 with rationale'\s+else if "Subpopulation 2" then null\s+else if not "MeetsInclusionCriteria" then null\s+else if "InPopulation" then 'fallback rationale'\s+else null\s+/m
    );
  });
  it('errors', () => {
    const withErrors = _.cloneDeep(raw);
    withErrors.errorStatement = {
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: { label: 'Recommendations is null', value: '"Recommendation" is null' },
          statements: [],
          thenClause: 'Something went wrong.'
        },
        {
          ifCondition: { label: 'Subpopulation 1', value: '"Subpopulation 1"' },
          statements: [
            {
              id: '123',
              ifThenClauses: [
                {
                  ifCondition: { label: 'Subpopulation 2', value: '"Subpopulation 2"' },
                  statements: [],
                  thenClause: 'Dual subpopulation error.'
                }
              ],
              elseClause: 'else do this'
            }
          ],
          thenClause: ''
        },
        {
          ifCondition: { label: 'Meets Exclusion Criteria', value: '"MeetsExclusionCriteria"' },
          statements: [],
          thenClause: 'default sp 2'
        },
        {
          ifCondition: { label: "Doesn't Meet Inclusion Criteria", value: 'not "MeetsInclusionCriteria"' },
          statements: [],
          thenClause: 'default sp 1'
        }
      ],
      elseClause: 'else do this'
    };
    const artifact = buildCQL(withErrors);
    const converted = artifact.toString();

    const expectedResult = `define "Errors":
  if "Recommendation" is null then
    {'Something went wrong.'}
  else if "Subpopulation 1" then
    if "Subpopulation 2" then
      {'Dual subpopulation error.'}
    else
      {'else do this'}
  else if "MeetsExclusionCriteria" then
    {'default sp 2'}
  else if not "MeetsInclusionCriteria" then
    {'default sp 1'}
  else
    {'else do this'}`.replace(/\n/g, '\r\n');

    expect(converted).to.have.string(expectedResult);
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

describe('Modifier tests', () => {
  const raw = _.cloneDeep(baseArtifact);
  raw.expTreeInclude = {
    id: 'And',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    fields: [
      {
        id: 'element_name',
        type: 'string',
        name: 'Group Name',
        value: 'MeetsInclusionCriteria'
      },
      { id: 'comment', name: 'Comment', type: 'textarea' }
    ],
    uniqueId: 'And-1',
    childInstances: [
      {
        id: 'StatinAllergen',
        name: 'Statin Allergen',
        extends: 'GenericAllergyIntolerance',
        fields: [
          {
            id: 'element_name',
            value: 'StatinAllergen',
            type: 'string',
            name: 'Element Name'
          },
          {
            id: 'allergyIntolerance',
            static: true,
            value: 'statin_allergen',
            type: 'allergyIntolerance',
            name: 'Allergy Intolerance'
          },
          {
            id: 'comment',
            name: 'Comment',
            type: 'textarea'
          }
        ],
        returnType: 'list_of_allergy_intolerances',
        type: 'element',
        uniqueId: 'StatinAllergen-3',
        modifiers: [
          {
            id: 'ActiveOrConfirmedAllergyIntolerance',
            name: 'Active Or Confirmed',
            inputTypes: ['list_of_allergy_intolerances'],
            returnType: 'list_of_allergy_intolerances',
            cqlTemplate: 'BaseModifier',
            cqlLibraryFunction: 'C3F.ActiveOrConfirmedAllergyIntolerance'
          },
          {
            id: 'Count',
            name: 'Count',
            inputTypes: [
              'list_of_observations',
              'list_of_conditions',
              'list_of_medication_statements',
              'list_of_medication_requests',
              'list_of_procedures',
              'list_of_allergy_intolerances',
              'list_of_encounters',
              'list_of_immunizations',
              'list_of_devices',
              'list_of_any',
              'list_of_booleans',
              'list_of_service_requests',
              'list_of_system_quantities',
              'list_of_system_concepts',
              'list_of_system_codes',
              'list_of_integers',
              'list_of_datetimes',
              'list_of_strings',
              'list_of_decimals',
              'list_of_times',
              'list_of_others'
            ],
            returnType: 'integer',
            cqlTemplate: 'BaseModifier',
            cqlLibraryFunction: 'Count'
          },
          {
            id: 'ValueComparisonNumber',
            name: 'Value Comparison',
            inputTypes: ['integer', 'decimal'],
            returnType: 'boolean',
            validator: { type: 'require', fields: ['minValue', 'minOperator'], args: null },
            values: { minOperator: '>', minValue: 0, maxOperator: undefined, maxValue: '', unit: '' },
            cqlTemplate: 'ValueComparisonNumber',
            comparisonOperator: null
          }
        ]
      }
    ],
    path: ''
  };
  raw.expTreeExclude = {
    id: 'And',
    name: '',
    conjunction: true,
    returnType: 'boolean',
    fields: [
      {
        id: 'element_name',
        type: 'string',
        name: 'Group Name',
        value: 'MeetsExclusionCriteria'
      },
      { id: 'comment', name: 'Comment', type: 'textarea' }
    ],
    uniqueId: 'And-2',
    childInstances: [],
    path: ''
  };
  raw.errorStatement = { ifThenClauses: [], elseClause: '' };
  const rawQuery = _.cloneDeep(raw);
  rawQuery.expTreeInclude.childInstances[0].modifiers = [
    {
      inputTypes: ['list_of_allergy_intolerances'],
      returnType: 'list_of_allergy_intolerances',
      where: {
        conjunctionType: 'and',
        rules: [
          {
            ruleType: 'isNotNull',
            resourceProperty: 'onsetDateTime'
          },
          {
            conjunctionType: 'or',
            rules: [
              {
                ruleType: 'isNotNull',
                resourceProperty: 'verificationStatus'
              },
              {
                ruleType: 'isNull',
                resourceProperty: 'clinicalStatus'
              }
            ]
          }
        ]
      }
    }
  ];
  const rawStandardAndQuery = _.cloneDeep(raw);
  rawStandardAndQuery.expTreeInclude.childInstances[0].modifiers = [
    {
      id: 'ActiveOrConfirmedAllergyIntolerance',
      name: 'Active Or Confirmed',
      inputTypes: ['list_of_allergy_intolerances'],
      returnType: 'list_of_allergy_intolerances',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'C3F.ActiveOrConfirmedAllergyIntolerance'
    },
    {
      inputTypes: ['list_of_allergy_intolerances'],
      returnType: 'list_of_allergy_intolerances',
      where: {
        conjunctionType: 'and',
        rules: [
          {
            ruleType: 'isNotNull',
            resourceProperty: 'onsetDateTime'
          },
          {
            conjunctionType: 'or',
            rules: [
              {
                ruleType: 'isNotNull',
                resourceProperty: 'verificationStatus'
              },
              {
                ruleType: 'isNull',
                resourceProperty: 'clinicalStatus'
              }
            ]
          }
        ]
      }
    }
  ];

  it('Handles modifiers', () => {
    const artifact = buildCQL(raw);
    const converted = artifact.toString();
    expect(converted).to.contain('Count(C3F.ActiveOrConfirmedAllergyIntolerance([AllergyIntolerance])) > 0');
  });

  it('Handles query modifiers (R4 4.0.x)', () => {
    const rawQueryR4 = _.cloneDeep(rawQuery);
    rawQueryR4.dataModel.version = '4.0.x';
    const artifact = buildCQL(rawQueryR4);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (AI.onset as FHIR.dateTime is not null ' +
        'and (AI.verificationStatus is not null or AI.clinicalStatus is null))'
    );
  });

  it('Handles query modifiers (R4 4.0.1)', () => {
    const rawQueryR4 = _.cloneDeep(rawQuery);
    rawQueryR4.dataModel.version = '4.0.1';
    const artifact = buildCQL(rawQueryR4);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (AI.onset as FHIR.dateTime is not null ' +
        'and (AI.verificationStatus is not null or AI.clinicalStatus is null))'
    );
  });

  it('Handles query modifiers (R4 4.0.0)', () => {
    const rawQueryR4 = _.cloneDeep(rawQuery);
    rawQueryR4.dataModel.version = '4.0.0';
    const artifact = buildCQL(rawQueryR4);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (AI.onset as FHIR.dateTime is not null ' +
        'and (AI.verificationStatus is not null or AI.clinicalStatus is null))'
    );
  });

  it('Handles query modifiers (STU3)', () => {
    const rawQuerySTU3 = _.cloneDeep(rawQuery);
    rawQuerySTU3.dataModel.version = '3.0.0';
    const artifact = buildCQL(rawQuerySTU3);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (AI.onset as FHIR.dateTime is not null ' +
        'and (AI.verificationStatus is not null or AI.clinicalStatus is null))'
    );
  });

  it('Handles query modifiers (DSTU2)', () => {
    const rawQueryDSTU2 = _.cloneDeep(rawQuery);
    rawQueryDSTU2.dataModel.version = '1.0.2';
    const artifact = buildCQL(rawQueryDSTU2);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (AI.onsetDateTime is not null ' +
        'and (AI.verificationStatus is not null or AI.clinicalStatus is null))'
    );
  });

  it('Handles standard and query modifiers', () => {
    const artifact = buildCQL(rawStandardAndQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '(C3F.ActiveOrConfirmedAllergyIntolerance([AllergyIntolerance])) AI where ' +
        '(AI.onset as FHIR.dateTime is not null and (AI.verificationStatus is not null or AI.clinicalStatus is null))'
    );
  });
});

describe('CQL Operator Templates', () => {
  const raw = _.cloneDeep(baseArtifact);
  raw.expTreeInclude = {
    id: 'And',
    name: 'And',
    conjunction: true,
    returnType: 'boolean',
    fields: [
      {
        id: 'element_name',
        type: 'string',
        name: 'Group Name',
        value: 'MeetsInclusionCriteria'
      },
      { id: 'comment', name: 'Comment', type: 'textarea' }
    ],
    uniqueId: 'And-1',
    childInstances: [
      {
        id: 'GenericAllergyIntolerance_vsac',
        name: 'AllergyIntolerance',
        returnType: 'list_of_allergy_intolerances',
        suppress: true,
        extends: 'Base',
        template: 'GenericAllergyIntolerance',
        fields: [
          {
            id: 'element_name',
            type: 'string',
            name: 'Element Name',
            value: 'Statin Allergen'
          },
          {
            id: 'comment',
            type: 'textarea',
            name: 'Comment'
          },
          {
            id: 'allergyIntolerance',
            type: 'allergyIntolerance_vsac',
            name: 'Allergy Intolerance',
            // NO VALUESETS JUST TO KEEP CQL SIMPLER
            // valueSets: [{
            //   name: 'Statin Allergen',
            //   oid: '2.16.840.1.113762.1.4.1110.42'
            // }],
            static: true
          }
        ],
        type: 'element',
        uniqueId: 'GenericAllergyIntolerance_vsac-3',
        tab: 'expTreeInclude',
        modifiers: []
      },
      {
        id: 'GenericObservation_vsac',
        name: 'Observation',
        returnType: 'list_of_observations',
        suppress: true,
        extends: 'Base',
        template: 'GenericObservation',
        suppressedModifiers: ['ConvertToMgPerdL'],
        fields: [
          {
            id: 'element_name',
            type: 'string',
            name: 'Element Name',
            value: 'LDL Cholesterol'
          },
          {
            id: 'comment',
            type: 'textarea',
            name: 'Comment'
          },
          {
            id: 'observation',
            type: 'observation_vsac',
            name: 'Observation',
            // NO VALUESETS JUST TO KEEP CQL SIMPLER
            // valueSets: [{
            //   name: 'LDL-c',
            //   oid: '2.16.840.1.113883.3.117.1.7.1.215'
            // }],
            static: true
          }
        ],
        type: 'element',
        uniqueId: 'GenericObservation_vsac-7',
        tab: 'expTreeInclude',
        modifiers: []
      }
    ],
    path: ''
  };
  raw.expTreeExclude = {
    id: 'Or',
    name: 'Or',
    conjunction: true,
    returnType: 'boolean',
    fields: [
      {
        id: 'element_name',
        type: 'string',
        name: 'Group Name',
        value: 'MeetsExclusionCriteria'
      },
      { id: 'comment', name: 'Comment', type: 'textarea' }
    ],
    uniqueId: 'Or-2',
    childInstances: [],
    path: ''
  };
  raw.errorStatement = { ifThenClauses: [], elseClause: '' };
  const rawBaseQuery = _.cloneDeep(raw);

  beforeEach(() => {
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers = [
      {
        inputTypes: ['list_of_allergy_intolerances'],
        returnType: 'list_of_allergy_intolerances',
        // add a placeholder where clause since an empty where clause is invalid and each test
        // likely only sets the where clause of the childInstance it is testing
        where: {
          conjunctionType: 'and',
          rules: [
            {
              ruleType: 'isNull',
              resourceProperty: 'placeHolder'
            }
          ]
        }
      }
    ];
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers = [
      {
        inputTypes: ['list_of_observations'],
        returnType: 'list_of_observations',
        // add a placeholder where clause since an empty where clause is invalid and each test
        // likely only sets the where clause of the childInstance it is testing
        where: {
          conjunctionType: 'and',
          rules: [
            {
              ruleType: 'isNull',
              resourceProperty: 'placeHolder'
            }
          ]
        }
      }
    ];
  });

  it('Handles isNull template for simple property', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'isNull',
          resourceProperty: 'verificationStatus'
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.verificationStatus is null)');
  });

  it('Handles isNull template for FHIR R4 choice property', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'isNull',
          resourceProperty: 'valueQuantity'
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    // NOTE: valueQuantity --> value as FHIR.Quantity
    expect(converted).to.contain('[Observation] Ob where (Ob.value as FHIR.Quantity is null)');
  });

  it('Handles isNull template for FHIR STU3 choice property', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'isNull',
          resourceProperty: 'valueQuantity'
        }
      ]
    };
    const stu3RawBaseQuery = _.cloneDeep(rawBaseQuery);
    (stu3RawBaseQuery.dataModel = { name: 'FHIR', version: '3.0.0' }),
      (stu3RawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest);
    const artifact = buildCQL(stu3RawBaseQuery);
    const converted = artifact.toString();
    // NOTE: valueQuantity --> value as FHIR.Quantity
    expect(converted).to.contain('[Observation] Ob where (Ob.value as FHIR.Quantity is null)');
  });

  it('Handles isNull template for FHIR DSTU2 choice property', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'isNull',
          resourceProperty: 'valueQuantity'
        }
      ]
    };
    const stu3RawBaseQuery = _.cloneDeep(rawBaseQuery);
    (stu3RawBaseQuery.dataModel = { name: 'FHIR', version: '1.0.2' }),
      (stu3RawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest);
    const artifact = buildCQL(stu3RawBaseQuery);
    const converted = artifact.toString();
    // NOTE: valueQuantity stays as-is (no cast)
    expect(converted).to.contain('[Observation] Ob where (Ob.valueQuantity is null)');
  });

  it('Handles isNotNull template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'isNotNull',
          resourceProperty: 'verificationStatus'
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.verificationStatus is not null)');
  });

  it('Handles listIsEmpty template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listIsEmpty',
          resourceProperty: 'category',
          notSelectorValue: 'not exists'
        }
      ]
    };

    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (not exists AI.category)');
  });

  it('Handles listLengthComparison template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listLengthComparison',
          comparisonOperator: '>',
          comparisonValue: '3',
          resourceProperty: 'category'
        }
      ]
    };

    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (Count(AI.category) > 3)');
  });

  it('Handles isTrueFalse template', () => {
    const templateTest = {
      conjunctionType: 'or',
      rules: [
        {
          ruleType: 'isTrueFalse',
          resourceProperty: 'someBooleanProperty',
          booleanValue: false
        },
        {
          ruleType: 'isTrueFalse',
          resourceProperty: 'someBooleanProperty',
          booleanValue: true
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (AI.someBooleanProperty is false or AI.someBooleanProperty is true)'
    );
  });

  it('Handles codeConceptInValueSet template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'codeConceptInValueSet',
          resourceProperty: 'someCodeProperty',
          valueset: {
            name: 'My Value Set',
            oid: '1.2.3.4.5.6.7.8.9'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      `valueset "My Value Set VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/1.2.3.4.5.6.7.8.9'`
    );
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.someCodeProperty in "My Value Set VS")');
  });

  it('Handles codeConceptInValueSet template with valueset name containing quote character', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'codeConceptInValueSet',
          resourceProperty: 'someCodeProperty',
          valueset: {
            name: 'My "Value" Set',
            oid: '1.2.3.4.5.6.7.8.9'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      `valueset "My \\"Value\\" Set VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/1.2.3.4.5.6.7.8.9'`
    );
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.someCodeProperty in "My \\"Value\\" Set VS")');
  });

  it('Handles codeConceptInValueSet template with two value sets having the same name', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'codeConceptInValueSet',
          resourceProperty: 'someCodeProperty',
          valueset: {
            name: 'My Value Set',
            oid: '1.2.3.4.5.6.7.8.9'
          }
        },
        {
          ruleType: 'codeConceptInValueSet',
          resourceProperty: 'someOtherCodeProperty',
          valueset: {
            name: 'My Value Set',
            oid: '9.8.7.6.5.4.3.2.1'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      `valueset "My Value Set VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/1.2.3.4.5.6.7.8.9'`
    );
    expect(converted).to.contain(
      `valueset "My Value Set VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/9.8.7.6.5.4.3.2.1'`
    );
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[AllergyIntolerance] AI where (AI.someCodeProperty in "My Value Set VS" and AI.someOtherCodeProperty in "My Value Set VS_1")'
    );
  });

  it('Handles codeConceptNotInValueSet template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'codeConceptNotInValueSet',
          resourceProperty: 'someCodeProperty',
          valueset: {
            name: 'My Value Set',
            oid: '1.2.3.4.5.6.7.8.9'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      `valueset "My Value Set VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/1.2.3.4.5.6.7.8.9'`
    );
    expect(converted).to.contain('[AllergyIntolerance] AI where (not (AI.someCodeProperty in "My Value Set VS"))');
  });

  it('Handles codeConceptMatchesConcept template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'codeConceptMatchesConcept',
          resourceProperty: 'someCodeProperty',
          conceptValue: {
            code: 'Some-Code',
            display: 'Some Display',
            system: 'Some-System',
            uri: 'http://some-system.org'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.someCodeProperty ~ "Some Display code")');
  });

  it('Handles codeConceptInListOfConcept template with FHIR.CodeableConcept property and single code selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'codeConceptInListOfConcept',
          resourceProperty: 'valueCodeableConcept',
          conceptValue: {
            code: 'Some-Code',
            display: 'Some Display',
            system: 'Some-System',
            uri: 'http://some-system.org'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain('[Observation] Ob where (Ob.value as FHIR.CodeableConcept ~ "Some Display code")');
  });

  // eslint-disable-next-line max-len
  it('Handles codeConceptInListOfConcept template with FHIR.CodeableConcept property and multiple codes selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'codeConceptInListOfConcept',
          resourceProperty: 'valueCodeableConcept',
          conceptValues: [
            {
              code: 'Some-Code',
              display: 'Some Display',
              system: 'Some-System',
              uri: 'http://some-system.org'
            },
            {
              code: 'Some-Other-Code',
              display: 'Some Other Display',
              system: 'Some-Other-System',
              uri: 'http://some-other-system.org'
            }
          ]
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`codesystem "Some-Other-System": 'http://some-other-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain(
      `code "Some Other Display code": 'Some-Other-Code' from "Some-Other-System" display 'Some Other Display'`
    );
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (exists (({"Some Display code", "Some Other Display code"}) CODE where Ob.value as FHIR.CodeableConcept ~ CODE))'
    );
  });

  // eslint-disable-next-line max-len
  it('Handles codeConceptInListOfConcept template with FHIR.CodeableConcept property and disambuguates codes with same name but different systems', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'codeConceptInListOfConcept',
          resourceProperty: 'valueCodeableConcept',
          conceptValues: [
            {
              code: 'Some-Code',
              display: 'Some Display',
              system: 'Some-System',
              uri: 'http://some-system.org'
            },
            {
              code: 'Some-Code',
              display: 'Some Display',
              system: 'Some-Other-System',
              uri: 'http://some-other-system.org'
            }
          ]
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`codesystem "Some-Other-System": 'http://some-other-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain(
      `code "Some Display code_1": 'Some-Code' from "Some-Other-System" display 'Some Display'`
    );
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (exists (({"Some Display code", "Some Display code_1"}) CODE where Ob.value as FHIR.CodeableConcept ~ CODE))'
    );
  });

  // eslint-disable-next-line max-len
  it('Handles codeConceptNotInListOfConcept template with FHIR.CodeableConcept property and single code selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'codeConceptNotInListOfConcept',
          resourceProperty: 'valueCodeableConcept',
          conceptValue: {
            code: 'Some-Code',
            display: 'Some Display',
            system: 'Some-System',
            uri: 'http://some-system.org'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain('[Observation] Ob where (Ob.value as FHIR.CodeableConcept !~ "Some Display code")');
  });

  // eslint-disable-next-line max-len
  it('Handles codeConceptNotInListOfConcept template with FHIR.CodeableConcept property and multiple codes selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'codeConceptNotInListOfConcept',
          resourceProperty: 'valueCodeableConcept',
          conceptValues: [
            {
              code: 'Some-Code',
              display: 'Some Display',
              system: 'Some-System',
              uri: 'http://some-system.org'
            },
            {
              code: 'Some-Other-Code',
              display: 'Some Other Display',
              system: 'Some-Other-System',
              uri: 'http://some-other-system.org'
            }
          ]
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`codesystem "Some-Other-System": 'http://some-other-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain(
      `code "Some Other Display code": 'Some-Other-Code' from "Some-Other-System" display 'Some Other Display'`
    );
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (not exists (({"Some Display code", "Some Other Display code"}) CODE where Ob.value as FHIR.CodeableConcept ~ CODE))'
    );
  });

  it('Handles listCodeConceptContainsConcept template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listCodeConceptContainsConcept',
          resourceProperty: 'category',
          conceptValue: {
            code: 'Some-Code',
            display: 'Some Display',
            system: 'Some-System',
            uri: 'http://some-system.org'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (exists (Ob.category CODE where CODE ~ "Some Display code"))'
    );
  });

  it('Handles listCodeConceptIsPerfectSubsetOfListConcept template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listCodeConceptIsPerfectSubsetOfListConcept',
          resourceProperty: 'category',
          conceptValues: [
            {
              code: 'Some-Code',
              display: 'Some Display',
              system: 'Some-System',
              uri: 'http://some-system.org'
            },
            {
              code: 'Some-Other-Code',
              display: 'Some Other Display',
              system: 'Some-Other-System',
              uri: 'http://some-other-system.org'
            }
          ]
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`codesystem "Some-Other-System": 'http://some-other-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain(
      `code "Some Other Display code": 'Some-Other-Code' from "Some-Other-System" display 'Some Other Display'`
    );
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (AllTrue(Ob.category CODE return exists (({"Some Display code", "Some Other Display code"}) TARGET_CODE where TARGET_CODE ~ CODE)))'
    );
  });

  it('Handles listCodeConceptIsPerfectSubsetOfListConcept template with single code selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listCodeConceptIsPerfectSubsetOfListConcept',
          resourceProperty: 'category',
          conceptValues: [
            {
              code: 'Some-Code',
              display: 'Some Display',
              system: 'Some-System',
              uri: 'http://some-system.org'
            }
          ]
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (AllTrue(Ob.category CODE return CODE ~ "Some Display code"))'
    );
  });

  it('Handles listCodeConceptIntersectsListConcept template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listCodeConceptIntersectsListConcept',
          resourceProperty: 'category',
          conceptValues: [
            {
              code: 'Some-Code',
              display: 'Some Display',
              system: 'Some-System',
              uri: 'http://some-system.org'
            },
            {
              code: 'Some-Other-Code',
              display: 'Some Other Display',
              system: 'Some-Other-System',
              uri: 'http://some-other-system.org'
            }
          ]
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`codesystem "Some-Other-System": 'http://some-other-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain(
      `code "Some Other Display code": 'Some-Other-Code' from "Some-Other-System" display 'Some Other Display'`
    );
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (exists (Ob.category CODE with ({"Some Display code", "Some Other Display code"}) TARGET_CODE such that CODE ~ TARGET_CODE))'
    );
  });

  it('Handles listCodeConceptIntersectsListConcept template with single code selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listCodeConceptIntersectsListConcept',
          resourceProperty: 'category',
          conceptValues: [
            {
              code: 'Some-Code',
              display: 'Some Display',
              system: 'Some-System',
              uri: 'http://some-system.org'
            }
          ]
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (exists (Ob.category CODE where CODE ~ "Some Display code"))'
    );
  });

  it('Handles listCodeConceptNotIntersectsListConcept template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listCodeConceptNotIntersectsListConcept',
          resourceProperty: 'category',
          conceptValues: [
            {
              code: 'Some-Code',
              display: 'Some Display',
              system: 'Some-System',
              uri: 'http://some-system.org'
            },
            {
              code: 'Some-Other-Code',
              display: 'Some Other Display',
              system: 'Some-Other-System',
              uri: 'http://some-other-system.org'
            }
          ]
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`codesystem "Some-Other-System": 'http://some-other-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain(
      `code "Some Other Display code": 'Some-Other-Code' from "Some-Other-System" display 'Some Other Display'`
    );
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (not exists (Ob.category CODE with ({"Some Display code", "Some Other Display code"}) TARGET_CODE such that CODE ~ TARGET_CODE))'
    );
  });

  it('Handles listCodeConceptNotIntersectsListConcept template with single code selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listCodeConceptNotIntersectsListConcept',
          resourceProperty: 'category',
          conceptValues: [
            {
              code: 'Some-Code',
              display: 'Some Display',
              system: 'Some-System',
              uri: 'http://some-system.org'
            }
          ]
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (not exists (Ob.category CODE where CODE ~ "Some Display code"))'
    );
  });

  it('Handles listCodeConceptIsPerfectSubsetOfValueset template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listCodeConceptIsPerfectSubsetOfValueset',
          resourceProperty: 'category',
          valueset: {
            name: 'Value Set',
            oid: '2.16'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`valueset "Value Set VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16'`);
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (AllTrue(Ob.category CODE return CODE in "Value Set VS"))'
    );
  });

  it('Handles listCodeConceptIntersectsValueset template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listCodeConceptIntersectsValueset',
          resourceProperty: 'category',
          valueset: {
            name: 'Value Set',
            oid: '2.16'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`valueset "Value Set VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16'`);
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (exists (Ob.category CODE where CODE in "Value Set VS"))'
    );
  });

  it('Handles listCodeConceptNotIntersectsValueset template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'listCodeConceptNotIntersectsValueset',
          resourceProperty: 'category',
          valueset: {
            name: 'Value Set',
            oid: '2.16'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`valueset "Value Set VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16'`);
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (not exists (Ob.category CODE where CODE in "Value Set VS"))'
    );
  });

  it('Handles predefinedConceptComparisonSingular template with FHIR.code property and single code selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'predefinedConceptComparisonSingular',
          resourceProperty: 'status',
          codeValue: ['final']
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain("[Observation] Ob where (Ob.status = 'final')");
  });

  it('Handles predefinedConceptComparisonSingular template with FHIR.code property and multiple codes selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'predefinedConceptComparisonSingular',
          resourceProperty: 'status',
          codeValue: ['amended', 'final']
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain("[Observation] Ob where (Ob.status in {'amended', 'final'})");
  });

  // eslint-disable-next-line max-len
  it('Handles predefinedConceptComparisonSingular template with FHIR.CodeableConcept property and single code selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'predefinedConceptComparisonSingular',
          resourceProperty: 'clinicalStatus',
          codeValue: ['active']
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      `codesystem "AllergyIntolerance Clinical Status": 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical'`
    );
    expect(converted).to.contain(
      `code "Active code": 'active' from "AllergyIntolerance Clinical Status" display 'Active'`
    );
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.clinicalStatus ~ "Active code")');
  });

  // eslint-disable-next-line max-len
  it('Handles predefinedConceptComparisonSingular template with FHIR.CodeableConcept property and multiple codes selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'predefinedConceptComparisonSingular',
          resourceProperty: 'clinicalStatus',
          codeValue: ['active', 'resolved']
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      `codesystem "AllergyIntolerance Clinical Status": 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical'`
    );
    expect(converted).to.contain(
      `code "Active code": 'active' from "AllergyIntolerance Clinical Status" display 'Active'`
    );
    expect(converted).to.contain(
      `code "Resolved code": 'resolved' from "AllergyIntolerance Clinical Status" display 'Resolved'`
    );
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (exists (({"Active code", "Resolved code"}) CODE where AI.clinicalStatus ~ CODE))'
    );
  });

  // eslint-disable-next-line max-len
  it('Handles predefinedConceptComparisonPlural template with FHIR.code property and single code selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'predefinedConceptComparisonPlural',
          resourceProperty: 'category',
          codeValue: ['biologic']
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain("[AllergyIntolerance] AI where (exists (AI.category CODE where CODE = 'biologic'))");
  });

  // eslint-disable-next-line max-len
  it('Handles predefinedConceptComparisonPlural template with FHIR.code property and multiple codes selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'predefinedConceptComparisonPlural',
          resourceProperty: 'category',
          codeValue: ['biologic', 'food']
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      "[AllergyIntolerance] AI where (exists (AI.category CODE where CODE in {'biologic', 'food'}))"
    );
  });

  // eslint-disable-next-line max-len
  it('Handles predefinedConceptComparisonPlural template with FHIR.CodeableConcept property and single code selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'predefinedConceptComparisonPlural',
          resourceProperty: 'category',
          codeValue: ['vital-signs']
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      `codesystem "Observation Category": 'http://terminology.hl7.org/CodeSystem/observation-category'`
    );
    expect(converted).to.contain(
      `code "Vital Signs code": 'vital-signs' from "Observation Category" display 'Vital Signs'`
    );
    expect(converted).to.contain('[Observation] Ob where (exists (Ob.category CODE where CODE ~ "Vital Signs code"))');
  });

  // eslint-disable-next-line max-len
  it('Handles predefinedConceptComparisonPlural template with FHIR.CodeableConcept property and multiple codes selected', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'predefinedConceptComparisonPlural',
          resourceProperty: 'category',
          codeValue: ['vital-signs', 'laboratory']
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      `codesystem "Observation Category": 'http://terminology.hl7.org/CodeSystem/observation-category'`
    );
    expect(converted).to.contain(
      `code "Vital Signs code": 'vital-signs' from "Observation Category" display 'Vital Signs'`
    );
    expect(converted).to.contain(
      `code "Laboratory code": 'laboratory' from "Observation Category" display 'Laboratory'`
    );
    expect(converted).to.contain(
      // eslint-disable-next-line max-len
      '[Observation] Ob where (exists (Ob.category CODE with ({"Vital Signs code", "Laboratory code"}) TARGET_CODE such that CODE ~ TARGET_CODE))'
    );
  });

  it('Handles dateWithinLast template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateWithinLast',
          resourceProperty: 'recordedDate',
          durationValue: '7',
          timeUnit: 'years'
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (AI.recordedDate in Interval[Today() - 7 years, Today()])'
    );
  });

  it('Handles dateOccurredMoreThan template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateOccurredMoreThan',
          resourceProperty: 'recordedDate',
          durationValue: '9',
          timeUnit: 'months'
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.recordedDate more than 9 months before Today())');
  });

  it('Handles dateTimeWithinLast template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeWithinLast',
          resourceProperty: 'recordedDate',
          durationValue: '7',
          timeUnit: 'years'
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.recordedDate in Interval[Now() - 7 years, Now()])');
  });

  it('Handles dateTimeIntervalWithinLast template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeIntervalWithinLast',
          resourceProperty: 'onsetPeriod',
          userSpecifiedIndex: 'Starts Within Last',
          durationValue: '6',
          timeUnit: 'months'
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (AI.onset as FHIR.Period starts during Interval[Now() - 6 months, Now()])'
    );
  });

  it('Handles dateTimeOccurredMoreThan template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeOccurredMoreThan',
          resourceProperty: 'recordedDate',
          durationValue: '9',
          timeUnit: 'months'
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.recordedDate more than 9 months before Now())');
  });

  it('Handles dateTimeOccurred template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeOccurred',
          resourceProperty: 'recordedDate',
          when: 'On or After',
          userSpecifiedDateTime: {
            date: '2021-08-24',
            time: '07:05:19',
            str: '@2021-08-24T07:05:19'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.recordedDate on or after @2021-08-24T07:05:19)');
  });

  it('Handles dateTimeIntervalComparison template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeIntervalComparison',
          resourceProperty: 'recordedDate',
          userSpecifiedIndex: 'Starts',
          when: 'On or After',
          userSpecifiedDateTime: {
            date: '2021-08-24',
            time: '07:05:19',
            str: '@2021-08-24T07:05:19'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (AI.recordedDate starts on or after @2021-08-24T07:05:19)'
    );
  });

  it('Handles dateTimeOccursBetween template for FHIR.dateTime w/ dates and times', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeOccursBetween',
          resourceProperty: 'recordedDate',
          beginDateTime: {
            date: '2021-08-25',
            time: '07:04:40',
            str: '@2021-08-25T07:04:40'
          },
          endDateTime: {
            date: '2021-08-25',
            time: '07:04:40',
            str: '@2021-08-25T07:04:40'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (AI.recordedDate in Interval[@2021-08-25T07:04:40, @2021-08-25T07:04:40])'
    );
  });

  it('Handles dateTimeOccursBetween template for FHIR.dateTime w/ dates only', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeOccursBetween',
          resourceProperty: 'recordedDate',
          beginDateTime: {
            date: '2021-08-25',
            time: null,
            str: '@2021-08-25'
          },
          endDateTime: {
            date: '2021-08-25',
            time: null,
            str: '@2021-08-25'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[AllergyIntolerance] AI where (ToDate((AI.recordedDate).value) in Interval[@2021-08-25, @2021-08-25])'
    );
  });

  it('Handles dateTimeOccursBetween template for FHIR.instant w/ dates and times', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeOccursBetween',
          resourceProperty: 'issued',
          beginDateTime: {
            date: '2021-08-25',
            time: '07:04:40',
            str: '@2021-08-25T07:04:40'
          },
          endDateTime: {
            date: '2021-08-25',
            time: '07:04:40',
            str: '@2021-08-25T07:04:40'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[Observation] Ob where (Ob.issued in Interval[@2021-08-25T07:04:40, @2021-08-25T07:04:40])'
    );
  });

  it('Handles dateTimeOccursBetween template for FHIR.instant w/ dates only', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeOccursBetween',
          resourceProperty: 'issued',
          beginDateTime: {
            date: '2021-08-25',
            time: null,
            str: '@2021-08-25'
          },
          endDateTime: {
            date: '2021-08-25',
            time: null,
            str: '@2021-08-25'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      '[Observation] Ob where (ToDate((Ob.issued).value) in Interval[@2021-08-25, @2021-08-25])'
    );
  });

  it('Handles dateTimeIntervalContains template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeIntervalContains',
          resourceProperty: 'recordedDate',
          userSpecifiedDateTime: {
            date: '2021-08-24',
            time: '07:05:19',
            str: '@2021-08-24T07:05:19'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.recordedDate contains @2021-08-24T07:05:19)');
  });

  it('Handles dateTimeIntervalNotContains template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeIntervalNotContains',
          resourceProperty: 'recordedDate',
          userSpecifiedDateTime: {
            date: '2021-08-24',
            time: '07:05:19',
            str: '@2021-08-24T07:05:19'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (not (AI.recordedDate contains @2021-08-24T07:05:19))');
  });

  it('Handles dateTimeIntervalOverlaps template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'dateTimeIntervalOverlaps',
          resourceProperty: 'recordedDate',
          userSpecifiedTimeInterval: {
            firstDate: '2021-08-25',
            firstTime: '05:58:40',
            secondDate: '2021-08-26',
            secondTime: '07:58:40',
            str: 'Interval[@2021-08-25T05:58:40,@2021-08-26T07:58:40]'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(
      `[AllergyIntolerance] AI where (AI.recordedDate overlaps Interval[@2021-08-25T05:58:40,@2021-08-26T07:58:40])`
    );
  });

  it('Handles codeConceptNotMatchesConcept template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'codeConceptNotMatchesConcept',
          resourceProperty: 'someCodeProperty',
          conceptValue: {
            code: 'Some-Code',
            display: 'Some Display',
            system: 'Some-System',
            uri: 'http://some-system.org'
          }
        }
      ]
    };
    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain(`codesystem "Some-System": 'http://some-system.org'`);
    expect(converted).to.contain(`code "Some Display code": 'Some-Code' from "Some-System" display 'Some Display'`);
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.someCodeProperty !~ "Some Display code")');
  });

  it('Handles quantityComparison template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'quantityComparison',
          comparisonOperator: '>',
          quantity: { quantity: '3', unit: 'A', str: "3.0 'A'" },
          resourceProperty: 'valueQuantity'
        }
      ]
    };

    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain("[Observation] Ob where (Ob.value as FHIR.Quantity > 3 'A')");
  });

  it('Handles quantityIsBetweenQuantities template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'quantityIsBetweenQuantities',
          lowQuantity: { quantity: '1', unit: 'a', str: "1.0 'a'" },
          highQuantity: { quantity: '3', unit: 'a', str: "3.0 'a'" },
          resourceProperty: 'valueQuantity'
        }
      ]
    };

    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain("[Observation] Ob where (Ob.value as FHIR.Quantity between 1 'a' and 3 'a')");
  });

  it('Handles quantityIntervalComparison template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'quantityIntervalComparison',
          intervalComponent: 'Low',
          comparisonOperator: '>',
          comparisonOperand: { quantity: '3', unit: 'A', str: "3.0 'A'" },
          resourceProperty: 'valueRange'
        }
      ]
    };

    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain("[Observation] Ob where ((Ob.value as FHIR.Range).low > 3 'A')");
  });

  it('Handles quantityIntervalOverlapsQuantityInterval template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'quantityIntervalOverlapsQuantityInterval',
          numericInterval: { firstQuantity: '1', secondQuantity: '3', unit: 'A', str: "Interval[1 'A',3 'A']" },
          resourceProperty: 'valueRange'
        }
      ]
    };

    rawBaseQuery.expTreeInclude.childInstances[1].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain("[Observation] Ob where (Ob.value as FHIR.Range overlaps Interval[1 'A',3 'A'])");
  });

  it('Handles quantityIntervalContainsQuantity template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'quantityIntervalContainsQuantity',
          number: { quantity: '3', unit: 'A', str: "3.0 'A'" },
          resourceProperty: 'onsetRange'
        }
      ]
    };

    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain("[AllergyIntolerance] AI where (AI.onset as FHIR.Range contains 3 'A')");
  });

  it('Handles quantityIntervalNotContainsQuantity template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'quantityIntervalNotContainsQuantity',
          number: { quantity: '3', unit: 'A', str: "3.0 'A'" },
          resourceProperty: 'onsetRange'
        }
      ]
    };

    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain("[AllergyIntolerance] AI where (not (AI.onset as FHIR.Range contains 3 'A'))");
  });

  it('Handles ageComparison template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'ageComparison',
          comparisonOperator: '>',
          timeUnit: 'years',
          ageValue: '3',
          resourceProperty: 'onsetAge'
        }
      ]
    };

    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.onset as FHIR.Age > 3 years)');
  });

  it('Handles ageIsBetweenAges template', () => {
    const templateTest = {
      conjunctionType: 'and',
      rules: [
        {
          ruleType: 'ageIsBetweenAges',
          lowAgeValue: '1',
          lowTimeUnit: 'years',
          highAgeValue: '3',
          highTimeUnit: 'years',
          resourceProperty: 'onsetAge'
        }
      ]
    };

    rawBaseQuery.expTreeInclude.childInstances[0].modifiers[0].where = templateTest;
    const artifact = buildCQL(rawBaseQuery);
    const converted = artifact.toString();
    expect(converted).to.contain('[AllergyIntolerance] AI where (AI.onset as FHIR.Age between 1 years and 3 years)');
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
      return _.transform(object, function (result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
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
    expect(_.isEqual(emptyPL, testEmptyPublishableLibrary)).to.equal(true);
  });
  it('Creates a CPG Artifact with context and exports as a Publishable Library', () => {
    const testDates = new Artifact(datesCPGArtifact);
    const datePL = testDates.toPublishableLibrary();
    expect(_.isEqual(difference(datePL, testPublishableLibraryWithDates), {})).to.equal(true);
  });
  it('Creates a CPG Artifact with context and dates and exports as a Publishable Library', () => {
    const testContext = new Artifact(datesAndContextCPGArtifact);
    const contextPL = testContext.toPublishableLibrary();
    expect(_.isEqual(difference(contextPL, testPublishableLibraryWithDatesAndContext), {})).to.equal(true);
  });
  it('Creates a mostly complete CPG Artifact and exports as a Publishable Library', () => {
    const testArtifact = new Artifact(baseCPGArtifact);
    const cpgPL = testArtifact.toPublishableLibrary();
    expect(_.isEqual(difference(cpgPL, testPublishableLibrary), {})).to.equal(true);
  });
  it('Creates a mostly complete CPG Artifact with expanded context and exports as a Publishable Library', () => {
    const testCtxArtifact = new Artifact(contextCPGArtifact);
    const ecPL = testCtxArtifact.toPublishableLibrary();
    expect(_.isEqual(difference(ecPL, testExpandedContext), {})).to.equal(true);
  });
});

const nockBack = nock.back;
nockBack.fixtures = path.join(__dirname, 'fixtures');
nockBack.setMode('record');

describe('CQL to ELM tests', () => {
  let inputFiles, inputFileStreams, outputContent, outputHeaders;

  // before the tests, disable network connections to ensure tests never hit real network
  before(() => {
    // if another test suite de-activated nock, we need to re-activate it
    if (!nock.isActive()) nock.activate();
    nock.disableNetConnect();
  });

  // after the tests, re-enable network connections
  after(() => {
    nock.restore();
    nock.enableNetConnect();
  });

  // before each test, setup the commonly used data
  beforeEach(() => {
    // In AT, artifact CQL is sent as file objects and FHIRHelpers is sent as a filestream
    inputFiles = [
      {
        filename: 'Simple.cql',
        text: fs.readFileSync(path.join(__dirname, 'fixtures', 'Simple.cql'), 'utf-8'),
        type: 'application/cql'
      }
    ];
    inputFileStreams = [fs.createReadStream(path.join(__dirname, 'fixtures', 'FHIRHelpers.cql'))];
    // Output is a multi-part message w/ JSON and XML
    outputContent = fs
      .readFileSync(path.join(__dirname, 'fixtures', 'Simple-Response.txt'), 'utf-8')
      .replace(/[\n]/g, '\r\n');
    outputHeaders = {
      'MIME-Version': '1.0',
      'Content-Type': 'multipart/form-data;boundary=Boundary_5_1061164500_1637185497930'
    };
  });

  // after each test, check and clean nock
  afterEach(() => {
    nock.isDone();
    nock.cleanAll();
  });

  it('should send the right translation parameters to the CQL Translation Service', done => {
    nock('http://localhost:8080')
      .post('/cql/translator')
      .query({
        annotations: true,
        locators: true,
        'disable-list-demotion': true,
        'disable-list-promotion': true,
        'disable-method-invocation': true,
        'date-range-optimization': true,
        'result-types': true,
        'detailed-errors': false,
        'disable-list-traversal': false,
        signatures: 'All'
      })
      .reply(200, outputContent, outputHeaders);

    // Make the request!
    makeCQLtoELMRequest(inputFiles, inputFileStreams, true, err => {
      try {
        expect(err).to.be.null;
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should request JSON and XML from CQL Translation Service when getXML argument is true', done => {
    nock('http://localhost:8080', {
      reqheaders: { 'X-TargetFormat': 'application/elm+json,application/elm+xml' }
    })
      .post('/cql/translator')
      .query(true) // we don't care about checking the specific params for this test
      .reply(200, outputContent, outputHeaders);

    // Make the request!
    makeCQLtoELMRequest(inputFiles, inputFileStreams, true, err => {
      try {
        expect(err).to.be.null;
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should not request XML from CQL Translation Service when getXML argument is false', done => {
    nock('http://localhost:8080', {
      badheaders: ['X-TargetFormat']
    })
      .post('/cql/translator')
      .query(true) // we don't care about checking the specific params for this test
      .reply(200, outputContent, outputHeaders);

    // Make the request!
    makeCQLtoELMRequest(inputFiles, inputFileStreams, false, err => {
      try {
        expect(err).to.be.null;
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should process the multi-part response from the CQL Translation Service correctly', done => {
    nock('http://localhost:8080')
      .post('/cql/translator')
      .query(true) // we don't care about checking the specific params for this test
      .reply(200, outputContent, outputHeaders);

    // Make the request!
    makeCQLtoELMRequest(inputFiles, inputFileStreams, true, (err, elmFiles) => {
      try {
        expect(err).to.be.null;
        expect(elmFiles).to.have.length(4);
        expect(elmFiles[0].name).to.equal('FHIRHelpers.cql');
        expect(elmFiles[0].content).to.match(
          /\{\s*"library"[\s\S]*"identifier"\s*:\s*\{\s*"id"\s*:\s*"FHIRHelpers"[\s\S]*\}/m
        );
        expect(elmFiles[1].name).to.equal('FHIRHelpers.cql');
        expect(elmFiles[1].content).to.match(/<library[\s\S]*<identifier id="FHIRHelpers"[\s\S]*/m);
        expect(elmFiles[2].name).to.equal('Simple.cql');
        expect(elmFiles[2].content).to.match(
          /\{\s*"library"[\s\S]*"identifier"\s*:\s*\{\s*"id"\s*:\s*"SimpleLibrary"[\s\S]*\}/m
        );
        expect(elmFiles[3].name).to.equal('Simple.cql');
        expect(elmFiles[3].content).to.match(/<library[\s\S]*<identifier id="SimpleLibrary"[\s\S]*/m);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});

describe('CQL Formatter tests', () => {
  // before the tests, disable network connections to ensure tests never hit real network
  before(() => {
    // if another test suite de-activated nock, we need to re-activate it
    if (!nock.isActive()) nock.activate();
    nock.disableNetConnect();
  });

  // after the tests, re-enable network connections
  after(() => {
    nock.restore();
    nock.enableNetConnect();
  });

  // after each test, check and clean nock
  afterEach(() => {
    nock.isDone();
    nock.cleanAll();
  });

  it('should send a valid request to the CQL Formatter Service', done => {
    const inputContent = fs.readFileSync(path.join(__dirname, 'fixtures', 'UnformattedCQL.cql'), 'utf-8');
    const inputHeaders = { 'Content-Type': 'application/cql', Accept: 'application/cql' };
    const outputContent = fs.readFileSync(path.join(__dirname, 'fixtures', 'FormattedCQL.cql'), 'utf-8');
    const outputHeaders = { 'Content-Type': 'application/cql' };
    nock('http://localhost:8080', {
      reqheaders: inputHeaders
    })
      .post('/cql/formatter', inputContent)
      .reply(200, outputContent, outputHeaders);

    // Make the request!
    formatCQL(inputContent, (err, output) => {
      try {
        expect(err).to.be.null;
        expect(output).to.equal(outputContent);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should signal an error in the callback when the CQL Formatter Service responds with an error', done => {
    const inputContent = 'DEFINITELY NOT CQL';
    const inputHeaders = { 'Content-Type': 'application/cql', Accept: 'application/cql' };
    const outputContent = "CQL formatting failed due to errors:[1:0]: mismatched input 'DEFINITELY'";
    const outputHeaders = { 'Content-Type': 'text/plain' };
    nock('http://localhost:8080', {
      reqheaders: inputHeaders
    })
      .post('/cql/formatter', inputContent)
      .reply(400, outputContent, outputHeaders);

    // Make the request!
    formatCQL(inputContent, (err, output) => {
      try {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal(outputContent);
        expect(output).to.be.undefined;
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
