import { getFieldWithType } from 'utils/instances';

export function getLibrariesInUse(allElements) {
  const librariesInUse = [];
  allElements
    .filter(element => element.fields) // filters out parameters
    .forEach(element => {
      // Handle libraries that are currently used
      const referenceField = getFieldWithType(element.fields, 'reference');
      if (referenceField?.id === 'externalCqlReference') {
        if (!librariesInUse.some(l => l === referenceField.value.library)) {
          librariesInUse.push(referenceField.value.library);
        }
      }
      // Handle external cql modifiers
      element.modifiers?.forEach(modifier => {
        if (modifier.type === 'ExternalModifier') {
          if (!librariesInUse.some(l => l === modifier.libraryName)) {
            librariesInUse.push(modifier.libraryName);
          }
        }
      });
    });
  return librariesInUse;
}
