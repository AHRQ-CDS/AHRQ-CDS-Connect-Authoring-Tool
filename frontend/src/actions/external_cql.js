import axios from 'axios';
import Promise from 'promise';
import _ from 'lodash';

import changeToCase from '../utils/strings';

import * as types from './types';
import { saveArtifact, loadArtifact } from './artifacts';
import { loadModifiers } from './modifiers';

const API_BASE = process.env.REACT_APP_API_URL;

function calculateParentsOfAllLibraries(libraries) {
  const parentsOfLibraries = {};
  libraries.forEach(lib => {
    const libName = changeToCase(lib.name, 'paramCase');
    const libVersion = lib.version;
    if (_.isUndefined(parentsOfLibraries[`${libName}-${libVersion}`])) {
      parentsOfLibraries[`${libName}-${libVersion}`] = [];
    }
    lib.details.dependencies.forEach(dep => {
      const depName = changeToCase(dep.path, 'paramCase');
      const depVersion = dep.version;
      if (_.isUndefined(parentsOfLibraries[`${depName}-${depVersion}`])) {
        parentsOfLibraries[`${depName}-${depVersion}`] = [];
      }
      parentsOfLibraries[`${depName}-${depVersion}`].push(`${libName}-${libVersion}`);
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
    parentsOfLibraries
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
    axios
      .get(`${API_BASE}/externalCQL/${artifactId}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadExternalCqlList(artifactId) {
  return dispatch => {
    dispatch(requestExternalCqlList());

    return sendExternalCqlListRequest(artifactId)
      .then(data => dispatch(loadExternalCqlListSuccess(data)))
      .catch(error => dispatch(loadExternalCqlListFailure(error)))
      .then(() => dispatch(loadModifiers()));
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
    axios
      .get(`${API_BASE}/externalCQL/${id}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadExternalCqlLibrary(id) {
  return dispatch => {
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
    axios
      .get(`${API_BASE}/externalCQL/details/${libraryId}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadExternalCqlLibraryDetails(libraryId) {
  return dispatch => {
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
  const statusText = error.response && typeof error.response.data === 'string' ? error.response.data : '';
  const data = error.response && _.isArray(error.response.data) ? error.response.data : [];
  return {
    type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE,
    status: error.response ? error.response.status : '',
    statusText,
    data
  };
}

function sendAddExternalCqlLibraryRequest(library) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE}/externalCQL`, { library })
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function addExternalLibrary(library) {
  return dispatch => {
    //save the artifact BEFORE making external CQL changes
    //other wise the fhirVersion gets overwritten
    dispatch(saveArtifact(library.artifact));
    dispatch(requestAddExternalCqlLibrary());

    return sendAddExternalCqlLibraryRequest(library)
      .then(data => dispatch(addExternalCqlLibrarySuccess(data)))
      .catch(error => dispatch(addExternalCqlLibraryFailure(error)))
      .then(() => dispatch(loadExternalCqlList(library.artifact._id)))
      .then(() => dispatch(loadArtifact(library.artifact._id)));
  };
}

export function clearExternalCqlValidationWarnings() {
  return {
    type: types.CLEAR_EXTERNAL_CQL_VALIDATION_WARNINGS
  };
}

export function clearAddLibraryErrorsAndMessages() {
  return {
    type: types.CLEAR_ADD_EXTERNAL_LIBRARY_ERROR_AND_MESSAGES
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
    axios
      .delete(`${API_BASE}/externalCQL/${libraryId}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function deleteExternalCqlLibrary(libraryId, artifact) {
  return dispatch => {
    //save the artifact BEFORE making external CQL changes
    //other wise the fhirVersion gets overwritten
    dispatch(saveArtifact(artifact));
    dispatch(requestDeleteExternalCqlLibrary());

    return sendDeleteExternalCqlLibraryRequest(libraryId)
      .then(data => dispatch(deleteExternalCqlLibrarySuccess()))
      .catch(error => dispatch(deleteExternalCqlLibraryFailure(error)))
      .then(() => dispatch(loadExternalCqlList(artifact._id)))
      .then(() => dispatch(loadArtifact(artifact._id)));
  };
}
