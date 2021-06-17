// Will return property root choice property object. i.e. will give you {name: 'onset'...} from "onsetDateTime"
export const getBaseChoiceProperty = (resourceInfo, resourcePropertyName) => {
  let baseProperty;
  resourceInfo.properties
    .filter(property => property.typeSpecifier.type === 'ChoiceTypeSpecifier')
    .every(choiceProperty => {
      baseProperty = choiceProperty;
      let childProperty = choiceProperty.typeSpecifier.elementType.find(choice => choice.name === resourcePropertyName);
      // Return false to break out of .every(), meaning we've found the base property
      if (childProperty === undefined) return true;
      else return false;
    });
  return baseProperty;
};

// Take a FHIR.<Type> and get implicit conversion info based off a type map and FHIRHelpers.cql
export const getConvertibleTypes = (conversionInfo, type, elementType) => {
  let convertibleTypes = [];
  if (conversionInfo[elementType] !== undefined)
    if (conversionInfo[elementType].startsWith('Interval<')) {
      convertibleTypes.push({ type: 'IntervalTypeSpecifier', elementType: conversionInfo[elementType].slice(9, -1) });
    } else if (conversionInfo[elementType].startsWith('List<')) {
      convertibleTypes.push({ type: 'ListTypeSpecifier', elementType: conversionInfo[elementType].slice(9, -1) });
    } else {
      convertibleTypes.push({ type: 'NamedTypeSpecifier', elementType: conversionInfo[elementType] });
    }
  convertibleTypes.push({ type: type, elementType: 'System.Any' });
  convertibleTypes.push({ type: type, elementType: elementType });
  return convertibleTypes;
};

// Will return an array of sub-choices with a name and typeSpecifier property
export const getPropertyChoices = (resourceInfo, resourcePropertyName) => {
  let property;
  if (resourcePropertyName === 'Observation.component.value')
    property = resourceInfo.component.properties.find(
      property => `Observation.component.${property.name}` === resourcePropertyName
    );
  else property = resourceInfo.properties.find(property => property.name === resourcePropertyName);
  return property.typeSpecifier.elementType;
};

// Will return true for a derivative property like onsetDateTime and false for a base like onset
export const getPropertyIsChoice = (resourceInfo, resourcePropertyName) => {
  const property = resourceInfo.properties.find(property => property.name === resourcePropertyName);
  if (property === undefined) {
    let allChoices = [];
    resourceInfo.properties
      .filter(property => property.typeSpecifier.type === 'ChoiceTypeSpecifier')
      .forEach(choiceProperty =>
        choiceProperty.typeSpecifier.elementType.forEach(possibleType => allChoices.push(possibleType))
      );
    if (allChoices.find(choice => choice.name === resourcePropertyName) !== undefined) return true;
    else return false;
  } else return false;
};

// Will return true for a base choice like onset and false for derivative like onsetDateTime
export const getPropertyRequiresChoice = (resourceInfo, resourcePropertyName) => {
  if (resourcePropertyName === 'Observation.component.value') return true;
  const property = resourceInfo.properties.find(property => property.name === resourcePropertyName);
  if (property === undefined) return false;
  else return property.typeSpecifier.type === 'ChoiceTypeSpecifier';
};
