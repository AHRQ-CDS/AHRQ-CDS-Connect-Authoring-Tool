import _ from 'lodash';
import { plural } from 'pluralize';
import { getReturnType } from 'utils/instances';
import { findValueAtPath } from './find';

export const isElementAndOr = id => id === 'And' || id === 'Or';

export const promoteReturnTypeToList = returnType => {
  const isSingularElement = !returnType.startsWith('list_of_');
  if (isSingularElement) {
    return `list_of_${plural(returnType)}`;
  }
  return returnType;
};

export const checkReturnTypeCompatibilitySetList = (currentReturnType, incomingReturnType) => {
  const incomingReturnTypeOrPromoted = promoteReturnTypeToList(incomingReturnType);
  const isListElement = incomingReturnTypeOrPromoted.startsWith('list_of_');
  if (currentReturnType === incomingReturnTypeOrPromoted && isListElement) {
    return incomingReturnTypeOrPromoted;
  }
  return 'list_of_any';
};

export const checkReturnTypeCompatibilityBooleanList = (currentReturnType, incomingReturnType, isOnlyElement) => {
  const booleanAndNull =
    (_.lowerCase(incomingReturnType) === 'none' && _.lowerCase(currentReturnType) === 'boolean') ||
    (_.lowerCase(incomingReturnType) === 'boolean' && _.lowerCase(currentReturnType) === 'none');

  if ((currentReturnType === incomingReturnType && currentReturnType === 'boolean') || isOnlyElement) {
    return incomingReturnType;
  } else if (booleanAndNull) {
    return 'boolean';
  }
  return 'invalid';
};

export const getListReturnType = (baseElementList, isBooleanList = null) => {
  if (isBooleanList === null) isBooleanList = isElementAndOr(baseElementList.id); // eslint-disable-line no-param-reassign

  let currentReturnType = isBooleanList ? 'none' : 'list_of_any';

  // Set the initial type to the first child's type to start
  if (baseElementList.childInstances.length > 0) {
    const firstChild = baseElementList.childInstances[0];
    currentReturnType = getReturnType(firstChild.returnType, firstChild.modifiers);
    if (!isBooleanList) {
      currentReturnType = promoteReturnTypeToList(currentReturnType);
    }
  }

  baseElementList.childInstances.forEach(child => {
    let incomingReturnType = getReturnType(child.returnType, child.modifiers);
    // Base Element And/Or Lists can go multiple children deep so need recursion to check the type
    if (isBooleanList && child.childInstances) {
      incomingReturnType = getListReturnType(child, isBooleanList);
    }
    const isOnlyElement = baseElementList.childInstances.length === 1;
    if (isBooleanList) {
      currentReturnType = checkReturnTypeCompatibilityBooleanList(currentReturnType, incomingReturnType, isOnlyElement);
    } else {
      currentReturnType = checkReturnTypeCompatibilitySetList(currentReturnType, incomingReturnType);
    }
  });
  return currentReturnType;
};

export const calculateNewReturnType = (baseElement, template, path = '') => {
  // Temporarily add the element to correctly calculate return type.
  const baseElementList = _.cloneDeep(baseElement);
  const target = findValueAtPath(baseElementList, path).childInstances;
  target.splice(target.length, 0, template);
  return getListReturnType(baseElementList);
};

export const calculateReturnTypeAfterElementRemoved = (baseElement, path = '', elementsToAdd = []) => {
  // Temporarily remove the element that will be deleted to correctly calculate return type.
  const indexToRemove = path.slice(-1);
  const baseElementList = _.cloneDeep(baseElement);
  const target = findValueAtPath(baseElementList, path.slice(0, path.length - 2));
  target.splice(indexToRemove, 1);
  // Temporarily add in any new elements being added (used for indenting/outdenting)
  if (elementsToAdd.length > 0) {
    elementsToAdd.forEach(addition => {
      // addition type: { instance: childInstance to add in, path: string, index: number }
      const targetToAdd = findValueAtPath(baseElementList, addition.path).childInstances;
      const indexToAdd = addition.index !== undefined ? addition.index : target.length;
      targetToAdd.splice(indexToAdd, 0, addition.instance);
    });
  }

  return getListReturnType(baseElementList);
};

export const calculateReturnTypeWithNewModifiers = (baseElement, modifiers, path = '') => {
  // Temporarily apply the modifiers that will be updated. Base Element Lists can only be one child deep.
  const baseElementList = _.cloneDeep(baseElement);
  const target = findValueAtPath(baseElementList, path);
  target.modifiers = modifiers;

  return getListReturnType(baseElementList);
};

export const isBaseElementListUsed = element => (element.usedBy ? element.usedBy.length !== 0 : false);
