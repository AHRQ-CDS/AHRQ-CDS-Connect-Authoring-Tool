import axios from 'axios';
import Promise from 'promise';
import moment from 'moment';
import FileSaver from 'file-saver';
import _ from 'lodash';

import changeToCase from 'utils/strings';
import createTemplateInstance from 'utils/templates';
import { getFieldWithType, getFieldWithId } from 'utils/instances';
import { generateErrorStatement } from 'components/builder/error-statement/utils';
import * as types from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- SET STATUS MESSAGE ---------------------------- //

export function setStatusMessage(statusType) {
  const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
  let message = null;

  if (statusType === 'save') message = `Saved ${time}.`;
  if (statusType === 'download') message = `Downloaded ${time}.`;

  return {
    type: types.SET_STATUS_MESSAGE,
    message
  };
}

// ------------------------- UPDATE ARTIFACT ------------------------------- //

function parseTree(element, names, baseElementsInUse, parametersInUse, librariesInUse) {
  parseConjunction(element.childInstances, names, baseElementsInUse, parametersInUse, librariesInUse);
  const children = element.childInstances;
  children.forEach(child => {
    if ('childInstances' in child) {
      parseTree(child, names, baseElementsInUse, parametersInUse, librariesInUse);
    }
  });
}

function getExternalParameterUsage(cqlElementArgs, child, parametersInUse) {
  let newParametersInUse = [];
  cqlElementArgs.forEach(arg => {
    if (arg?.argSource && arg?.selected) {
      if (arg.argSource === 'parameter') {
        const parameterAlreadyInUse = parametersInUse.find(s => s.parameterId === arg.selected);
        if (parameterAlreadyInUse === undefined) {
          // Add the base element id and begin the list of other instances using the base element
          newParametersInUse.push({ parameterId: arg.selected, usedBy: [child.uniqueId] });
        } else {
          // If the base element is already used elsewhere, just add to the list of instances using it
          newParametersInUse.push(parameterAlreadyInUse.usedBy.push(child.uniqueId));
        }
      }
    }
  });
  return newParametersInUse;
}

function getExternalBaseElementUsage(cqlElementArgs, child, baseElementsInUse) {
  let newBaseElementsInUse = [];
  cqlElementArgs.forEach(arg => {
    if (arg?.argSource && arg?.selected) {
      if (arg.argSource === 'baseElement') {
        const baseElementAlreadyInUse = baseElementsInUse.find(s => s.baseElementId === arg.selected);
        if (baseElementAlreadyInUse === undefined) {
          // Add the base element id and begin the list of other instances using the base element
          newBaseElementsInUse.push({ baseElementId: arg.selected, usedBy: [child.uniqueId] });
        } else {
          // If the base element is already used elsewhere, just add to the list of instances using it
          newBaseElementsInUse.push(baseElementAlreadyInUse.usedBy.push(child.uniqueId));
        }
      }
    }
  });
  return newBaseElementsInUse;
}

