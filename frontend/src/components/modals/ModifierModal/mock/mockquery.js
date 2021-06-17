// This file serves to house mocks for api routes/handlers that are WIP.
// The idea here is to add a facility that will mock the queries to the backend
// in the most realistic way possible, hopefully enough to make the real queries
// a drop in replacement for the mock queries defined here.

// Note: THESE FUNCTIONS ALL RETURN PROMISES in order to force future developers to keep
// in mind that this data eventually will ALL COME FROM THE BACKEND and therefore
// enforce conventions related to promise fulfillment/rejection as not to introduce
// bugs into the system.

// Another Note: async functions implicitly wrap any return in a promise. This is why
// there are no explicit usages of Promise.

import * as r2_resources from './dstu2_resources.json';
import * as r3_resources from './stu3_resources.json';
import * as r4_resources from './r4_resources.json';
import * as operators from './operators.json';

export const MOCK_getOperatorsByInputType = async (inputTypeSpecifier, elementType) => {
  const operatorsToReturn = operators.operators.filter(
    operator =>
      operator.primaryOperand.typeSpecifier === inputTypeSpecifier &&
      (operator.primaryOperand.elementTypes.includes(elementType) ||
        operator.primaryOperand.elementTypes.includes('System.Any'))
  );
  if (operatorsToReturn === []) {
    console.log('Returning an error');
    return new Promise.reject(new Error('NO OPERATORS FOUND'));
  }
  return operatorsToReturn;
};

export const MOCK_getResourceInfo = async (fhirVersion, resourceName) => {
  if (fhirVersion === '1.0.2') {
    return r2_resources.resources.find(resource => resource.name === resourceName);
  } else if (fhirVersion === '3.0.0') {
    return r3_resources.resources.find(resource => resource.name === resourceName);
  } else if (fhirVersion === '4.0.0') {
    return r4_resources.resources.find(resource => resource.name === resourceName);
  } else {
    return new Error('BAD FHIR VERSION');
  }
};

export const MOCK_getTypeMapInfo = async fhirVersion => {
  return operators.implicitConversionInfo;
};
