import { getFieldWithType } from 'utils/instances';

// Note - this is using pass by reference to add to the baseElementsInUse array from getBaseElementsInUse
function addBaseElementUsage(uses, baseElementId, elementId) {
  const baseElementAlreadyInUse = uses.find(s => s.baseElementId === baseElementId);
  if (baseElementAlreadyInUse == null) {
    // Add the base element id and begin the list of other instances using the base element
    uses.push({ baseElementId: baseElementId, usedBy: [elementId] });
  } else {
    // If the base element is already used elsewhere, just add to the list of instances using it
    baseElementAlreadyInUse.usedBy.push(elementId);
  }
}

export function getBaseElementsInUse(allElements) {
  const baseElementsInUse = [];
  allElements
    .filter(element => element.fields) // filters out parameters
    .forEach(element => {
      // Handle base elements that are currently used
      const referenceField = getFieldWithType(element.fields, 'reference');
      if (referenceField?.id === 'baseElementReference') {
        addBaseElementUsage(baseElementsInUse, referenceField.value.id, element.uniqueId);
      } else if (referenceField?.id === 'externalCqlReference') {
        referenceField?.value?.arguments
          ?.map(arg => arg.value)
          .forEach(arg => {
            if (arg?.argSource && arg?.selected && arg.argSource === 'baseElement') {
              addBaseElementUsage(baseElementsInUse, arg.selected, element.uniqueId);
            }
          });
      }
      // Handle external cql modifiers
      element.modifiers?.forEach((modifier, index) => {
        if (modifier.type === 'ExternalModifier') {
          modifier.values?.value?.forEach(arg => {
            if (arg?.argSource && arg?.selected && arg.argSource === 'baseElement') {
              addBaseElementUsage(baseElementsInUse, arg.selected, element.uniqueId);
            }
          });
        }
      });
    });
  return baseElementsInUse;
}
