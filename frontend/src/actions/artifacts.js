import axios from 'axios';
import Promise from 'promise';
import moment from 'moment';
import FileSaver from 'file-saver';
import _ from 'lodash';

import cql from 'cql-execution';
import cqlfhir from 'cql-exec-fhir';

import changeToCase from '../utils/strings';
import createTemplateInstance from '../utils/templates';
import loadTemplates from './templates';
import * as types from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- SET STATUS MESSAGE ---------------------------- //

export function setStatusMessage(statusType) {
  const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
  let message = null;

  if (statusType === 'save') message = `Saved ${time}.`;
  if (statusType === 'download') message = `Downloaded ${time}.`;
  if (statusType === 'publish') message = `Publishing not available. Saved ${time}.`;

  return {
    type: types.SET_STATUS_MESSAGE,
    message
  };
}

// ------------------------- UPDATE ARTIFACT ------------------------------- //

function parseTree(element, names, baseElementsInUse, parametersInUse) {
  parseConjunction(element.childInstances, names, baseElementsInUse, parametersInUse);
  const children = element.childInstances;
  children.forEach((child) => {
    if ('childInstances' in child) {
      parseTree(child, names, baseElementsInUse, parametersInUse);
    }
  });
}

function parseConjunction(childInstances, names, baseElementsInUse, parametersInUse) {
  childInstances.forEach((child) => {
    // Add name of child to array
    const index = names.findIndex(name => name.id === child.uniqueId);
    if (index === -1) {
      let name = child.parameters[0].value;
      if (name === undefined) name = '';
      names.push({ name, id: child.uniqueId });
    }

    // Add uniqueId of base elements and parameters that are currently used
    const referenceParameter = child.parameters.find(param => param.type === 'reference');
    if (referenceParameter) {
      if (referenceParameter.id === 'baseElementReference') {
        const baseElementAlreadyInUse = baseElementsInUse.find(s => s.baseElementId === referenceParameter.value.id);
        if (baseElementAlreadyInUse === undefined) {
          // Add the base element id and begin the list of other instances using the base element
          baseElementsInUse.push({ baseElementId: referenceParameter.value.id, usedBy: [child.uniqueId] });
        } else {
          // If the base element is already used elsewhere, just add to the list of instances using it
          baseElementAlreadyInUse.usedBy.push(child.uniqueId);
        }
      } else if (referenceParameter.id === 'parameterReference') {
        const parameterAlreadyInUse = parametersInUse.find(p => p.parameterId === referenceParameter.value.id);
        if (parameterAlreadyInUse === undefined) {
          // Add the parameter id and begin the list of other instances using the base element
          parametersInUse.push({ parameterId: referenceParameter.value.id, usedBy: [child.uniqueId] });
        } else {
          // If the parameter is already used elsewhere, just add to the list of instances using it
          parameterAlreadyInUse.usedBy.push(child.uniqueId);
        }
      }
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
  if (artifact.expTreeInclude.childInstances.length) {
    parseTree(artifact.expTreeInclude, names, baseElementsInUse, parametersInUse);
  }
  if (artifact.expTreeExclude.childInstances.length) {
    parseTree(artifact.expTreeExclude, names, baseElementsInUse, parametersInUse);
  }
  artifact.subpopulations.forEach((subpopulation) => {
    names.push({ name: subpopulation.subpopulationName, id: subpopulation.uniqueId });
    if (!subpopulation.special) { // `Doesn't Meet Inclusion Criteria` and `Meets Exclusion Criteria` are special
      if (subpopulation.childInstances.length) { parseTree(subpopulation, names, baseElementsInUse, parametersInUse); }
    }
  });
  artifact.baseElements.forEach((baseElement) => {
    if (baseElement.parameters && baseElement.parameters[0]) {
      names.push({ name: baseElement.parameters[0].value, id: baseElement.uniqueId });
    }
    if (baseElement.childInstances && baseElement.childInstances.length) {
      parseTree(baseElement, names, baseElementsInUse, parametersInUse);
    } else {
      // Parse single base element directly for it's uses
      parseConjunction([baseElement], names, baseElementsInUse, parametersInUse);
    }
  });
  artifact.parameters.forEach((parameter) => {
    names.push({ name: parameter.name, id: parameter.uniqueId });
  });
  return { names, baseElementsInUse, parametersInUse };
}

export function updateArtifact(artifactToUpdate, props) {
  return (dispatch) => {
    const artifact = {
      ...artifactToUpdate,
      ...props
    };
    const { names, baseElementsInUse, parametersInUse } = parseForDuplicateNamesAndUsed(artifact);

    // Add uniqueId to list on base element to mark where it is used.
    artifact.baseElements.forEach((element) => {
      const elementInUse = baseElementsInUse.find(usedBaseEl => usedBaseEl.baseElementId === element.uniqueId);
      element.usedBy = elementInUse ? elementInUse.usedBy : [];
    });

    // Add uniqueId to list on parameter to mark where it is used.
    artifact.parameters.forEach((parameter) => {
      const parameterInUse = parametersInUse.find(usedParameter => usedParameter.parameterId === parameter.uniqueId);
      parameter.usedBy = parameterInUse ? parameterInUse.usedBy : [];
    });

    return dispatch({
      type: types.UPDATE_ARTIFACT,
      artifact,
      names
    });
  };
}

export function updateAndSaveArtifact(artifactToUpdate, props) {
  return (dispatch) => {
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
  const newExpTreeIncludeNameParam = newExpTreeInclude.parameters.find(param => param.id === 'element_name');
  if (newExpTreeIncludeNameParam) newExpTreeIncludeNameParam.value = 'MeetsInclusionCriteria';

  const newExpTreeExclude = createTemplateInstance(orTemplate);
  newExpTreeExclude.path = '';
  const newExpTreeExcludeNameParam = newExpTreeExclude.parameters.find(param => param.id === 'element_name');
  if (newExpTreeExcludeNameParam) newExpTreeExcludeNameParam.value = 'MeetsExclusionCriteria';

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
    errorStatement: { statements: [] },
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
    axios.get(`${API_BASE}/artifacts`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadArtifacts() {
  return (dispatch) => {
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
  const { names } = parseForDuplicateNamesAndUsed(artifact);
  return {
    type: types.LOAD_ARTIFACT_SUCCESS,
    artifact,
    names
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
    axios.get(`${API_BASE}/artifacts/${id}`)
      .then(result => resolve(result.data[0]))
      .catch(error => reject(error));
  });
}

export function loadArtifact(id) {
  return (dispatch) => {
    dispatch(requestArtifact(id));

    return sendArtifactRequest(id)
      .then(data => dispatch(loadArtifactSuccess(data)))
      .catch(error => dispatch(loadArtifactFailure(error)))
      .then(() => dispatch(setStatusMessage(null)));
  };
}

// ------------------------- ADD ARTIFACT ---------------------------------- //

function requestAddArtifact() {
  return {
    type: types.ADD_ARTIFACT_REQUEST
  };
}

function addArtifactSuccess() {
  return {
    type: types.ADD_ARTIFACT_SUCCESS
  };
}

function addArtifactFailure(error) {
  return {
    type: types.ADD_ARTIFACT_FAILURE,
    status: error.response ? error.response.status : '',
    statusText: error.response ? error.response.statusText : ''
  };
}

function sendAddArtifactRequest(artifactProps) {
  return (dispatch, getState) => dispatch(loadTemplates())
    .then((result) => {
      const operations = result.templates.find(template => template.name === 'Operations');
      const andTemplate = operations.entries.find(entry => entry.name === 'And');
      const orTemplate = operations.entries.find(entry => entry.name === 'Or');

      return dispatch(initializeArtifact(andTemplate, orTemplate));
    })
    .then(() => dispatch(updateAndSaveArtifact(getState().artifacts.artifact, artifactProps)));
}

export function addArtifact(artifactProps) {
  return (dispatch) => {
    dispatch(requestAddArtifact());

    return dispatch(sendAddArtifactRequest(artifactProps))
      .then(data => dispatch(addArtifactSuccess()))
      .catch(error => dispatch(addArtifactFailure(error)));
  };
}

// ------------------------- DOWNLOAD ARTIFACT ----------------------------- //

function requestDownloadArtifact() {
  return {
    type: types.DOWNLOAD_ARTIFACT_REQUEST
  };
}

function requestValidateArtifact() {
  return {
    type: types.VALIDATE_ARTIFACT_REQUEST
  };
}

function downloadArtifactSuccess() {
  return {
    type: types.DOWNLOAD_ARTIFACT_SUCCESS,
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

function validateArtifactFailure(error) {
  return {
    type: types.VALIDATE_ARTIFACT_FAILURE,
    status: error.response ? error.response.status : '',
    statusText: error.response ? error.response.statusText : ''
  };
}

function sendDownloadArtifactRequest(artifact, dataModel) {
  artifact.dataModel = dataModel;
  const fileName = changeToCase(`${artifact.name}-v${artifact.version}-cql`, 'snakeCase');

  return new Promise((resolve, reject) => {
    axios.post(`${API_BASE}/cql`, artifact, { responseType: 'blob' })
      .then((result) => { FileSaver.saveAs(result.data, `${fileName}.zip`); resolve(result.data); })
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
  return (dispatch) => {
    dispatch(requestDownloadArtifact());

    return sendDownloadArtifactRequest(artifact, dataModel)
      .then(() => {
        dispatch(downloadArtifactSuccess());
        sendValidateArtifactRequest(artifact)
          .then(res => dispatch(validateArtifactSuccess(res.data)));
      })
      .catch(error => dispatch(downloadArtifactFailure(error)));
  };
}

export function validateArtifact(artifact) {
  return (dispatch) => {
    dispatch(requestValidateArtifact());

    return sendValidateArtifactRequest(artifact)
      .then(res => dispatch(validateArtifactSuccess(res.data)))
      .catch(error => dispatch(validateArtifactFailure(error)));
  };
}

// ------------------------- EXECUTE ARTIFACT ----------------------------- //

function requestExecuteArtifact() {
  return {
    type: types.EXECUTE_ARTIFACT_REQUEST
  };
}

function executeArtifactSuccess(data, artifact, patient) {
  return {
    type: types.EXECUTE_ARTIFACT_SUCCESS,
    data,
    artifact,
    patient
  };
}

function executeArtifactFailure(error) {
  let errorMessage;
  if (error.response && error.response.status === 404) {
    errorMessage = 'Unable to retrieve codes for a value set in this artifact. This is a known issue with'
    + ' intensional value sets that will be resolved in an upcoming release';
  }
  return {
    type: types.EXECUTE_ARTIFACT_FAILURE,
    status: error.response ? error.response.status : '',
    statusText: errorMessage || (error.response ? error.response.statusText : '')
  };
}

function performExecuteArtifact(elmFiles, artifactName, patient, vsacCredentials, codeService, dataModel) {
  // Set up the library
  const elmFile = JSON.parse(_.find(elmFiles, f =>
    f.name.replace(/[\s-\\/]/g, '') === artifactName.replace(/[\s-\\/]/g, '')).content);
  const libraries = _.filter(elmFiles, f =>
    f.name.replace(/[\s-\\/]/g, '') !== artifactName.replace(/[\s-\\/]/g, '')).map(f => JSON.parse(f.content));
  const library = new cql.Library(elmFile, new cql.Repository(libraries));

  // Create the patient source
  const patientSource = (dataModel.version === '3.0.0')
    ? cqlfhir.PatientSource.FHIRv300()
    : cqlfhir.PatientSource.FHIRv102();

  // Load the patient source with the patient
  patientSource.loadBundles([patient]);

  // Extract the value sets from the ELM
  let valueSets = [];
  if (elmFile.library && elmFile.library.valueSets && elmFile.library.valueSets.def) {
    valueSets = elmFile.library.valueSets.def;
  }

  // Ensure value sets, downloading any missing value sets
  return codeService.ensureValueSets(valueSets, vsacCredentials.username, vsacCredentials.password)
    .then(() => {
      // Value sets are loaded, so execute!
      const executor = new cql.Executor(library, codeService);
      const results = executor.exec(patientSource);
      return results;
    });
}

export function executeCQLArtifact(artifact, patient, vsacCredentials, codeService, dataModel) {
  artifact.dataModel = dataModel;

  return (dispatch) => {
    dispatch(requestExecuteArtifact());

    return new Promise((resolve, reject) => {
      sendValidateArtifactRequest(artifact)
        .then((res) => {
          dispatch(validateArtifactSuccess(res.data));
          resolve(res);
        })
        .catch((error) => {
          dispatch(validateArtifactFailure(error));
          dispatch(executeArtifactFailure(error));
          reject();
        });
    }).then(res => performExecuteArtifact(
      res.data.elmFiles,
      artifact.name,
      patient,
      vsacCredentials,
      codeService,
      dataModel
    ))
      .then(r => dispatch(executeArtifactSuccess(r, artifact, patient)))
      .catch(error => dispatch(executeArtifactFailure(error)));
  };
}

// ------------------------- PUBLISH ARTIFACT ---------------------- //

function requestPublishArtifact() {
  return {
    type: types.PUBLISH_ARTIFACT_REQUEST
  };
}

function publishArtifactSuccess(data) {
  return {
    type: types.PUBLISH_ARTIFACT_SUCCESS,
    active: data.active
  };
}

function publishArtifactFailure(error) {
  return {
    type: types.PUBLISH_ARTIFACT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendPublishArtifactRequest(artifact) {
  return new Promise((resolve, reject) => {
    // TODO: This is not the correct API call. This will need to work with the RepoUploadModal.
    axios.get(`${API_BASE}/config/repo/publish`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function publishArtifact(artifact) {
  return (dispatch) => {
    dispatch(requestPublishArtifact());

    return sendPublishArtifactRequest(artifact)
      .then(data => dispatch(publishArtifactSuccess(data)))
      .catch(error => dispatch(publishArtifactFailure(error)));
  };
}

export function updatePublishEnabled(bool) {
  return {
    type: types.UPDATE_PUBLISH_ENABLED,
    bool
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
    return axios.post(`${API_BASE}/artifacts`, artifactWithoutId)
      .then(result => result.data);
  }

  return axios.put(`${API_BASE}/artifacts`, artifact).then(() => artifact);
}

export function saveArtifact(artifact) {
  return (dispatch) => {
    dispatch(requestSaveArtifact());

    return sendSaveArtifactRequest(artifact)
      .then(data => dispatch(saveArtifactSuccess(data)))
      .catch(error => dispatch(saveArtifactFailure(error)))
      .then(() => dispatch(loadArtifacts()));
  };
}

// ------------------------- DELETE ARTIFACT ---------------------------------- //

function requestDeleteArtifact() {
  return {
    type: types.DELETE_ARTIFACT_REQUEST
  };
}

function deleteArtifactSuccess(artifact) {
  return {
    type: types.DELETE_ARTIFACT_SUCCESS,
    artifact
  };
}

function deleteArtifactFailure(error) {
  return {
    type: types.DELETE_ARTIFACT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendDeleteArtifactRequest(artifact) {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_BASE}/artifacts/${artifact._id}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function deleteArtifact(artifact) {
  return (dispatch) => {
    dispatch(requestDeleteArtifact());

    return sendDeleteArtifactRequest(artifact)
      .then(data => dispatch(deleteArtifactSuccess(artifact)))
      .catch(error => dispatch(deleteArtifactFailure(error)))
      .then(() => dispatch(loadArtifacts()));
  };
}
