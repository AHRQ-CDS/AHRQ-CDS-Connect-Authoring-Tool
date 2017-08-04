const {expect} = require('chai');
const {buildCQL} = require('../../../../app/handlers/cqlHandler');
const _ = require('lodash');

const baseArtifact = {
  name: 'a test',
  version: '0.0.1',
  expTreeInclude: {},
  expTreeExclude: {},
  subpopulations: [],
  recommendations: [],
  booleanParameters: [],
  errorStatement: {},
  uniqueIdCounter:9999,
  version: null
};

describe('Basic CQL Handler Tests', () => {
  let raw = _.cloneDeep(baseArtifact);
  raw.expTreeInclude = {
    id:"And",
    name:"",
    conjunction:true,
    returnType:"boolean",
    parameters: [{
      id:"element_name",
      type:"string",
      name:"Group Name",
      value:"MeetsInclusionCriteria"
    }],
    uniqueId:"And-1",
    childInstances:[{
      id:"ASCVD",
      name:"ASCVD",
      extends:"GenericCondition",
      parameters:[
        {
          id:"element_name",
          value:"HasASCVD",
          type:"string",
          name:"Element Name"
        }, {
          id:"condition",
          static:true,
          value:"has_ascvd",
          type:"condition",
          name:"Condition"
        }
      ],
      returnType:"list_of_conditions",
      type:"element",
      uniqueId:"ASCVD-3",
      modifiers:[]
    }],
    path:""
  };
  raw.expTreeExclude = {
    id:"And",
    name:"",
    conjunction:true,
    returnType:"boolean",
    parameters:[{
      id:"element_name",
      type:"string",
      name:"Group Name",
      value:"MeetsExclusionCriteria"
    }],
    uniqueId:"And-2",
    childInstances:[{
      id:"TotalCholesterol",
      name:"Total Cholesterol",
      extends:"GenericObservation",
      surpressedModifiers:["ConceptValue"],
      parameters:[
        {
          id:"element_name",
          value:"TotalCholesterol",
          type:"string",
          name:"Element Name"
        }, {
          id:"observation",
          static:true,
          value:"total_cholesterol",
          type:"observation",
          name:"Observation"
        }
      ],
      returnType:"list_of_observations",
      type:"element",
      uniqueId:"TotalCholesterol-4",
      modifiers:[]
    }],
    path:""
  };
  raw.recommendations = [{"uid":"rec-53","grade":"A","subpopulations":[],"text":"One rec.","rationale":""}];
  raw.subpopulations = [
    {
      special:true,
      subpopulationName:"Doesn't Meet Inclusion Criteria",
      special_subpopulationName:'not "MeetsInclusionCriteria"',
      uniqueId:"default-subpopulation-1"
    }, {
      special:true,
      subpopulationName: "Meets Exclusion Criteria",
      special_subpopulationName:'"MeetsExclusionCriteria"',
      uniqueId:"default-subpopulation-2"
    }, {
      id:"And",
      name:"",
      conjunction:true,
      returnType:"boolean",
      parameters: [{"id":"element_name","type":"string","name":"Group Name"}],
      uniqueId:"And-0",
      childInstances:[{
        id:"AgeRange",
        name:"Age Range",
        returnType:"boolean",
        surpressedModifiers: ["BooleanNot","BooleanComparison"],
        parameters: [
          {
            id:"element_name",
            type:"string",
            name:"Element Name",
            value:"foo"
          }, {
            id:"min_age",
            type:"number",
            typeOfNumber:"integer",
            name:"Minimum Age",
            value:3
          }, {
            id:"max_age",
            type:"number",
            typeOfNumber:"integer",
            name:"Maximum Age",
            value:10
          }
        ],
        uniqueId:"AgeRange-5",
        modifiers:[]
      }],
      path:"",
      subpopulationName:"Subpopulation 1",
      expanded:true
    }
  ];
  raw.errorStatement = {
    statements: [{
      condition: { label:"Recommendations is null", value:'"Recommendation" is null' },
      thenClause:"Oh no!",
      child:null,
      useThenClause:true
    }]
    ,
    else: "null"
  };
  it('Ensure output definitions have the correct names', () => {
    let artifact = buildCQL(raw);
    const converted = artifact.toString();
    expect(converted).to.contain('define "Recommendation":');
    expect(converted).to.contain('define "MeetsInclusionCriteria":');
    expect(converted).to.contain('define "MeetsExclusionCriteria":');
    expect(converted).to.contain('define "Errors":');
    expect(converted).to.contain('define "Subpopulation 1":');
    expect(converted).to.match(/.*^\s*define "InPopulation":\s+"MeetsInclusionCriteria" and not "MeetsExclusionCriteria"\s+/m);
  });
});
