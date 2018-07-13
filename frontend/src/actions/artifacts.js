import axios from 'axios';
import Promise from 'promise';
import moment from 'moment';
import FileSaver from 'file-saver';
import _ from 'lodash';

import cql from 'cql-execution';
import cqlfhir from 'cql-exec-fhir';
import cqlvsac from 'cql-exec-vsac';

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

function parseTree(element, names) {
  parseConjunction(element, names);
  const children = element.childInstances;
  children.forEach((child) => {
    if ('childInstances' in child) {
      parseTree(child, names);
    }
  });
}

function parseConjunction(element, names) {
  element.childInstances.forEach((child) => {
    // Don't include parameters used in conjunctions since they are just refernces.
    // type = 'parameter'supports modern parameter references, template = 'EmptyParameter'for old parameter references.
    if (!(child.type === 'parameter' || child.template === 'EmptyParameter')) {
      const index = names.findIndex(name => name.id === child.uniqueId);
      if (index === -1) {
        names.push({ name: child.parameters[0].value, id: child.uniqueId });
      }
    }
  });
}

function parseForDuplicateNames(artifact) {
  const names = [];
  if (artifact.expTreeInclude.childInstances.length) {
    parseTree(artifact.expTreeInclude, names);
  }
  if (artifact.expTreeExclude.childInstances.length) {
    parseTree(artifact.expTreeExclude, names);
  }
  artifact.subpopulations.forEach((subpopulation) => {
    names.push({ name: subpopulation.subpopulationName, id: subpopulation.uniqueId });
    if (!subpopulation.special) { // `Doesn't Meet Inclusion Criteria` and `Meets Exclusion Criteria` are special
      if (subpopulation.childInstances.length) { parseTree(subpopulation, names); }
    }
  });
  artifact.subelements.forEach((subelement) => {
    names.push({ name: subelement.subpopulationName, id: subelement.uniqueId });
    if (!subelement.special) { // `Doesn't Meet Inclusion Criteria` and `Meets Exclusion Criteria` are special
      if (subelement.childInstances.length) { parseTree(subelement, names); }
    }
  });
  artifact.parameters.forEach((parameter, i) => {
    names.push({ name: parameter.name, id: parameter.uniqueId });
  });
  return names;
}

export function updateArtifact(artifactToUpdate, props) {
  return (dispatch) => {
    const artifact = {
      ...artifactToUpdate,
      ...props
    };
    const names = parseForDuplicateNames(artifact);
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

function initializeTrees(template) {
  const newSubpopulation = createTemplateInstance(template);
  newSubpopulation.name = '';
  newSubpopulation.path = '';
  newSubpopulation.subpopulationName = 'Subpopulation 1';
  newSubpopulation.expanded = true;

  const newExpTreeInclude = createTemplateInstance(template);
  newExpTreeInclude.name = '';
  newExpTreeInclude.path = '';
  const newExpTreeIncludeNameParam = newExpTreeInclude.parameters.find(param => param.id === 'element_name');
  if (newExpTreeIncludeNameParam) newExpTreeIncludeNameParam.value = 'MeetsInclusionCriteria';

  const newExpTreeExclude = createTemplateInstance(template);
  newExpTreeExclude.name = '';
  newExpTreeExclude.path = '';
  const newExpTreeExcludeNameParam = newExpTreeExclude.parameters.find(param => param.id === 'element_name');
  if (newExpTreeExcludeNameParam) newExpTreeExcludeNameParam.value = 'MeetsExclusionCriteria';

  return {
    newSubpopulation,
    newExpTreeInclude,
    newExpTreeExclude
  };
}

export function initializeArtifact(andTemplate) {
  const newTrees = initializeTrees(andTemplate);

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
    subelements: [],
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
  const names = parseForDuplicateNames(artifact);
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

      return dispatch(initializeArtifact(andTemplate));
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

function sendDownloadArtifactRequest(artifact) {
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

export function downloadArtifact(artifact) {
  return (dispatch) => {
    dispatch(requestDownloadArtifact());

    return sendDownloadArtifactRequest(artifact)
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
  return {
    type: types.EXECUTE_ARTIFACT_FAILURE,
  };
}

function performExecuteArtifact(elmFiles, artifactName, patient, vsacCredentials) {
  // Set up the library
  const elmFile = JSON.parse(_.find(elmFiles, f =>
    f.name.replace(/[\s-]/g, '') === artifactName.replace(/[\s-]/g, '')
  ).content);
  const libraries = _.filter(elmFiles, f =>
    f.name.replace(/[\s-]/g, '') !== artifactName.replace(/[\s-]/g, '')
  ).map(f => JSON.parse(f.content));
  const library = new cql.Library(elmFile, new cql.Repository(libraries));

  // Create the patient source
  const patientSource = cqlfhir.PatientSource.FHIRv102();

  // Load the patient source with the patient
  patientSource.loadBundles([patient]);

  // Extract the value sets from the ELM
  let valueSets = [];
  if (elmFile.library && elmFile.library.valueSets && elmFile.library.valueSets.def) {
    valueSets = elmFile.library.valueSets.def;
  }

  // TODO the code service should be stored, so value sets
  // don't need to be downloaded on every execution

  // Set up the code service
  const codeService = new cqlvsac.CodeService();

  // Ensure value sets, downloading any missing value sets
  return codeService.ensureValueSets(valueSets, vsacCredentials.username, vsacCredentials.password, false)
    .then(() => {
      // Value sets are loaded, so execute!
      const executor = new cql.Executor(library, codeService);
      const results = executor.exec(patientSource);
      return results;
    });
}

export function executeCQLArtifact(artifact, patient, vsacCredentials) {
  return (dispatch) => {
    dispatch(requestExecuteArtifact());

    return new Promise((resolve, reject) => {
      sendValidateArtifactRequest(artifact)
        .then(res => {
          dispatch(validateArtifactSuccess(res.data));
          resolve(res);
        })
        .catch(error => {
          dispatch(validateArtifactFailure(error));
          reject();
        });
    }).then((res) => performExecuteArtifact(res.data.elmFiles, artifact.name, patient, vsacCredentials))
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
