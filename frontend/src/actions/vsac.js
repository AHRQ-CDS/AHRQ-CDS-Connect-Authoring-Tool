import axios from 'axios';
import Promise from 'promise';

import {
  VSAC_LOGIN_REQUEST, VSAC_LOGIN_SUCCESS, VSAC_LOGIN_FAILURE,
  SET_VSAC_AUTH_STATUS,
  VSAC_SEARCH_REQUEST, VSAC_SEARCH_SUCCESS, VSAC_SEARCH_FAILURE,
  VSAC_DETAILS_REQUEST, VSAC_DETAILS_SUCCESS, VSAC_DETAILS_FAILURE,
  VALIDATE_CODE_REQUEST, VALIDATE_CODE_SUCCESS, VALIDATE_CODE_FAILURE, VALIDATE_CODE_RESET
} from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- LOGIN ----------------------------------------- //

function requestLogin() {
  return {
    type: VSAC_LOGIN_REQUEST
  };
}

function loginSuccess(apiKey) {
  return {
    type: VSAC_LOGIN_SUCCESS,
    apiKey
  };
}

function loginFailure(error) {
  return {
    type: VSAC_LOGIN_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendLoginRequest(apiKey) {
  return new Promise((resolve, reject) => {
    const auth = {
      username: '',
      password: apiKey
    };

    axios.post(`${API_BASE}/fhir/login`, {}, { auth })
      .then(() => resolve())
      .catch(error => reject(error));
  });
}

export function loginVSACUser(apiKey) {
  return (dispatch) => {
    dispatch(requestLogin());

    return sendLoginRequest(apiKey)
      .then(() => dispatch(loginSuccess(apiKey)))
      .catch(error => dispatch(loginFailure(error)));
  };
}

// ------------------------- AUTH STATUS ----------------------------------- //

export function setVSACAuthStatus(status) {
  return {
    type: SET_VSAC_AUTH_STATUS,
    status
  };
}

// ------------------------- SEARCH VSAC ----------------------------------- //

function requestSearch() {
  return {
    type: VSAC_SEARCH_REQUEST
  };
}

function searchSuccess(data) {
  return {
    type: VSAC_SEARCH_SUCCESS,
    searchCount: data.count,
    searchResults: data.results
  };
}

function searchFailure(error) {
  return {
    type: VSAC_SEARCH_FAILURE
  };
}

export function searchVSACFHIR(keyword, apiKey) {
  const auth = {
    username: '',
    password: apiKey
  };

  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/fhir/search?keyword=${keyword}`, { auth })
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}


export function searchVSACByKeyword(keyword, apiKey) {
  return (dispatch) => {
    dispatch(requestSearch());

    return searchVSACFHIR(keyword, apiKey)
      .then(data => dispatch(searchSuccess(data)))
      .catch(error => dispatch(searchFailure(error)));
  };
}

// ------------------------- VSAC DETAILS ---------------------------------- //

function requestDetails() {
  return {
    type: VSAC_DETAILS_REQUEST
  };
}

function detailsSuccess(data) {
  return {
    type: VSAC_DETAILS_SUCCESS,
    codes: data.codes
  };
}

function detailsFailure(error) {
  let errorMessage = '';
  if (error.response.status === 404) {
    errorMessage = 'Unable to retrieve codes for this value set. This is a known issue with intensional value sets that'
      + ' will be resolved in an upcoming release.';
  }
  return {
    type: VSAC_DETAILS_FAILURE,
    detailsCodesErrorMessage: errorMessage
  };
}

function getVSDetailsByOIDFHIR(oid, apiKey) {
  const auth = {
    username: '',
    password: apiKey
  };

  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/fhir/vs/${oid}`, { auth })
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function getVSDetails(oid, apiKey) {
  return (dispatch) => {
    dispatch(requestDetails());

    return getVSDetailsByOIDFHIR(oid, apiKey)
      .then(data => dispatch(detailsSuccess(data)))
      .catch(error => dispatch(detailsFailure(error)));
  };
}

// ------------------------- VALIDATE VSAC CODE ---------------------------- //

function requestValidateCode() {
  return {
    type: VALIDATE_CODE_REQUEST
  };
}

function validateCodeSuccess(codeData) {
  return {
    type: VALIDATE_CODE_SUCCESS,
    codeData
  };
}

function validateCodeFailure(error) {
  return {
    type: VALIDATE_CODE_FAILURE
  };
}

function getValidateCode(codeText, selectedId, apiKey) {
  const auth = {
    username: '',
    password: apiKey
  };

  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/fhir/code?code=${codeText}&system=${selectedId}`, { auth })
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function validateCode(codeText, selectedId, apiKey) {
  return (dispatch) => {
    dispatch(requestValidateCode());

    return getValidateCode(codeText, selectedId, apiKey)
      .then(data => dispatch(validateCodeSuccess(data)))
      .catch(error => dispatch(validateCodeFailure(error)));
  };
}

export function resetCodeValidation() {
  return {
    type: VALIDATE_CODE_RESET
  };
}
