import axios from 'axios';
import Promise from 'promise';

import {
  VSAC_AUTHENTICATION_REQUEST, VSAC_AUTHENTICATION_RECEIVED,
  VSAC_LOGIN_REQUEST, VSAC_LOGIN_SUCCESS, VSAC_LOGIN_FAILURE,
  SET_VSAC_AUTH_STATUS
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
      .then(result => {console.log(result); resolve(result.data)})
      .catch(error => reject(error));
  });
}

export function checkVSACAuthentication() {
  return (dispatch) => {
    dispatch(requestAuthentication());

    sendAuthenticationRequest()
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

function loginSuccess() {
  return {
    type: VSAC_LOGIN_SUCCESS,
    timeLastAuthenticated: new Date()
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
      .then(() => dispatch(loginSuccess()))
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

