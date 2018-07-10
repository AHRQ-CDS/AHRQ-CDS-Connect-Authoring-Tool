const Templates = require('../data/formTemplates');
const ValueSets = require('../data/valueSets');
const config = require('../config');
const conversionsELMFile = require('../data/library_helpers/ELMFiles/CDS_Connect_Conversions.json');

// If new functions are added to CDS_Connect_Conversions and a separate description is desired, add a key value
// pair to the following object with the descripton: function_name : function_description
const conversionFunctionDescriptions = { 'to_mg_per_dL': 'mmol/L to mg/dL for blood cholesterol' };

module.exports = {
  getTemplates,
  getValueSets,
  getOneValueSet,
  getRepoPublishConfig,
  getConversionFunctions
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

function getRepoPublishConfig(request, result) {
  result.json(config.get('repo.publish'));
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
