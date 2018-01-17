import axios from 'axios';
import Promise from 'promise';
import moment from 'moment';
import FileSaver from 'file-saver';
import _ from 'lodash';

import changeToCase from '../utils/strings';
import createTemplateInstance from '../utils/templates';
import loadTemplates from './templates';

import {
  SET_STATUS_MESSAGE, UPDATE_ARTIFACT, INITIALIZE_ARTIFACT,
  ARTIFACTS_REQUEST, LOAD_ARTIFACTS_SUCCESS, LOAD_ARTIFACTS_FAILURE,
  ARTIFACT_REQUEST, LOAD_ARTIFACT_SUCCESS, LOAD_ARTIFACT_FAILURE,
  ADD_ARTIFACT_REQUEST, ADD_ARTIFACT_SUCCESS, ADD_ARTIFACT_FAILURE,
  DELETE_ARTIFACT_REQUEST, DELETE_ARTIFACT_SUCCESS, DELETE_ARTIFACT_FAILURE,
  DOWNLOAD_ARTIFACT_REQUEST, DOWNLOAD_ARTIFACT_SUCCESS, DOWNLOAD_ARTIFACT_FAILURE,
  SAVE_ARTIFACT_REQUEST, SAVE_ARTIFACT_SUCCESS, SAVE_ARTIFACT_FAILURE,
  PUBLISH_ARTIFACT_REQUEST, PUBLISH_ARTIFACT_SUCCESS, PUBLISH_ARTIFACT_FAILURE,
  PUBLISH_ARTIFACT_ENABLED_REQUEST, PUBLISH_ARTIFACT_ENABLED_SUCCESS, PUBLISH_ARTIFACT_ENABLED_FAILURE
} from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- SET STATUS MESSAGE ---------------------------- //

export function setStatusMessage(statusType) {
  const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
  let message = null;

  if (statusType === 'save') message = `Saved ${time}.`;
  if (statusType === 'download') message = `Downloaded ${time}.`;
  if (statusType === 'publish') message = `Publishing not available. Saved ${time}.`;

  return {
    type: SET_STATUS_MESSAGE,
    message
  };
}

// ------------------------- UPDATE ARTIFACT ------------------------------- //

export function updateArtifact(artifactToUpdate, props) {
  return (dispatch) => {
    const artifact = Object.assign({}, artifactToUpdate, props);

    return dispatch({
      type: UPDATE_ARTIFACT,
      artifact
    });
  };
}

export function updateAndSaveArtifact(artifactToUpdate, props) {
  return (dispatch) => {
    const artifact = Object.assign({}, artifactToUpdate, props);

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
  newExpTreeIncludeNameParam.value = 'MeetsInclusionCriteria';

  const newExpTreeExclude = createTemplateInstance(template);
  newExpTreeExclude.name = '';
  newExpTreeExclude.path = '';
  const newExpTreeExcludeNameParam = newExpTreeExclude.parameters.find(param => param.id === 'element_name');
  newExpTreeExcludeNameParam.value = 'MeetsExclusionCriteria';

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
    booleanParameters: [],
    errorStatement: { statements: [] },
    uniqueIdCounter: 0
  };

  return {
    type: INITIALIZE_ARTIFACT,
    artifact
  };
}

// ------------------------- LOAD ARTIFACTS -------------------------------- //

function requestArtifacts() {
  return {
    type: ARTIFACTS_REQUEST
  };
}

function loadArtifactsSuccess(artifacts) {
  return {
    type: LOAD_ARTIFACTS_SUCCESS,
    artifacts
  };
}

