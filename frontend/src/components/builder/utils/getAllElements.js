import _ from 'lodash';

export const elementsInclude = (elements, elementName) => {
  if (!elements || elements.length === 0) return false;
  if (elements.some(e => e.name === elementName)) return true;
  return false;
};

export function getElements(tabName, elements, flattenedElements = []) {
  elements.forEach(childElement => {
    const elementToPush = _.cloneDeep(childElement);
    childElement.tab = tabName;
    flattenedElements.push(elementToPush);
    if (childElement.childInstances?.length > 0) getElements(tabName, childElement.childInstances, flattenedElements);
  });

  return flattenedElements;
}

const getAllElements = artifact => {
  const { expTreeInclude, expTreeExclude, subpopulations, baseElements, parameters } = artifact;

  return getElements('expTreeInclude', expTreeInclude.childInstances).concat(
    getElements('expTreeExclude', expTreeExclude.childInstances)
      .concat(
        getElements(
          'subpopulations',
          subpopulations.filter(({ special }) => !special)
        )
      )
      .concat(getElements('baseElements', baseElements))
      .concat(getElements('parameters', parameters))
  );
};

export default getAllElements;
