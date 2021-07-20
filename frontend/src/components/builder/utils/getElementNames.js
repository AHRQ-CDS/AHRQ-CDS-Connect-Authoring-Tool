import { getFieldWithId } from 'utils/instances';

const getElementName = element => {
  if (element.subpopulationName) return element.subpopulationName;
  if (element.fields) return getFieldWithId(element.fields, 'element_name').value;
  return element.name || '';
};

const getElementNames = allElements => {
  const names = [];
  allElements.forEach(element => names.push({ name: getElementName(element), id: element.uniqueId }));
  return names;
};

export default getElementNames;
