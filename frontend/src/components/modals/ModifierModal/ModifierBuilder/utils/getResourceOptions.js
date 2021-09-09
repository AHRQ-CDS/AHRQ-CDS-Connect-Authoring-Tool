import { changeToCase } from 'utils/strings';
import _ from 'lodash';

const propertyToDropdownOption = (property, { options } = {}) => {
  let dropdownOption = {
    label: changeToCase(property.name, 'capitalCase'),
    value: property.name,
    typeSpecifier: property.typeSpecifier
  };

  if (property.predefinedCodes) dropdownOption['predefinedCodes'] = property.predefinedCodes;

  if (property.allowsCustomCodes) dropdownOption['allowsCustomCodes'] = true;
  return dropdownOption;
};

const resourceIsChoiceType = resource => resource.typeSpecifier.type === 'ChoiceTypeSpecifier';

const sortResourceProperties = properties =>
  [...properties].sort((a, b) => {
    if (resourceIsChoiceType(a) && !resourceIsChoiceType(b)) return 1;
    else if (!resourceIsChoiceType(a) && resourceIsChoiceType(b)) return -1;
    else return a.name.localeCompare(b.name);
  });

const getResourceOptions = resourceData => {
  if (resourceData == null) return [];
  return _.flatMapDeep(sortResourceProperties(resourceData.properties), property => {
    if (resourceIsChoiceType(property)) {
      return [
        { ...propertyToDropdownOption(property), isSubheader: true },
        ...property.typeSpecifier.elementType.map(option => ({
          ...propertyToDropdownOption(option),
          labelPrefix: `${changeToCase(property.name, 'capitalCase')} | `
        }))
      ];
    }

    return propertyToDropdownOption(property);
  });
};

export default getResourceOptions;
