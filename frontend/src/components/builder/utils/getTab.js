const tabLabelMap = {
  summary: 'Summary',
  expTreeInclude: 'Inclusions',
  expTreeExclude: 'Exclusions',
  subpopulations: 'Subpopulations',
  baseElements: 'Base Element',
  recommendations: 'Recommendations',
  parameters: 'Parameters',
  errors: 'HandleErrors',
  externalCql: 'External CQL'
};

const getTabIndexFromName = tabName => {
  return Object.keys(tabLabelMap).indexOf(tabName);
};

const getTabNameFromIndex = tabIndex => {
  return Object.values(tabLabelMap)[tabIndex];
};

export { getTabIndexFromName, getTabNameFromIndex };
