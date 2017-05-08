const ValueSets = require('../data/valueSets');

module.exports = {
  getAll: getAll,
  getOne: getOne
}

// Returns all ValueSets saved
function getAll(request, result) {
  result.json(ValueSets);
}

// Returns the nested ValueSet specified by the remaining path of the route
function getOne(request, result) {
  // Gets the ValueSet category specified
  let selectedObject = ValueSets[request.params.valueset];

  // Gets the nested ValueSet as deep as specified
  let path = request.params['0'].split('/');
  for (let i=0; i<path.length; i++) {
    let variable = path[i];
    if(variable !== '') {
      selectedObject = selectedObject[variable];
      if (selectedObject === undefined) {
        result.json("This level of ValueSet does not exist");
        break;
      }
    }
  }
  result.json(selectedObject);
}