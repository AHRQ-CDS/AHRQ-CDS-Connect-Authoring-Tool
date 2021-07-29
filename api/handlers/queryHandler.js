const queryResources = {
  dstu2_resources: require('../data/query_builder/dstu2_resources.json'),
  stu3_resources: require('../data/query_builder/stu3_resources.json'),
  r4_resources: require('../data/query_builder/r4_resources.json'),
  operators: require('../data/query_builder/operators.json')
};

function implicitConversionInfo(req, res) {
  let info = queryResources.operators.implicitConversionInfo;
  if (info) res.json(info);
  else res.status(404);
}

function operatorQuery(req, res) {
  let acceptableTypes = [];
  let operatorArray = queryResources.operators.operators;
  let [typeSpecifier, elementType] = [req.query.typeSpecifier, req.query.elementType];

  if (typeSpecifier && elementType) {
    acceptableTypes.push(elementType);
    acceptableTypes.push('System.Any');
    let filterArray = operatorArray.filter(obj => {
      return (
        obj.primaryOperand.typeSpecifier === typeSpecifier &&
        acceptableTypes.some(type => obj.primaryOperand.elementTypes.includes(type))
      );
    });
    if (filterArray.length) res.json(filterArray);
    else res.sendStatus(404);
  } else res.sendStatus(400);
}

function resourceQuery(req, res) {
  let resourceName = req.params.resourceName;
  let resource = resourceSelector(req.query.fhirVersion);

  if (resourceName && resource) {
    let filterArray = resource.resources.filter(obj => {
      return obj.name === resourceName;
    });
    if (filterArray.length) res.json(filterArray);
    else res.sendStatus(404);
  } else res.sendStatus(400);
}

function resourceSelector(fhirVersion) {
  if (fhirVersion === '1.0.2') return queryResources.dstu2_resources;
  else if (fhirVersion === '3.0.0') return queryResources.stu3_resources;
  else if (fhirVersion === '4.0.0') return queryResources.r4_resources;
  else return '';
}

module.exports = {
  implicitConversionInfo,
  operatorQuery,
  resourceQuery
};
