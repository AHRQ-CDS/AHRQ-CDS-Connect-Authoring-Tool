import Validators from './validators';
import { getReturnType, allModifiersValid } from './instances';

export function doesBaseElementInstanceNeedWarning(instance, allInstancesInAllTrees) {
  const isBaseElement = instance.usedBy;
  if (isBaseElement) {
    let anyUseHasChanged = false;
    instance.usedBy.forEach((usageId) => {
      const use = allInstancesInAllTrees.find(i => i.uniqueId === usageId);
      if (use) {
        const useCommentField = use.fields.find(field => field.id === 'comment');
        const useCommentValue = useCommentField ? useCommentField.value : '';
        const instanceCommentField = instance.fields.find(field => field.id === 'comment');
        const instanceCommentValue = instanceCommentField ? instanceCommentField.value : '';
        if (((use.modifiers && use.modifiers.length > 0) || (instanceCommentValue !== useCommentValue)) &&
          instance.fields[0].value === use.fields[0].value) {
          anyUseHasChanged = true;
        }
      }
    });
    return anyUseHasChanged;
  }

  return false;
}

export function doesBaseElementUseNeedWarning(instance, baseElements) {
  const elementNameField = instance.fields.find(field => field.id === 'element_name');
  const instanceCommentField = instance.fields.find(field => field.id === 'comment');
  const instanceCommentValue = instanceCommentField ? instanceCommentField.value : '';

  if (instance.type === 'baseElement') {
    const referenceField = instance.fields.find(field => field.type === 'reference');
    const originalBaseElement = baseElements.find(baseEl => referenceField.value.id === baseEl.uniqueId);
    const originalCommentField = originalBaseElement.fields.find(field => field.id === 'comment');
    const originalCommentValue = originalCommentField ? originalCommentField.value : '';
    // If some modifiers applied AND the name is the same as original, it should be changed. Need a warning.
    if (((instance.modifiers && instance.modifiers.length > 0) || (instanceCommentValue !== originalCommentValue)) &&
      elementNameField.value === originalBaseElement.fields[0].value) {
      return true;
    }
    return false;
  }

  return false;
}

export function doesParameterUseNeedWarning(instance, parameters) {
  const elementNameField = instance.fields.find(field => field.id === 'element_name');
  const instanceCommentField = instance.fields.find(field => field.id === 'comment');
  const instanceCommentValue
    = (instanceCommentField && instanceCommentField.value) ? instanceCommentField.value : '';

  if (instance.type === 'parameter') {
    const referenceField = instance.fields.find(field => field.type === 'reference');
    const originalParameter = parameters.find(param => referenceField.value.id === param.uniqueId);
    const originalCommentValue
      = (originalParameter && originalParameter.comment) ? originalParameter.comment : '';
    // If some modifiers applied AND the name is the same as original, it should be changed. Need a warning.
    if (((instance.modifiers && instance.modifiers.length > 0) || (instanceCommentValue !== originalCommentValue)) &&
      elementNameField.value === originalParameter.name) {
      return true;
    }
    return false;
  }

  return false;
}

export function doesParameterNeedWarning(name, usedBy, comment, allInstancesInAllTrees) {
  if (usedBy && usedBy.length > 0) {
    let anyUseHasChanged = false;
    usedBy.forEach((usageId) => {
      const use = allInstancesInAllTrees.find(i => i.uniqueId === usageId);
      if (use) {
        const useCommentField = use.fields.find(field => field.id === 'comment');
        const useCommentValue
          = (useCommentField && useCommentField.value) ? useCommentField.value : '';
        const instanceCommentValue = comment || '';
        if (((use.modifiers && use.modifiers.length > 0) || (instanceCommentValue !== useCommentValue)) &&
          name === use.fields[0].value) {
          anyUseHasChanged = true;
        }
      }
    });
    return anyUseHasChanged;
  }

  return false;
}

