export const getExternalCqlByType = (externalCqlList, type) => {
  let eligibleElements = [];
  externalCqlList.forEach(library => {
    library.details.definitions?.forEach(definition => {
      if (definition.accessLevel === 'Public' && definition.calculatedReturnType === type) {
        eligibleElements.push({ libraryName: library.name, elementName: definition.name, type: 'definition' });
      }
    });
    library.details.functions?.forEach(func => {
      if (func.accessLevel === 'Public' && !func.argumentTypes && func.calculatedReturnType === type) {
        eligibleElements.push({ libraryName: library.name, elementName: func.name, type: 'function' });
      }
    });
  });
  return eligibleElements;
};
