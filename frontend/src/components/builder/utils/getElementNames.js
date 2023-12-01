import { getFieldWithId } from 'utils/instances';

const getElementName = element => {
  if (element.subpopulationName) return element.subpopulationName;
  if (element.fields) return getFieldWithId(element.fields, 'element_name').value;
  return element.name || '';
};

const getElementNames = allElements => {
  return allElements.map(element => ({ name: getElementName(element), id: element.uniqueId }));
};

export default getElementNames;
