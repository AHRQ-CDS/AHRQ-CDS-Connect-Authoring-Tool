import axios from 'axios';
import _ from 'lodash';

import createTemplateInstance from 'utils/templates';
import { getFieldWithId } from 'utils/instances';
import { generateErrorStatement } from 'components/builder/error-statement/utils';

function initializeTrees(andTemplate, orTemplate) {
  const newSubpopulation = createTemplateInstance(andTemplate);
  newSubpopulation.name = '';
  newSubpopulation.path = '';
  newSubpopulation.subpopulationName = 'Subpopulation 1';
  newSubpopulation.expanded = true;

  const newExpTreeInclude = createTemplateInstance(andTemplate);
  newExpTreeInclude.path = '';
  const newExpTreeIncludeNameField = getFieldWithId(newExpTreeInclude.fields, 'element_name');
  if (newExpTreeIncludeNameField) newExpTreeIncludeNameField.value = 'MeetsInclusionCriteria';

  const newExpTreeExclude = createTemplateInstance(orTemplate);
  newExpTreeExclude.path = '';
  const newExpTreeExcludeNameField = getFieldWithId(newExpTreeExclude.fields, 'element_name');
  if (newExpTreeExcludeNameField) newExpTreeExcludeNameField.value = 'MeetsExclusionCriteria';

  return {
    newSubpopulation,
    newExpTreeInclude,
    newExpTreeExclude
  };
}

function initializeArtifact(templates) {
  const operations = templates.find(template => template.name === 'Operations');
  const andTemplate = operations.entries.find(entry => entry.name === 'And');
  const orTemplate = operations.entries.find(entry => entry.name === 'Or');
  const newTrees = initializeTrees(andTemplate, orTemplate);

  return {
    _id: null,
    name: 'Untitled Artifact',
    version: '1',
    fhirVersion: '',
    expTreeInclude: newTrees.newExpTreeInclude,
    expTreeExclude: newTrees.newExpTreeExclude,
    recommendations: [],
    subpopulations: [
      {
        special: true,
        subpopulationName: "Doesn't Meet Inclusion Criteria",
        special_subpopulationName: 'not "MeetsInclusionCriteria"',
        uniqueId: 'default-subpopulation-1'
      },
      {
        special: true,
        subpopulationName: 'Meets Exclusion Criteria',
        special_subpopulationName: '"MeetsExclusionCriteria"',
        uniqueId: 'default-subpopulation-2'
      },
      newTrees.newSubpopulation
    ],
    baseElements: [],
    parameters: [],
    errorStatement: generateErrorStatement('root'),
    uniqueIdCounter: 0
  };
}

const addArtifact = async ({ artifactProps }) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/config/templates`);
  const artifact = {
    ...initializeArtifact(data),
    ...artifactProps
  };

  const artifactWithoutId = _.omit(artifact, ['_id']);
  return axios.post(`${process.env.REACT_APP_API_URL}/artifacts`, artifactWithoutId).then(result => result.data);
};

export default addArtifact;
