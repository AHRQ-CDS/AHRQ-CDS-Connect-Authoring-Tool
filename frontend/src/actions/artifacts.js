import axios from 'axios';
import Promise from 'promise';

import { ARTIFACTS_REQUEST, LOAD_ARTIFACTS_SUCCESS, LOAD_ARTIFACTS_FAILURE,
ADD_ARTIFACT_REQUEST, ADD_ARTIFACT_SUCCESS, ADD_ARTIFACT_FAILURE,
EDIT_ARTIFACT_REQUEST, EDIT_ARTIFACT_SUCCESS, EDIT_ARTIFACT_FAILURE,
DELETE_ARTIFACT_REQUEST, DELETE_ARTIFACT_SUCCESS, DELETE_ARTIFACT_FAILURE } from './types';

const API_BASE = process.env.REACT_APP_API_URL;

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

    sendAddArtifactRequest(artifact)
      .then(data => dispatch(addArtifactSuccess(artifact)))
      .catch(error => dispatch(addArtifactFailure(error)))
      .then(dispatch(loadArtifacts()));
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
  const artifactToUpdate = {
    name: artifact.name,
    version: artifact.version,
    expTreeInclude: artifact.expTreeInclude,
    expTreeExclude: artifact.expTreeExclude,
    _id: artifact._id
  };

  return new Promise((resolve, reject) => {
    axios.put(`${API_BASE}/artifacts`, artifactToUpdate)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function editArtifact(artifact) {
  return (dispatch) => {
    dispatch(requestEditArtifact());

    sendEditArtifactRequest(artifact)
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

    sendDeleteArtifactRequest(artifact)
      .then(data => dispatch(deleteArtifactSuccess(artifact)))
      .catch(error => dispatch(deleteArtifactFailure(error)))
      .then(dispatch(loadArtifacts()));
  };
}
