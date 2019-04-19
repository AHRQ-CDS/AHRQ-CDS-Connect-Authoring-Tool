import Validators from './validators';
import { getReturnType, allModifiersValid } from './instances';

export function doesBaseElementInstanceNeedWarning(instance, allInstancesInAllTrees) {
  const isBaseElement = instance.usedBy;
  if (isBaseElement) {
    let anyUseHasChanged = false;
    instance.usedBy.forEach((usageId) => {
      const use = allInstancesInAllTrees.find(i => i.uniqueId === usageId);
      if (use) {
        const useCommentParameter = use.parameters.find(param => param.id === 'comment');
        const useCommentValue = useCommentParameter ? useCommentParameter.value : '';
        const instanceCommentParameter = instance.parameters.find(param => param.id === 'comment');
        const instanceCommentValue = instanceCommentParameter ? instanceCommentParameter.value : '';
        if (((use.modifiers && use.modifiers.length > 0) || (instanceCommentValue !== useCommentValue)) &&
          instance.parameters[0].value === use.parameters[0].value) {
          anyUseHasChanged = true;
        }
      }
    });
    return anyUseHasChanged;
  }

  return false;
}

export function doesBaseElementUseNeedWarning(instance, baseElements) {
  const elementNameParameter = instance.parameters.find(param => param.id === 'element_name');
  const instanceCommentParameter = instance.parameters.find(param => param.id === 'comment');
  const instanceCommentValue = instanceCommentParameter ? instanceCommentParameter.value : '';

  if (instance.type === 'baseElement') {
    const referenceParameter = instance.parameters.find(param => param.type === 'reference');
    const originalBaseElement = baseElements.find(baseEl => referenceParameter.value.id === baseEl.uniqueId);
    const originalCommentParameter = originalBaseElement.parameters.find(param => param.id === 'comment');
    const originalCommentValue = originalCommentParameter ? originalCommentParameter.value : '';
    // If some modifiers applied AND the name is the same as original, it should be changed. Need a warning.
    if (((instance.modifiers && instance.modifiers.length > 0) || (instanceCommentValue !== originalCommentValue)) &&
      elementNameParameter.value === originalBaseElement.parameters[0].value) {
      return true;
    }
    return false;
  }

  return false;
}

export function hasDuplicateName(templateInstance, instanceNames, baseElements, allInstancesInAllTrees) {
  const elementNameParameter = templateInstance.parameters.find(param => param.id === 'element_name');
  // Treat undefined as empty string so unnamed elements display duplicate correctly.
  const nameValue = elementNameParameter.value === undefined ? '' : elementNameParameter.value;
  const duplicateNameIndex = instanceNames.findIndex((name) => {
    const isDuplicate = name.id !== templateInstance.uniqueId && name.name === nameValue;
    // If base element use, don't include a duplicate from the original base element.
    if (isDuplicate && templateInstance.type === 'baseElement') {
      const referenceParameter = templateInstance.parameters.find(param => param.type === 'reference');
      const originalBaseElement = baseElements.find(baseEl => referenceParameter.value.id === baseEl.uniqueId);
      // If the duplicate is another of the uses, don't consider duplicate unless that use has changed.
      const anotherUseId = originalBaseElement.usedBy.find(id => id === name.id);
      const anotherUse = allInstancesInAllTrees.find(instance => instance.uniqueId === anotherUseId);
      if (anotherUse) {
        const anotherUseModified = anotherUse.modifiers && anotherUse.modifiers.length > 0;
        return anotherUseModified;
      }
      // If it is a base element that is used in the Base Elements tab, it can also be used by others. Check those uses.
      if (templateInstance.usedBy) {
        const usesUseId = templateInstance.usedBy.find(id => id === name.id);
        const usesUse = allInstancesInAllTrees.find(instance => instance.uniqueId === usesUseId);
        if (usesUse) {
          const usesUseModified = usesUse.modifiers && usesUse.modifiers.length > 0;
          return usesUseModified;
        }
      }
      return name.id !== originalBaseElement.uniqueId;
    } else if (isDuplicate && templateInstance.usedBy) {
      // If the duplicate is one of the uses, don't consider name duplicate unless use has changed.
      const useId = templateInstance.usedBy.find(i => i === name.id);
      if (useId) {
        const useInstance = allInstancesInAllTrees.find(instance => instance.uniqueId === useId);
        const isUseModified = useInstance && useInstance.modifiers && useInstance.modifiers.length > 0;
        return isUseModified;
      }
      return isDuplicate;
    }
    return isDuplicate;
  });
  return duplicateNameIndex !== -1;
}

export function validateElement(instance, params) {
  if (instance.validator) {
    const validator = Validators[instance.validator.type];
    const fields = instance.validator.fields;
    const args = instance.validator.args;
    const values = fields.map(f => params[f]);
    const names = fields.map(f => instance.parameters.find(el => el.id === f).name);
    if (!validator.check(values, args)) {
      return validator.warning(names, args);
    }
  }
  return null;
}

export function hasReturnTypeError(startingReturnType, modifiers, validReturnType, validateReturnType) {
  const currentReturnType = getReturnType(startingReturnType, modifiers);
  return currentReturnType !== validReturnType && validateReturnType !== false;
}

// Nested warning is needed if a group has a duplicate name
// and if there is any type of warning on any child, including other groups.
export function hasGroupNestedWarning(
  childInstances,
  instanceNames,
  baseElements,
  allInstancesInAllTrees,
  validateReturnType
) {
  let hasNestedWarning = false;
  childInstances.forEach((child) => {
    let warning = false;
    if (child.conjunction) {
      warning = hasGroupNestedWarning(
        child.childInstances,
        instanceNames,
        baseElements,
        allInstancesInAllTrees,
        validateReturnType
      );
      if (!warning) {
        warning = hasDuplicateName(child, instanceNames, baseElements, allInstancesInAllTrees);
      }
    } else {
      const params = {};
      child.parameters.forEach((param) => {
        params[param.id] = param.value;
      });

      const hasValidateElementWarning = validateElement(child, params) !== null;
      const hasReturnTypeWarning =
        hasReturnTypeError(child.returnType, child.modifiers, 'boolean', validateReturnType);
      const hasModifierWarning = !allModifiersValid(child.modifiers);
      const hasDuplicateNameWarning = hasDuplicateName(child, instanceNames, baseElements, allInstancesInAllTrees);
      const hasBaseElementUseWarning = doesBaseElementUseNeedWarning(child, baseElements);
      const hasBaseElementInstanceWarning = doesBaseElementInstanceNeedWarning(child, allInstancesInAllTrees);

      warning = hasValidateElementWarning
        || hasReturnTypeWarning
        || hasModifierWarning
        || hasDuplicateNameWarning
        || hasBaseElementUseWarning
        || hasBaseElementInstanceWarning;
    }
    if (warning) {
      hasNestedWarning = true;
    }
  });
  return hasNestedWarning;
}
