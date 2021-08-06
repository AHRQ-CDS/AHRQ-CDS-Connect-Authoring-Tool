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

const observationComponentToDropdownOption = property => ({
  label: changeToCase(property.name, 'capitalCase'),
  value: `Observation.component.${property.name}`,
  typeSpecifier: property.typeSpecifier
});

const resourceIsChoiceType = resource => resource.typeSpecifier.type === 'ChoiceTypeSpecifier';

const resourceIsObservationComponent = resource =>
  resource.typeSpecifier.type === 'ListTypeSpecifier' && resource.typeSpecifier.elementType === 'Observation.component';

const resourceIsChoiceOrObservationComponentType = resource =>
  resourceIsChoiceType(resource) || resourceIsObservationComponent(resource);

const sortResourceProperties = properties =>
  [...properties].sort((a, b) => {
    if (resourceIsChoiceOrObservationComponentType(a) && !resourceIsChoiceOrObservationComponentType(b)) return 1;
    else if (!resourceIsChoiceOrObservationComponentType(a) && resourceIsChoiceOrObservationComponentType(b)) return -1;
    else return a.name.localeCompare(b.name);
  });

const getResourceOptions = resourceData => {
  if (resourceData == null) return [];
  return _.flatMapDeep(sortResourceProperties(resourceData.properties), property => {
    if (resourceIsChoiceType(property))
      return [
        { ...propertyToDropdownOption(property), isSubheader: true },
        ...property.typeSpecifier.elementType.map(option => ({
          ...propertyToDropdownOption(option),
          labelPrefix: `${changeToCase(property.name, 'capitalCase')} | `
        }))
      ];
    else if (resourceIsObservationComponent(property))
      return [
        { ...propertyToDropdownOption(property), isSubheader: true },
        ...resourceData.component.properties.map(component => {
          if (resourceIsChoiceType(component))
            return component.typeSpecifier.elementType.map(option => ({
              ...observationComponentToDropdownOption(option),
              labelPrefix: 'Component | '
            }));
          return { ...observationComponentToDropdownOption(component), labelPrefix: 'Component | ' };
        })
      ];

    return propertyToDropdownOption(property);
  });
};

export default getResourceOptions;
