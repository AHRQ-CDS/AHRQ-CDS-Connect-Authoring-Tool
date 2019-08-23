import Validators from './validators';

export function validateModifier(modifier) {
  let validationWarning = null;

  if (modifier.validator) {
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
    if (validateModifier(modifier) === null) {
      returnType = modifier.returnType;
      break;
    }
  }

  return returnType;
}

export function allModifiersValid(modifiers) {
  if (!modifiers) return true;

  let areAllModifiersValid = true;
  modifiers.forEach((modifier) => {
    if (validateModifier(modifier) !== null) areAllModifiersValid = false;
  });
  return areAllModifiersValid;
}

export function getFieldWithType(fields, type) {
  return fields.find(f => f.type && f.type.endsWith(type));
}

export function getFieldWithId(fields, id) {
  return fields.find(f => f.id === id);
}
