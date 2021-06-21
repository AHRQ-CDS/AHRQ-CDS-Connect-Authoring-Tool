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

export const getTabNameFromIndex = tabIndex => {
  return Object.values(tabLabelMap)[tabIndex];
};

export const getTabIndexFromName = tabName => {
  return Object.keys(tabLabelMap).indexOf(tabName);
};
