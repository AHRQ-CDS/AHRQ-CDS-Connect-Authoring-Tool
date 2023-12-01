import { getFieldWithType } from 'utils/instances';

// Note - this is using pass by reference to add to the parametersInUse array from getParametersInUse
function addParameterUsage(uses, parameterId, elementId) {
  const parameterAlreadyInUse = uses.find(p => p.parameterId === parameterId);
  if (parameterAlreadyInUse === undefined) {
    // Add the parameter id and begin the list of other instances using the parameter
    uses.push({ parameterId: parameterId, usedBy: [elementId] });
  } else {
    // If the parameter is already used elsewhere, just add to the list of instances using it
    parameterAlreadyInUse.usedBy.push(elementId);
  }
}

export function getParametersInUse(allElements) {
  const parametersInUse = [];
  allElements
    .filter(element => element.fields) // filters out parameters
    .forEach(element => {
      // Handle parameters that are currently used
      const referenceField = getFieldWithType(element.fields, 'reference');
      if (referenceField?.id === 'parameterReference') {
        addParameterUsage(parametersInUse, referenceField.value.id, element.uniqueId);
      } else if (referenceField?.id === 'externalCqlReference') {
        referenceField?.value?.arguments
          ?.map(arg => arg.value)
          .forEach(arg => {
            if (arg?.argSource && arg?.selected && arg.argSource === 'parameter') {
              addParameterUsage(parametersInUse, arg.selected, element.uniqueId);
            }
          });
      }
      // Handle external cql modifiers
      element.modifiers?.forEach((modifier, index) => {
        if (modifier.type === 'ExternalModifier') {
          modifier.values?.value?.forEach(arg => {
            if (arg?.argSource && arg?.selected && arg.argSource === 'parameter') {
              addParameterUsage(parametersInUse, arg.selected, element.uniqueId);
            }
          });
        }
      });
    });
  return parametersInUse;
}