function parseConjunction(childInstances, names, baseElementsInUse, parametersInUse, librariesInUse) {
  childInstances.forEach(child => {
    // Add name of child to array
    const index = names.findIndex(name => name.id === child.uniqueId);
    if (index === -1) {
      let name = getFieldWithId(child.fields, 'element_name').value;
      if (name === undefined) name = '';
      names.push({ name, id: child.uniqueId });
    }

    // Add uniqueId of base elements and parameters that are currently used
    const referenceField = getFieldWithType(child.fields, 'reference');
    if (referenceField) {
      if (referenceField.id === 'baseElementReference') {
        const baseElementAlreadyInUse = baseElementsInUse.find(s => s.baseElementId === referenceField.value.id);
        if (baseElementAlreadyInUse === undefined) {
          // Add the base element id and begin the list of other instances using the base element
          baseElementsInUse.push({ baseElementId: referenceField.value.id, usedBy: [child.uniqueId] });
        } else {
          // If the base element is already used elsewhere, just add to the list of instances using it
          baseElementAlreadyInUse.usedBy.push(child.uniqueId);
        }
      } else if (referenceField.id === 'parameterReference') {
        const parameterAlreadyInUse = parametersInUse.find(p => p.parameterId === referenceField.value.id);
        if (parameterAlreadyInUse === undefined) {
          // Add the parameter id and begin the list of other instances using the parameter
          parametersInUse.push({ parameterId: referenceField.value.id, usedBy: [child.uniqueId] });
        } else {
          // If the parameter is already used elsewhere, just add to the list of instances using it
          parameterAlreadyInUse.usedBy.push(child.uniqueId);
        }
      } else if (referenceField.id === 'externalCqlReference') {
        const libraryAlreadyInUse = librariesInUse.find(l => l === referenceField.value.library);
        if (libraryAlreadyInUse === undefined) {
          // Add the library name
          librariesInUse.push(referenceField.value.library);
        }
        if (referenceField?.value?.arguments) {
          getExternalParameterUsage(
            referenceField.value.arguments.map(arg => arg.value),
            child,
            parametersInUse
          ).forEach(usage => {
            const usageInstanceIndex = parametersInUse.findIndex(
              paramInUse => paramInUse.parameterId === usage.parameterId
            );
            if (usageInstanceIndex !== -1) parametersInUse[usageInstanceIndex] = usage;
            else parametersInUse.push(usage);
          });
          getExternalBaseElementUsage(
            referenceField.value.arguments.map(arg => arg.value),
            child,
            baseElementsInUse
          ).forEach(usage => {
            const usageInstanceIndex = baseElementsInUse.findIndex(
              elementInUse => elementInUse.baseElementId === usage.baseElementId
            );
            if (usageInstanceIndex !== -1) baseElementsInUse[usageInstanceIndex] = usage;
            else baseElementsInUse.push(usage);
          });
        }
      }
    }

    // Handle Both External CQL References as well as external arguments
    // for external cql modifiers.
    if (child.modifiers) {
      child.modifiers.forEach((modifier, index) => {
        if (modifier.type === 'ExternalModifier') {
          const libraryAlreadyInUse = librariesInUse.find(l => l === modifier.libraryName);
          if (libraryAlreadyInUse === undefined) {
            // Add the library name
            librariesInUse.push(modifier.libraryName);
          }
          if (modifier.values?.value) {
            getExternalParameterUsage(modifier.values.value, child, parametersInUse).forEach(usage => {
              const usageInstanceIndex = parametersInUse.findIndex(
                paramInUse => paramInUse.parameterId === usage.parameterId
              );
              if (usageInstanceIndex !== -1)
                parametersInUse[usageInstanceIndex] = {
                  ...usage,
                  modifier: { parentInstanceId: child.uniqueId, modifierIndex: index }
                };
              else
                parametersInUse.push({
                  ...usage,
                  modifier: { parentInstanceId: child.uniqueId, modifierIndex: index }
                });
            });
            getExternalBaseElementUsage(modifier.values.value, child, baseElementsInUse).forEach(usage => {
              const usageInstanceIndex = baseElementsInUse.findIndex(
                elementInUse => elementInUse.baseElementId === usage.baseElementId
              );
              if (usageInstanceIndex !== -1)
                baseElementsInUse[usageInstanceIndex] = {
                  ...usage,
                  modifier: { parentInstanceId: child.uniqueId, modifierIndex: index }
                };
              else
                baseElementsInUse.push({
                  ...usage,
                  modifier: { parentInstanceId: child.uniqueId, modifierIndex: index }
                });
            });
          }
        }
      });
    }

    if (child.type === 'parameter' && child.returnType !== _.toLower(child.returnType)) {
      child.returnType = _.toLower(child.returnType);
    }
  });
}

