export const getBaseElementReturnType = baseElement =>
  baseElement.modifiers?.length > 0 ? baseElement.modifiers.slice(-1)[0].returnType : baseElement.returnType;

export const getBaseElementName = baseElement => baseElement.fields.find(({ id }) => id === 'element_name').value;

export const getBaseElementsByType = (baseElements, type) =>
  baseElements.filter(baseElement => getBaseElementReturnType(baseElement) === type);

export const getBaseElementById = (baseElements, id) => baseElements.find(({ uniqueId }) => uniqueId === id);