export function hasDuplicateName(templateInstance, instanceNames, baseElements, parameters, allInstancesInAllTrees) {
  const elementNameField = templateInstance.fields.find(field => field.id === 'element_name');
  // Treat undefined as empty string so unnamed elements display duplicate correctly.
  const nameValue = elementNameField.value === undefined ? '' : elementNameField.value;
  const duplicateNameIndex = instanceNames.findIndex((name) => {
    const isDuplicate = name.id !== templateInstance.uniqueId && name.name === nameValue;
    // If base element use, don't include a duplicate from the original base element.
    if (isDuplicate && templateInstance.type === 'baseElement') {
      const referenceField = templateInstance.fields.find(field => field.type === 'reference');
      const originalBaseElement = baseElements.find(baseEl => referenceField.value.id === baseEl.uniqueId);
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
    } else if (isDuplicate && templateInstance.type === 'parameter') {
      // If parameter use, don't include a duplicate from the original parameter.
      const referenceField = templateInstance.fields.find(field => field.type === 'reference');
      const originalParameter = parameters.find(param => referenceField.value.id === param.uniqueId);
      // If the duplicate is another of the uses, don't consider duplicate unless that use has changed.
      const anotherUseId = originalParameter.usedBy ? originalParameter.usedBy.find(id => id === name.id) : null;
      const anotherUse = allInstancesInAllTrees.find(instance => instance.uniqueId === anotherUseId);
      if (anotherUse) {
        const anotherUseModified = anotherUse.modifiers && anotherUse.modifiers.length > 0;
        return anotherUseModified;
      }
      return name.id !== originalParameter.uniqueId;
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

export function parameterHasDuplicateName(parameterName, id, usedBy, instanceNames, allInstancesInAllTrees) {
  const duplicateNameIndex = instanceNames.findIndex((name) => {
    const isDuplicate = name.id !== id && name.name === parameterName;
    if (isDuplicate && usedBy && usedBy.length > 0) {
      // If the duplicate is one of the uses, don't consider name duplicate unless use has changed.
      const useId = usedBy.find(i => i === name.id);
      if (useId) {
        const useInstance = allInstancesInAllTrees.find(instance => instance.uniqueId === useId);
        const isUseModified = useInstance && useInstance.modifiers && useInstance.modifiers.length > 0;
        return isUseModified;
      }
    }
    return isDuplicate;
  });
  return duplicateNameIndex !== -1;
}

export function validateElement(instance, templateInstanceFields) {
  if (instance.validator) {
    const validator = Validators[instance.validator.type];
    const validatorFields = instance.validator.fields;
    const args = instance.validator.args;
    const values = validatorFields.map(f => templateInstanceFields[f]);
    const names = validatorFields.map(f => instance.fields.find(el => el.id === f).name);
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
  parameters,
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
        parameters,
        allInstancesInAllTrees,
        validateReturnType
      );
      if (!warning) {
        warning = hasDuplicateName(child, instanceNames, baseElements, parameters, allInstancesInAllTrees);
      }
    } else {
      const fields = {};
      child.fields.forEach((field) => {
        fields[field.id] = field.value;
      });

      const hasValidateElementWarning = validateElement(child, fields) !== null;
      const hasReturnTypeWarning =
        hasReturnTypeError(child.returnType, child.modifiers, 'boolean', validateReturnType);
      const hasModifierWarning = !allModifiersValid(child.modifiers);
      const hasDuplicateNameWarning =
        hasDuplicateName(child, instanceNames, baseElements, parameters, allInstancesInAllTrees);
      const hasBaseElementUseWarning = doesBaseElementUseNeedWarning(child, baseElements);
      const hasBaseElementInstanceWarning = doesBaseElementInstanceNeedWarning(child, allInstancesInAllTrees);
      const hasParameterUseWarning = doesParameterUseNeedWarning(child, parameters);

      warning = hasValidateElementWarning
        || hasReturnTypeWarning
        || hasModifierWarning
        || hasDuplicateNameWarning
        || hasBaseElementUseWarning
        || hasBaseElementInstanceWarning
        || hasParameterUseWarning;
    }
    if (warning) {
      hasNestedWarning = true;
    }
  });
  return hasNestedWarning;
}