function loadArtifactsFailure(error) {
  return {
    type: LOAD_ARTIFACTS_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendArtifactsRequest() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/artifacts?_=${+new Date()}`)
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
    type: ARTIFACT_REQUEST,
    id
  };
}

function loadArtifactSuccess(artifact) {
  return {
    type: LOAD_ARTIFACT_SUCCESS,
    artifact
  };
}

function loadArtifactFailure(error) {
  return {
    type: LOAD_ARTIFACT_FAILURE,
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
      .then(dispatch(setStatusMessage(null)));
  };
}

// ------------------------- ADD ARTIFACT ---------------------------------- //

function requestAddArtifact() {
  return {
    type: ADD_ARTIFACT_REQUEST
  };
}

function addArtifactSuccess() {
  return {
    type: ADD_ARTIFACT_SUCCESS
  };
}

function addArtifactFailure(error) {
  return {
    type: ADD_ARTIFACT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
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
      .catch(error => dispatch(addArtifactFailure(error)))
      .then(() => dispatch(loadArtifacts()));
  };
}

// ------------------------- DOWNLOAD ARTIFACT ----------------------------- //

function requestDownloadArtifact() {
  return {
    type: DOWNLOAD_ARTIFACT_REQUEST
  };
}

function downloadArtifactSuccess() {
  return {
    type: DOWNLOAD_ARTIFACT_SUCCESS
  };
}

function downloadArtifactFailure(error) {
  return {
    type: DOWNLOAD_ARTIFACT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendDownloadArtifactRequest(artifact) {
  const fileName = changeToCase(`${artifact.name}-v${artifact.version}-cql`, 'snakeCase');

  return new Promise((resolve, reject) => {
    axios.post(`${API_BASE}/cql`, artifact, { responseType: 'blob' })
      .then((result) => { FileSaver.saveAs(result.data, fileName); resolve(result.data); })
      .catch(error => reject(error));
  });
}

export function downloadArtifact(artifact) {
  return (dispatch) => {
    dispatch(requestDownloadArtifact());

    return sendDownloadArtifactRequest(artifact)
      .then(data => dispatch(downloadArtifactSuccess()))
      .catch(error => dispatch(downloadArtifactFailure(error)));
  };
}

// ------------------------- PUBLISH ARTIFACT ---------------------- //

function requestPublishArtifact() {
  return {
    type: PUBLISH_ARTIFACT_REQUEST
  };
}

function publishArtifactSuccess(artifact) {
  return {
    type: PUBLISH_ARTIFACT_SUCCESS,
    artifact
  };
}

function publishArtifactFailure(error) {
  return {
    type: PUBLISH_ARTIFACT_FAILURE,
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

// ------------------------- PUBLISH ARTIFACT ENABLED ---------------------- //

function requestPublishArtifactEnabled() {
  return {
    type: PUBLISH_ARTIFACT_ENABLED_REQUEST
  };
}

function publishArtifactEnabledSuccess(data) {
  return {
    type: PUBLISH_ARTIFACT_ENABLED_SUCCESS,
    active: data.active
  };
}

function publishArtifactEnabledFailure(error) {
  return {
    type: PUBLISH_ARTIFACT_ENABLED_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendPublishArtifactEnabledRequest(artifact) {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/config/repo/publish`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function publishArtifactEnabled(artifact) {
  return (dispatch) => {
    dispatch(requestPublishArtifactEnabled());

    return sendPublishArtifactEnabledRequest(artifact)
      .then(data => dispatch(publishArtifactEnabledSuccess(data)))
      .catch(error => dispatch(publishArtifactEnabledFailure(error)));
  };
}

// ------------------------- SAVE ARTIFACT --------------------------------- //

function requestSaveArtifact() {
  return {
    type: SAVE_ARTIFACT_REQUEST
  };
}

function saveArtifactSuccess(artifact) {
  return {
    type: SAVE_ARTIFACT_SUCCESS,
    artifact
  };
}

function saveArtifactFailure(error) {
  return {
    type: SAVE_ARTIFACT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
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
      .then(dispatch(loadArtifacts()));
  };
}

// ------------------------- DELETE ARTIFACT ---------------------------------- //

function requestDeleteArtifact() {
  return {
    type: DELETE_ARTIFACT_REQUEST
  };
}

function deleteArtifactSuccess(artifact) {
  return {
    type: DELETE_ARTIFACT_SUCCESS,
    artifact
  };
}

function deleteArtifactFailure(error) {
  return {
    type: DELETE_ARTIFACT_FAILURE,
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
      .then(dispatch(loadArtifacts()));
  };
}
