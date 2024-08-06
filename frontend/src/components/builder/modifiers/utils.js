import { getReturnType } from 'utils/instances';

export const modifierCanBeRemoved = (baseElementIsUsed, index, returnType, modifiers) => {
  const hasMultipleModifiers = modifiers.length > 1;
  const nextModifierAllowsReturnType = Boolean(modifiers[index + 1]?.inputTypes.includes(returnType));
  const isFirstModifier = index === 0;
  const isLastModifier = index === modifiers.length - 1;
  const nextModifierAllowsPreviousReturnType = Boolean(
    modifiers[index + 1]?.inputTypes.includes(modifiers[index - 1]?.returnType)
  );
  const nextToLastModifierReturnTypeMatchesElement = Boolean(
    modifiers[modifiers.length - 2]?.returnType === getReturnType(returnType, modifiers)
  );
  const lastModifierReturnTypeMatchesElement = returnType === getReturnType(returnType, modifiers);

  let canBeRemoved = true;
  let tooltipText;
  if (hasMultipleModifiers) {
    if (isFirstModifier) {
      canBeRemoved = nextModifierAllowsReturnType;
      if (!canBeRemoved) tooltipText = 'Cannot remove modifier because return type does not match next input type.';
    } else if (isLastModifier) {
      canBeRemoved = baseElementIsUsed ? nextToLastModifierReturnTypeMatchesElement : true;
      if (!canBeRemoved) tooltipText = 'Cannot remove modifier because final return type would change while in use.';
    } else {
      canBeRemoved = nextModifierAllowsPreviousReturnType;
      if (!canBeRemoved) tooltipText = 'Cannot remove modifier because return type does not match next input type.';
    }
  } else if (baseElementIsUsed) {
    canBeRemoved = lastModifierReturnTypeMatchesElement;
    if (!canBeRemoved) tooltipText = 'Cannot remove modifier because final return type would change while in use.';
  }

  return { canBeRemoved, tooltipText };
};
