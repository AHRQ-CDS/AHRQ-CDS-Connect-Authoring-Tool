import _ from 'lodash';
import { getFieldWithType } from './instances';

export function getOriginalBaseElement(instance, baseElements) {
  const referenceField = getFieldWithType(instance.fields, 'reference');
  if (referenceField) {
    if (referenceField.id === 'parameterReference' || referenceField.id === 'externalCqlReference') {
      return instance;
    }
    const baseElementReferenced = baseElements.find(element => element.uniqueId === referenceField.value.id);
    return getOriginalBaseElement(baseElementReferenced, baseElements);
  }
  return instance;
}

export function getAllModifiersOnBaseElementUse(instance, baseElements, modifiers = []) {
  let currentModifiers = modifiers;
  const referenceField = getFieldWithType(instance.fields, 'reference');
  if (referenceField) {
    if (referenceField.id === 'parameterReference' || referenceField.id === 'externalCqlReference') {
      return _.cloneDeep(instance.modifiers || []).concat(currentModifiers);
    }
    const baseElementReferenced = baseElements.find(element => element.uniqueId === referenceField.value.id);
    currentModifiers = _.cloneDeep(baseElementReferenced.modifiers || []).concat(currentModifiers);
    return getAllModifiersOnBaseElementUse(baseElementReferenced, baseElements, currentModifiers);
  }
  return currentModifiers;
}

export function hasBaseElementLinks(instance, baseElements) {
  const thisBaseElement = baseElements.find(baseElement => baseElement.uniqueId === instance.uniqueId);
  if (!thisBaseElement) return false;
  const thisBaseElementUsedBy = thisBaseElement.usedBy;
  if (!thisBaseElementUsedBy || thisBaseElementUsedBy.length === 0) return false;
  return true;
}