function parseForDuplicateNamesAndUsed(artifact) {
  const names = [];
  const baseElementsInUse = [];
  const parametersInUse = [];
  const librariesInUse = [];
  if (artifact.expTreeInclude.childInstances.length) {
    parseTree(artifact.expTreeInclude, names, baseElementsInUse, parametersInUse, librariesInUse);
  }
  if (artifact.expTreeExclude.childInstances.length) {
    parseTree(artifact.expTreeExclude, names, baseElementsInUse, parametersInUse, librariesInUse);
  }
  artifact.subpopulations.forEach(subpopulation => {
    names.push({ name: subpopulation.subpopulationName, id: subpopulation.uniqueId });
    if (!subpopulation.special) {
      // `Doesn't Meet Inclusion Criteria` and `Meets Exclusion Criteria` are special
      if (subpopulation.childInstances.length) {
        parseTree(subpopulation, names, baseElementsInUse, parametersInUse, librariesInUse);
      }
    }
  });
  artifact.baseElements.forEach(baseElement => {
    const nameField = getFieldWithId(baseElement.fields, 'element_name');
    if (nameField) {
      names.push({ name: nameField.value, id: baseElement.uniqueId });
    }
    if (baseElement.childInstances && baseElement.childInstances.length) {
      parseTree(baseElement, names, baseElementsInUse, parametersInUse, librariesInUse);
    } else {
      // Parse single base element directly for it's uses
      parseConjunction([baseElement], names, baseElementsInUse, parametersInUse, librariesInUse);
    }
  });
  artifact.parameters.forEach(parameter => {
    names.push({ name: parameter.name, id: parameter.uniqueId });
  });
  return { names, baseElementsInUse, parametersInUse, librariesInUse };
}

export function updateArtifact(artifactToUpdate, props) {
  return dispatch => {
    const artifact = {
      ...artifactToUpdate,
      ...props
    };
    const { names, baseElementsInUse, parametersInUse, librariesInUse } = parseForDuplicateNamesAndUsed(artifact);

    // Add uniqueId to list on base element to mark where it is used.
    artifact.baseElements.forEach(element => {
      const elementInUse = baseElementsInUse.find(usedBaseEl => usedBaseEl.baseElementId === element.uniqueId);
      element.usedBy = elementInUse ? elementInUse.usedBy : [];
    });

    // Add uniqueId to list on parameter to mark where it is used.
    artifact.parameters.forEach(parameter => {
      const parameterInUse = parametersInUse.find(usedParameter => usedParameter.parameterId === parameter.uniqueId);
      parameter.usedBy = parameterInUse ? parameterInUse.usedBy : [];
    });

    return dispatch({
      type: types.UPDATE_ARTIFACT,
      artifact,
      names,
      librariesInUse
    });
  };
}

export function updateAndSaveArtifact(artifactToUpdate, props) {
  return dispatch => {
    const artifact = {
      ...artifactToUpdate,
      ...props
    };

    return dispatch(saveArtifact(artifact));
  };
}

// ------------------------- INITIALIZE ARTIFACT --------------------------- //

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

export function initializeArtifact(andTemplate, orTemplate) {
  const newTrees = initializeTrees(andTemplate, orTemplate);

  const artifact = {
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

  return {
    type: types.INITIALIZE_ARTIFACT,
    artifact
  };
}

// ------------------------- LOAD ARTIFACTS -------------------------------- //

function requestArtifacts() {
  return {
    type: types.ARTIFACTS_REQUEST
  };
}

function loadArtifactsSuccess(artifacts) {
  return {
    type: types.LOAD_ARTIFACTS_SUCCESS,
    artifacts
  };
}

function loadArtifactsFailure(error) {
  return {
    type: types.LOAD_ARTIFACTS_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendArtifactsRequest() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_BASE}/artifacts`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadArtifacts() {
  return dispatch => {
    dispatch(requestArtifacts());

    return sendArtifactsRequest()
      .then(data => dispatch(loadArtifactsSuccess(data)))
      .catch(error => dispatch(loadArtifactsFailure(error)));
  };
}

// ------------------------- LOAD ARTIFACT -------------------------------- //

function requestArtifact(id) {
  return {
    type: types.ARTIFACT_REQUEST,
    id
  };
}

function loadArtifactSuccess(artifact) {
  const { names, librariesInUse } = parseForDuplicateNamesAndUsed(artifact);
  return {
    type: types.LOAD_ARTIFACT_SUCCESS,
    artifact,
    names,
    librariesInUse
  };
}

function loadArtifactFailure(error) {
  return {
    type: types.LOAD_ARTIFACT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendArtifactRequest(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_BASE}/artifacts/${id}`)
      .then(result => resolve(result.data[0]))
      .catch(error => reject(error));
  });
}

