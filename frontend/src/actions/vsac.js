import axios from 'axios';
import Promise from 'promise';

import {
  VSAC_AUTHENTICATION_REQUEST, VSAC_AUTHENTICATION_RECEIVED,
  VSAC_LOGIN_REQUEST, VSAC_LOGIN_SUCCESS, VSAC_LOGIN_FAILURE,
  SET_VSAC_AUTH_STATUS,
  VSAC_SEARCH_REQUEST, VSAC_SEARCH_SUCCESS, VSAC_SEARCH_FAILURE,
  VSAC_DETAILS_REQUEST, VSAC_DETAILS_SUCCESS, VSAC_DETAILS_FAILURE
} from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- AUTHENTICATION -------------------------------- //

function requestAuthentication() {
  return {
    type: VSAC_AUTHENTICATION_REQUEST
  };
}

function authenticationReceived(time) {
  const date = new Date(time);
  return {
    type: VSAC_AUTHENTICATION_RECEIVED,
    timeLastAuthenticated: date
  };
}

function sendAuthenticationRequest() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/vsac/checkAuthentication`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function checkVSACAuthentication() {
  return (dispatch) => {
    dispatch(requestAuthentication());

    return sendAuthenticationRequest()
      .then(data => dispatch(authenticationReceived(data)))
      .catch(() => dispatch(authenticationReceived(null)));
  };
}

// ------------------------- LOGIN ----------------------------------------- //

function requestLogin() {
  return {
    type: VSAC_LOGIN_REQUEST
  };
}

function loginSuccess(username, password) {
  // Round date to nearest second.
  const date = new Date();
  date.setSeconds(date.getSeconds() + (Math.round(date.getMilliseconds() / 1000)));
  date.setMilliseconds(0);
  return {
    type: VSAC_LOGIN_SUCCESS,
    timeLastAuthenticated: date,
    username,
    password,
  };
}

function loginFailure(error) {
  return {
    type: VSAC_LOGIN_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendLoginRequest(username, password) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_BASE}/vsac/login`, { username, password })
      .then(() => resolve())
      .catch(error => reject(error));
  });
}

export function loginVSACUser(username, password) {
  return (dispatch) => {
    dispatch(requestLogin());

    return sendLoginRequest(username, password)
      .then(() => dispatch(loginSuccess(username, password)))
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

// Left in place should we ever decide to swap back to not using FHIR API.
// function searchVSAC(keyword) {
//   return new Promise((resolve, reject) => {
//     axios.get(`${API_BASE}/vsac/search?keyword=${keyword}`)
//       .then(result => resolve(result.data))
//       .catch(error => reject(error));
//   });
// }

export function searchVSACFHIR(keyword, username, password) {
  const auth = {
    username,
    password
  };

  return new Promise((resolve, reject) => {
    axios.get(`/authoring/api/fhir/search?keyword=${keyword}`, { auth })
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}


export function searchVSACByKeyword(keyword, username, password) {
  return (dispatch) => {
    dispatch(requestSearch());

    return searchVSACFHIR(keyword, username, password)
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
  return {
    type: VSAC_DETAILS_FAILURE
  };
}

function getVSDetailsByOIDFHIR(oid, username, password) {
  const auth = {
    username,
    password
  };

  return new Promise((resolve, reject) => {
    axios.get(`/authoring/api/fhir/vs/${oid}`, { auth })
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

// Left in place should we ever decide to swap back to not using FHIR API.
// function getVSDetailsByOID(oid) {
//   return new Promise((resolve, reject) => {
//     axios.get(`${API_BASE}/vsac/vs/${oid}`)
//       .then(result => resolve(result.data))
//       .catch(error => reject(error));
//   });
// }

export function getVSDetails(oid, username, password) {
  return (dispatch) => {
    dispatch(requestDetails());

    return getVSDetailsByOIDFHIR(oid, username, password)
      .then(data => dispatch(detailsSuccess(data)))
      .catch(error => dispatch(detailsFailure(error)));
  };
}
