import axios from 'axios';
import Promise from 'promise';
import _ from 'lodash';

import * as types from './types';

const API_BASE = process.env.REACT_APP_API_URL;

function calculateParentsOfAllLibraries(libraries) {
  const parentsOfLibraries = {};
  libraries.forEach((lib) => {
    if (_.isUndefined(parentsOfLibraries[`${lib.name}-${lib.version}`])) {
      parentsOfLibraries[`${lib.name}-${lib.version}`] = [];
    }
    lib.details.dependencies.forEach((dep) => {
      if (_.isUndefined(parentsOfLibraries[`${dep.path}-${dep.version}`])) {
        parentsOfLibraries[`${dep.path}-${dep.version}`] = [];
      }
      parentsOfLibraries[`${dep.path}-${dep.version}`].push(`${lib.name}-${lib.version}`);
    });
  });
  return parentsOfLibraries;
}

// ------------------------- LOAD EXTERNAL CQL LIST ------------------------ //

function requestExternalCqlList() {
  return {
    type: types.EXTERNAL_CQL_LIST_REQUEST
  };
}

function loadExternalCqlListSuccess(externalCqlList) {
  const parentsOfLibraries = calculateParentsOfAllLibraries(externalCqlList);
  return {
    type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS,
    externalCqlList,
    parentsOfLibraries,
  };
}

function loadExternalCqlListFailure(error) {
  return {
    type: types.LOAD_EXTERNAL_CQL_LIST_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendExternalCqlListRequest(artifactId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/externalCQL/${artifactId}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadExternalCqlList(artifactId) {
  return (dispatch) => {
    dispatch(requestExternalCqlList());

    return sendExternalCqlListRequest(artifactId)
      .then(data => dispatch(loadExternalCqlListSuccess(data)))
      .catch(error => dispatch(loadExternalCqlListFailure(error)));
  };
}

// ------------------------- LOAD EXTERNAL CQL LIBRARY --------------------- //

function requestExternalCqlLibrary() {
  return {
    type: types.EXTERNAL_CQL_LIBRARY_REQUEST
  };
}

function loadExternalCqlLibrarySuccess(externalCqlLibrary) {
  return {
    type: types.LOAD_EXTERNAL_CQL_LIBRARY_SUCCESS,
    externalCqlLibrary
  };
}

function loadExternalCqlLibraryFailure(error) {
  return {
    type: types.LOAD_EXTERNAL_CQL_LIBRARY_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendExternalCqlLibraryRequest(id) {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/externalCQL/${id}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadExternalCqlLibrary(id) {
  return (dispatch) => {
    dispatch(requestExternalCqlLibrary());

    return sendExternalCqlLibraryRequest(id)
      .catch(error => dispatch(loadExternalCqlLibraryFailure(error)))
      .then(data => dispatch(loadExternalCqlLibrarySuccess(data)));
  };
}

// ------------------------- LOAD EXTERNAL CQL LIBRARY DETAILS ------------- //

function requestExternalCqlLibraryDetails() {
  return {
    type: types.EXTERNAL_CQL_LIBRARY_DETAILS_REQUEST
  };
}

function loadExternalCqlLibraryDetailsSuccess(externalCqlLibraryDetails) {
  return {
    type: types.LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_SUCCESS,
    externalCqlLibraryDetails
  };
}

function loadExternalCqlLibraryDetailsFailure(error) {
  return {
    type: types.LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendExternalCqlLibraryDetailsRequest(libraryId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/externalCQL/details/${libraryId}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadExternalCqlLibraryDetails(libraryId) {
  return (dispatch) => {
    dispatch(requestExternalCqlLibraryDetails());

    return sendExternalCqlLibraryDetailsRequest(libraryId)
      .then(data => dispatch(loadExternalCqlLibraryDetailsSuccess(data)))
      .catch(error => dispatch(loadExternalCqlLibraryDetailsFailure(error)));
  };
}

// ------------------------- ADD EXTERNAL CQL LIBRARY ---------------------- //

function requestAddExternalCqlLibrary() {
  return {
    type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST
  };
}

function addExternalCqlLibrarySuccess(data) {
  const message = typeof data === 'string' ? data : '';
  return {
    type: types.ADD_EXTERNAL_CQL_LIBRARY_SUCCESS,
    message
  };
}

function addExternalCqlLibraryFailure(error) {
  const statusText = (error.response && (typeof error.response.data === 'string')) ? error.response.data : '';
  const data = (error.response && _.isArray(error.response.data)) ? error.response.data : [];
  return {
    type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE,
    status: error.response ? error.response.status : '',
    statusText,
    data
  };
}

function sendAddExternalCqlLibraryRequest(library) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_BASE}/externalCQL`, { library })
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function addExternalLibrary(library) {
  return (dispatch) => {
    dispatch(requestAddExternalCqlLibrary());

    return sendAddExternalCqlLibraryRequest(library)
      .then(data => dispatch(addExternalCqlLibrarySuccess(data)))
      .catch(error => dispatch(addExternalCqlLibraryFailure(error)))
      .then(() => dispatch(loadExternalCqlList(library.artifactId)));
  };
}

export function clearExternalCqlValidationWarnings() {
  return {
    type: types.CLEAR_EXTERNAL_CQL_VALIDATION_WARNINGS
  };
}

// ------------------------- DELETE EXTERNAL CQL LIBRARY ------------------- //

function requestDeleteExternalCqlLibrary() {
  return {
    type: types.DELETE_EXTERNAL_CQL_LIBRARY_REQUEST
  };
}

function deleteExternalCqlLibrarySuccess() {
  return {
    type: types.DELETE_EXTERNAL_CQL_LIBRARY_SUCCESS
  };
}

function deleteExternalCqlLibraryFailure(error) {
  return {
    type: types.DELETE_EXTERNAL_CQL_LIBRARY_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendDeleteExternalCqlLibraryRequest(libraryId) {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_BASE}/externalCQL/${libraryId}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function deleteExternalCqlLibrary(libraryId, artifactId) {
  return (dispatch) => {
    dispatch(requestDeleteExternalCqlLibrary());

    return sendDeleteExternalCqlLibraryRequest(libraryId)
      .then(data => dispatch(deleteExternalCqlLibrarySuccess()))
      .catch(error => dispatch(deleteExternalCqlLibraryFailure(error)))
      .then(() => dispatch(loadExternalCqlList(artifactId)));
  };
}