export function loadArtifact(id) {
  return dispatch => {
    dispatch(requestArtifact(id));

    return sendArtifactRequest(id)
      .then(data => dispatch(loadArtifactSuccess(data)))
      .catch(error => dispatch(loadArtifactFailure(error)))
      .then(() => dispatch(setStatusMessage(null)));
  };
}

// ------------------------- DOWNLOAD ARTIFACT ----------------------------- //

function requestDownloadArtifact() {
  return {
    type: types.DOWNLOAD_ARTIFACT_REQUEST
  };
}

function downloadArtifactSuccess() {
  return {
    type: types.DOWNLOAD_ARTIFACT_SUCCESS
  };
}

function validateArtifactSuccess(data) {
  return {
    type: types.VALIDATE_ARTIFACT_SUCCESS,
    data
  };
}

function downloadArtifactFailure(error) {
  return {
    type: types.DOWNLOAD_ARTIFACT_FAILURE,
    status: error.response ? error.response.status : '',
    statusText: error.response ? error.response.statusText : ''
  };
}

function sendDownloadArtifactRequest(artifact, dataModel) {
  artifact.dataModel = dataModel;
  const fileName = changeToCase(`${artifact.name}-v${artifact.version}-cql`, 'snakeCase');

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE}/cql`, artifact, { responseType: 'blob' })
      .then(result => {
        FileSaver.saveAs(result.data, `${fileName}.zip`);
        resolve(result.data);
      })
      .catch(error => reject(error));
  });
}

export function clearArtifactValidationWarnings() {
  return {
    type: types.CLEAR_ARTIFACT_VALIDATION_WARNINGS
  };
}

function sendValidateArtifactRequest(artifact) {
  return axios.post(`${API_BASE}/cql/validate`, artifact);
}

export function downloadArtifact(artifact, dataModel) {
  return dispatch => {
    dispatch(requestDownloadArtifact());

    return sendDownloadArtifactRequest(artifact, dataModel)
      .then(() => {
        dispatch(downloadArtifactSuccess());
        sendValidateArtifactRequest(artifact).then(res => dispatch(validateArtifactSuccess(res.data)));
      })
      .catch(error => dispatch(downloadArtifactFailure(error)));
  };
}

// ------------------------- SAVE ARTIFACT --------------------------------- //

function requestSaveArtifact() {
  return {
    type: types.SAVE_ARTIFACT_REQUEST
  };
}

function saveArtifactSuccess(artifact) {
  return {
    type: types.SAVE_ARTIFACT_SUCCESS,
    artifact
  };
}

function saveArtifactFailure(error) {
  return {
    type: types.SAVE_ARTIFACT_FAILURE,
    status: error.response ? error.response.status : '',
    statusText: error.response ? error.response.statusText : ''
  };
}

function sendSaveArtifactRequest(artifact) {
  if (artifact._id == null) {
    const artifactWithoutId = _.omit(artifact, ['_id']);
    return axios.post(`${API_BASE}/artifacts`, artifactWithoutId).then(result => result.data);
  }

  return axios.put(`${API_BASE}/artifacts`, artifact).then(() => artifact);
}

export function saveArtifact(artifact) {
  return dispatch => {
    dispatch(requestSaveArtifact());

    return sendSaveArtifactRequest(artifact)
      .then(data => dispatch(saveArtifactSuccess(data)))
      .catch(error => dispatch(saveArtifactFailure(error)))
      .then(() => dispatch(loadArtifacts()));
  };
}
