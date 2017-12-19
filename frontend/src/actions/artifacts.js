import axios from 'axios';
import Promise from 'promise';
import moment from 'moment';
import FileSaver from 'file-saver';
import _ from 'lodash';
import changeToCase from '../utils/strings';
import createTemplateInstance from '../utils/templates';

import {
  SET_STATUS_MESSAGE, UPDATE_ARTIFACT, INITIALIZE_ARTIFACT,
  ARTIFACTS_REQUEST, LOAD_ARTIFACTS_SUCCESS, LOAD_ARTIFACTS_FAILURE,
  ARTIFACT_REQUEST, LOAD_ARTIFACT_SUCCESS, LOAD_ARTIFACT_FAILURE,
  ADD_ARTIFACT_REQUEST, ADD_ARTIFACT_SUCCESS, ADD_ARTIFACT_FAILURE,
  EDIT_ARTIFACT_REQUEST, EDIT_ARTIFACT_SUCCESS, EDIT_ARTIFACT_FAILURE,
  DELETE_ARTIFACT_REQUEST, DELETE_ARTIFACT_SUCCESS, DELETE_ARTIFACT_FAILURE,
  DOWNLOAD_ARTIFACT_REQUEST, DOWNLOAD_ARTIFACT_SUCCESS, DOWNLOAD_ARTIFACT_FAILURE,
  SAVE_ARTIFACT_REQUEST, SAVE_ARTIFACT_SUCCESS, SAVE_ARTIFACT_FAILURE,
  PUBLISH_ARTIFACT_REQUEST, PUBLISH_ARTIFACT_SUCCESS, PUBLISH_ARTIFACT_FAILURE
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
  return (dispatch, getState) => {
    const artifact = Object.assign({}, artifactToUpdate, props);

    return dispatch({
      type: UPDATE_ARTIFACT,
      artifact
    });
  };
}

export function updateAndSaveArtifact(artifactToUpdate, props) {
  return (dispatch, getState) => {
    const artifact = Object.assign({}, artifactToUpdate, props);

    return dispatch(editArtifact(artifact));
  };
}

// ------------------------- INITIALIZE ARTIFACT --------------------------- //

export function initializeArtifact(andTemplate) {
  const newSubpopulation = createTemplateInstance(andTemplate);
  newSubpopulation.name = '';
  newSubpopulation.path = '';
  newSubpopulation.subpopulationName = 'Subpopulation 1';
  newSubpopulation.expanded = true;

  const newExpTreeInclude = createTemplateInstance(andTemplate);
  newExpTreeInclude.name = '';
  newExpTreeInclude.path = '';
  const newExpTreeIncludeNameParam = newExpTreeInclude.parameters.find(param => param.id === 'element_name');
  newExpTreeIncludeNameParam.value = 'MeetsInclusionCriteria';

  const newExpTreeExclude = createTemplateInstance(andTemplate);
  newExpTreeExclude.name = '';
  newExpTreeExclude.path = '';
  const newExpTreeExcludeNameParam = newExpTreeExclude.parameters.find(param => param.id === 'element_name');
  newExpTreeExcludeNameParam.value = 'MeetsExclusionCriteria';

  const artifact = {
    _id: null,
    name: 'Untitled Artifact',
    version: '1',
    expTreeInclude: newExpTreeInclude,
    expTreeExclude: newExpTreeExclude,
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
      newSubpopulation
    ],
    booleanParameters: [],
    errorStatement: { statements: [] }
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

function addArtifactSuccess(artifact) {
  return {
    type: ADD_ARTIFACT_SUCCESS,
    artifact
  };
}

function addArtifactFailure(error) {
  return {
    type: ADD_ARTIFACT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendAddArtifactRequest(artifact) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_BASE}/artifacts`, {
      name: artifact.name,
      version: artifact.version,
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
        }
      ],
      booleanParameters: [],
      errorStatement: {
        statements: [],
        else: 'null'
      },
      uniqueIdCounter: 0
    }).then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function addArtifact(artifact) {
  return (dispatch) => {
    dispatch(requestAddArtifact());

    return sendAddArtifactRequest(artifact)
      .then(data => dispatch(addArtifactSuccess(artifact)))
      .catch(error => dispatch(addArtifactFailure(error)))
      .then(dispatch(loadArtifacts()));
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
  return new Promise((resolve, reject) => {
    axios.post(`${API_BASE}/artifacts`, _.omit(artifact, ['_id']))
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function saveArtifact(artifact) {
  return (dispatch) => {
    dispatch(requestSaveArtifact());

    return sendSaveArtifactRequest(artifact)
      .then(data => dispatch(saveArtifactSuccess(data)))
      .catch(error => dispatch(saveArtifactFailure(error)));
  };
}

// ------------------------- PUBLISH ARTIFACT ENABLED ---------------------- //

function requestPublishArtifactEnabled() {
  return {
    type: PUBLISH_ARTIFACT_REQUEST
  };
}

function publishArtifactEnabledSuccess(data) {
  return {
    type: PUBLISH_ARTIFACT_SUCCESS,
    active: data.active
  };
}

function publishArtifactEnabledFailure(error) {
  return {
    type: PUBLISH_ARTIFACT_FAILURE,
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

// ------------------------- EDIT ARTIFACT ---------------------------------- //

function requestEditArtifact() {
  return {
    type: EDIT_ARTIFACT_REQUEST
  };
}

function editArtifactSuccess(artifact) {
  return {
    type: EDIT_ARTIFACT_SUCCESS,
    artifact
  };
}

function editArtifactFailure(error) {
  return {
    type: EDIT_ARTIFACT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendEditArtifactRequest(artifact) {
  return new Promise((resolve, reject) => {
    axios.put(`${API_BASE}/artifacts`, artifact)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function editArtifact(artifact) {
  return (dispatch) => {
    dispatch(requestEditArtifact());

    return sendEditArtifactRequest(artifact)
      .then(data => dispatch(editArtifactSuccess(artifact)))
      .catch(error => dispatch(editArtifactFailure(error)))
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
