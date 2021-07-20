import _ from 'lodash';

function getElements(tabName, elements, flattenedElements = []) {
  elements.forEach(childElement => {
    const elementToPush = _.cloneDeep(childElement);
    childElement.tab = tabName;
    if (tabName !== 'subpopulations' || !childElement.childInstances || childElement.childInstances.length === 0)
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
