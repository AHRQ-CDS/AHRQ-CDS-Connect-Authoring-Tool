import Validators from './validators';
import _ from 'lodash';
import { getOriginalBaseElement } from 'utils/baseElements';
import { isElementAndOr } from './lists';

export function validateModifier(modifier) {
  let validationWarning = null;

  if (modifier && modifier.validator) {
    const validator = Validators[modifier.validator.type];
    const values = modifier.validator.fields.map(v => modifier.values && modifier.values[v]);
    const args = modifier.validator.args ? modifier.validator.args.map(v => modifier.values[v]) : [];
    if (!validator.check(values, args)) {
      validationWarning = validator.warning(modifier.validator.fields, modifier.validator.args);
    }
  }
  return validationWarning;
}

// Gets the returnType of the last valid modifier
export function getReturnType(startingReturnType, modifiers = []) {
  let returnType = startingReturnType;
  if (modifiers.length === 0) return returnType;

  for (let index = modifiers.length - 1; index >= 0; index--) {
    const modifier = modifiers[index];
    // Check to see if the modifier is a user-built one.
    if (modifier.where) {
      returnType = modifier.returnType;
    } else if (validateModifier(modifier) === null) {
      returnType = modifier.returnType;
      break;
    }
  }

  return returnType;
}

function getAllChildInstances(childInstances) {
  return _.flatten(
    (childInstances || []).map(instance => {
      if (instance.childInstances) {
        return _.flatten([instance, getAllChildInstances(instance.childInstances)]);
      }
      return instance;
    })
  );
}

// Determines if the return type is valid for the given group type
export function isReturnTypeValid(returnType, id, childInstances) {
  if (isElementAndOr(id)) {
    return returnType.toLowerCase() === 'boolean' || getAllChildInstances(childInstances).length === 1;
  }
  return true;
}

export function allModifiersValid(modifiers) {
  if (!modifiers) return true;

  let areAllModifiersValid = true;
  modifiers.forEach(modifier => {
    if (validateModifier(modifier) !== null) areAllModifiersValid = false;
  });
  return areAllModifiersValid;
}

export function filterRelevantModifiers(modifiers, instance) {
  const relevantModifiers = (modifiers || []).slice();
  if (!instance.checkInclusionInVS) {
    // Rather than suppressing `CheckInclusionInVS` in every element, assume it's suppressed unless explicity
    // stated otherwise
    _.remove(relevantModifiers, modifier => modifier.id === 'CheckInclusionInVS');
  }
  if (_.has(instance, 'suppressedModifiers')) {
    instance.suppressedModifiers.forEach(suppressedModifier =>
      _.remove(relevantModifiers, relevantModifier => relevantModifier.id === suppressedModifier)
    );
  }
  return relevantModifiers;
}

export function getFieldWithType(fields, type) {
  return fields.find(f => f.type && f.type.endsWith(type));
}

export function getFieldWithId(fields, id) {
  return fields.find(f => f.id === id);
}

export function getElementTemplate(elementTemplateGroups, templateId) {
  let elementTemplate;
  elementTemplateGroups.find(templateGroup => {
    elementTemplate = templateGroup.entries.find(template => template.id === templateId);
    return elementTemplate !== undefined;
  });

  return _.cloneDeep(elementTemplate).filter(template => !template.suppress);
}

export function getInstanceByReference(allInstances, referenceField) {
  return allInstances.find(instance => Boolean(instance.fields.find(field => _.isEqual(field, referenceField))));
}

export function getInstanceById(allInstances, instanceId) {
  return allInstances.find(instance => instance.uniqueId === instanceId);
}

export function getLabelForInstance(instance, baseElements) {
  let label = instance.name;
  const referenceField = getFieldWithType(instance.fields, 'reference');
  if (referenceField && referenceField.id === 'baseElementReference') {
    // Element type to display in header will be the reference type for Base Elements.
    const originalBaseElement = getOriginalBaseElement(instance, baseElements);
    label = originalBaseElement.type === 'parameter' ? 'Parameter' : originalBaseElement.name;
  }
  return label;
}

export function getReferenceArguments(referenceFieldArgs) {
  let referenceSetIds = new Set();
  referenceFieldArgs.forEach(arg => {
    if (
      arg.value &&
      arg.value.argSource &&
      arg.value.argSource !== 'editor' &&
      arg.value.argSource !== '' &&
      arg.value.argSource !== 'externalCql' &&
      arg.value.selected
    ) {
      referenceSetIds.add(arg.value.selected);
    }
  });

  return [...referenceSetIds].map(referenceSetId =>
    referenceFieldArgs.find(arg => arg.value?.selected === referenceSetId)
  );
}
