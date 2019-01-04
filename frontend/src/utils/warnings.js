export function doesBaseElementInstanceNeedWarning(instance, allInstancesInAllTrees) {
  const isBaseElement = instance.usedBy;
  if (isBaseElement) {
    let anyUseHasChanged = false;
    instance.usedBy.forEach((usageId) => {
      const use = allInstancesInAllTrees.find(i => i.uniqueId === usageId);
      if (use && use.modifiers && use.modifiers.length > 0 &&
        instance.parameters[0].value === use.parameters[0].value) {
        anyUseHasChanged = true;
      }
    });
    return anyUseHasChanged;
  }

  return false;
}

export function doesBaseElementUseNeedWarning(instance, baseElements) {
  const elementNameParameter = instance.parameters.find(param => param.id === 'element_name');

  if (instance.type === 'baseElement') {
    const referenceParameter = instance.parameters.find(param => param.type === 'reference');
    const originalBaseElement = baseElements.find(baseEl => referenceParameter.value.id === baseEl.uniqueId);
    // If some modifiers applied AND the name is the same as original, it should be changed. Need a warning.
    if (instance.modifiers && instance.modifiers.length > 0 &&
      elementNameParameter.value === originalBaseElement.parameters[0].value) {
      return true;
    }
    return false;
  }

  return false;
}

export function hasDuplicateName(templateInstance, instanceNames, baseElements, allInstancesInAllTrees) {
  // Parameters cannot be renamed if they are in use, so don't need to worry if they are a duplicate here.
  if (templateInstance.type === 'parameter') {
    return false;
  }

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
