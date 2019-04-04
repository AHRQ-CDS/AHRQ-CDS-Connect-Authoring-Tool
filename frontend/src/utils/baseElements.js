import _ from 'lodash';

export function getOriginalBaseElement(instance, baseElements) {
  const referenceParameter = instance.parameters.find(param => param.type === 'reference');
  if (referenceParameter) {
    if (referenceParameter.id === 'parameterReference') {
      return instance;
    }
    const baseElementReferenced = baseElements.find(element =>
      element.uniqueId === referenceParameter.value.id);
    return getOriginalBaseElement(baseElementReferenced, baseElements);
  }
  return instance;
}

export function getAllModifiersOnBaseElementUse(instance, baseElements, modifiers = []) {
  let currentModifiers = modifiers;
  const referenceParameter = instance.parameters.find(param => param.type === 'reference');
  if (referenceParameter) {
    if (referenceParameter.id === 'parameterReference') {
      return _.cloneDeep(instance.modifiers || []).concat(currentModifiers);
    }
    const baseElementReferenced = baseElements.find(element =>
      element.uniqueId === referenceParameter.value.id);
    currentModifiers = _.cloneDeep(baseElementReferenced.modifiers || []).concat(currentModifiers);
    return getAllModifiersOnBaseElementUse(baseElementReferenced, baseElements, currentModifiers);
  }
  return currentModifiers;
}
