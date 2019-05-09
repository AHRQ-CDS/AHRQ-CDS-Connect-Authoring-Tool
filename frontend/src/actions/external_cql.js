import axios from 'axios';
import Promise from 'promise';

import * as types from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- LOAD EXTERNAL CQL LIST ------------------------ //

function requestExternalCqlList() {
  return {
    type: types.EXTERNAL_CQL_LIST_REQUEST
  };
}

function loadExternalCqlListSuccess(externalCqlList) {
  return {
    type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS,
    externalCqlList
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
      .catch(error => dispatch(loadExternalCqlListFailure(error)))
      .then(data => dispatch(loadExternalCqlListSuccess(data)));
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
      .catch(error => dispatch(loadExternalCqlLibraryDetailsFailure(error)))
      .then(data => dispatch(loadExternalCqlLibraryDetailsSuccess(data)));
  };
}

// ------------------------- ADD EXTERNAL CQL LIBRARY ---------------------- //

function requestAddExternalCqlLibrary() {
  return {
    type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST
  };
}

function addExternalCqlLibrarySuccess() {
  return {
    type: types.ADD_EXTERNAL_CQL_LIBRARY_SUCCESS
  };
}

function addExternalCqlLibraryFailure(error) {
  const statusText = (error.response && (typeof error.response.data === 'string')) ? error.response.data : '';
  const data = (error.response && (typeof error.response.data !== 'string')) ? error.response.data : [];
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
      .then(data => dispatch(addExternalCqlLibrarySuccess()))
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
      .catch(error => dispatch(deleteExternalCqlLibraryFailure(error)))
      .then(data => dispatch(deleteExternalCqlLibrarySuccess()))
      .then(() => dispatch(loadExternalCqlList(artifactId)));
  };
}
