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

function sendExternalCqlListRequest() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/externalCQL`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadExternalCqlList() {
  return (dispatch) => {
    dispatch(requestExternalCqlList());

    return sendExternalCqlListRequest()
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
  return {
    type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE,
    status: error.response ? error.response.status : '',
    statusText: error.response ? error.response.statusText : ''
  };
}

function sendAddExternalCqlLibraryRequest(library) {
  return dispatch => dispatch(saveExternalCqlLibrary(library));
}

export function addExternalLibrary(library) {
  return (dispatch) => {
    dispatch(requestAddExternalCqlLibrary());

    return dispatch(sendAddExternalCqlLibraryRequest(library))
      .then(data => dispatch(addExternalCqlLibrarySuccess()))
      .catch(error => dispatch(addExternalCqlLibraryFailure(error)));
  };
}

// ------------------------- SAVE EXTERNAL CQL LIBRARY --------------------- //

function requestSaveExternalCqlLibrary() {
  return {
    type: types.SAVE_EXTERNAL_CQL_LIBRARY_REQUEST
  };
}

function saveExternalCqlLibrarySuccess(library) {
  return {
    type: types.SAVE_EXTERNAL_CQL_LIBRARY_SUCCESS,
    library
  };
}

function saveExternalCqlLibraryFailure(error) {
  return {
    type: types.SAVE_EXTERNAL_CQL_LIBRARY_FAILURE,
    status: error.response ? error.response.status : '',
    statusText: error.response ? error.response.statusText : ''
  };
}

function sendSaveExternalCqlLibraryRequest(library) {
  return axios.post(`${API_BASE}/externalCQL`, { library })
    .then(result => result.data);
}

export function saveExternalCqlLibrary(library) {
  return (dispatch) => {
    dispatch(requestSaveExternalCqlLibrary());

    return sendSaveExternalCqlLibraryRequest(library)
      .catch(error => dispatch(saveExternalCqlLibraryFailure(error)))
      .then(data => dispatch(saveExternalCqlLibrarySuccess(data)))
      .then(() => dispatch(loadExternalCqlList()));
  };
}

// ------------------------- DELETE EXTERNAL CQL LIBRARY ------------------- //

function requestDeleteExternalCqlLibrary() {
  return {
    type: types.DELETE_EXTERNAL_CQL_LIBRARY_REQUEST
  };
}

function deleteExternalCqlLibrarySuccess(library) {
  return {
    type: types.DELETE_EXTERNAL_CQL_LIBRARY_SUCCESS,
    library
  };
}

function deleteExternalCqlLibraryFailure(error) {
  return {
    type: types.DELETE_EXTERNAL_CQL_LIBRARY_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendDeleteExternalCqlLibraryRequest(library) {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_BASE}/externalCQL/${library._id}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function deleteExternalCqlLibrary(library) {
  return (dispatch) => {
    dispatch(requestDeleteExternalCqlLibrary());

    return sendDeleteExternalCqlLibraryRequest(library)
      .catch(error => dispatch(deleteExternalCqlLibraryFailure(error)))
      .then(data => dispatch(deleteExternalCqlLibrarySuccess(library)))
      .then(() => dispatch(loadExternalCqlList()));
  };
}
