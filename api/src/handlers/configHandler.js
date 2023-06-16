const Templates = require('../data/formTemplates');
const ValueSets = require('../data/valueSets');
const conversionsELMFile = require('../data/library_helpers/ELMFiles/AT_Internal_CDS_Connect_Conversions.json');
const queryResources = {
  dstu2_resources: require('../data/query_builder/dstu2_resources.json'),
  stu3_resources: require('../data/query_builder/stu3_resources.json'),
  r4_resources: require('../data/query_builder/r4_resources.json'),
  operators: require('../data/query_builder/operators.json')
};

// If new functions are added to AT_Internal_CDS_Connect_Conversions and a separate description is desired,
// add a key value pair to the following object with the descripton: function_name : function_description
const conversionFunctionDescriptions = { to_mg_per_dL: 'mmol/L to mg/dL for blood cholesterol' };

module.exports = {
  getTemplates,
  getValueSets,
  getOneValueSet,
  getConversionFunctions,
  getDSTU2Resources,
  getSTU3Resources,
  getR4Resources,
  getResourceOperators
};

// Returns all ValueSets saved
function getTemplates(request, result) {
  result.json(Templates);
}

// Returns all ValueSets saved
function getValueSets(request, result) {
  result.json(ValueSets);
}

// Returns the nested ValueSet specified by the remaining path of the route
function getOneValueSet(request, result) {
  // Gets the ValueSet category specified
  let selectedObject = ValueSets[request.params.valueset];
  if (selectedObject === undefined) {
    result.status(404).send('This level of ValueSet does not exists');
  }

  // Gets the nested ValueSet as deep as specified
  const path = request.params['0'].split('/');
  for (let i = 0; i < path.length; i++) {
    const variable = path[i];
    if (variable !== '') {
      selectedObject = selectedObject[variable];
      if (selectedObject === undefined) {
        result.status(404).send('This level of ValueSet does not exist');
        break;
      }
    }
  }
  result.json(selectedObject);
}

function getConversionFunctions(request, result) {
  const definedExpressions = conversionsELMFile.library.statements.def;
  const convertFunctions = definedExpressions.map(def => {
    // If a description is not defined above, just use the function name
    let description = def.name;
    if (conversionFunctionDescriptions[def.name] !== undefined) {
      description = conversionFunctionDescriptions[def.name];
    }
    return { name: `Convert.${def.name}`, description };
  });
  result.json(convertFunctions);
}

function getDSTU2Resources(request, result) {
  result.json(queryResources['dstu2_resources']);
}

function getSTU3Resources(request, result) {
  result.json(queryResources['stu3_resources']);
}

function getR4Resources(request, result) {
  result.json(queryResources['r4_resources']);
}

function getResourceOperators(request, result) {
  result.json(queryResources['operators']);
}
