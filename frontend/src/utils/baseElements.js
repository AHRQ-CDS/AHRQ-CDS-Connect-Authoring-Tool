import _ from 'lodash';

export function getOriginalBaseElement(instance, baseElements) {
  const referenceField = instance.fields.find(field => field.type === 'reference');
  if (referenceField) {
    if (referenceField.id === 'parameterReference') {
      return instance;
    }
    const baseElementReferenced = baseElements.find(element =>
      element.uniqueId === referenceField.value.id);
    return getOriginalBaseElement(baseElementReferenced, baseElements);
  }
  return instance;
}

export function getAllModifiersOnBaseElementUse(instance, baseElements, modifiers = []) {
  let currentModifiers = modifiers;
  const referenceField = instance.fields.find(field => field.type === 'reference');
  if (referenceField) {
    if (referenceField.id === 'parameterReference') {
      return _.cloneDeep(instance.modifiers || []).concat(currentModifiers);
    }
    const baseElementReferenced = baseElements.find(element =>
      element.uniqueId === referenceField.value.id);
    currentModifiers = _.cloneDeep(baseElementReferenced.modifiers || []).concat(currentModifiers);
    return getAllModifiersOnBaseElementUse(baseElementReferenced, baseElements, currentModifiers);
  }
  return currentModifiers;
}
