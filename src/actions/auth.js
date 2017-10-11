import axios from 'axios';
import Promise from 'promise';
import Config from '../../config';

import {
  USER_REQUEST, USER_RECEIVED,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
  SET_AUTH_STATUS
} from './types';

const API_BASE = Config.api.baseUrl;

// ------------------------- USER ------------------------------------------ //

function requestUser() {
  return {
    type: USER_REQUEST
  };
}

function userReceived(username) {
  return {
    type: USER_RECEIVED,
    username
  };
}

function sendUserRequest() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/auth/user`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function getCurrentUser() {
  return (dispatch) => {
    dispatch(requestUser());

    sendUserRequest()
      .then(data => dispatch(userReceived(data.uid)))
      .catch(() => dispatch(userReceived(null)));
  };
}

// ------------------------- LOGIN ----------------------------------------- //

function requestLogin() {
  return {
    type: LOGIN_REQUEST
  };
}

function loginSuccess(username) {
  return {
    type: LOGIN_SUCCESS,
    username
  };
}

function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendLoginRequest(username, password) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_BASE}/auth/login`, { username, password })
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loginUser(username, password) {
  return (dispatch) => {
    dispatch(requestLogin());

    return sendLoginRequest(username, password)
      .then(data => dispatch(loginSuccess(data.uid)))
      .catch(error => dispatch(loginFailure(error)));
  };
}

// ------------------------- LOGOUT ---------------------------------------- //

function requestLogout() {
  return {
    type: LOGOUT_REQUEST
  };
}

function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  };
}

function logoutFailure(error) {
  return {
    type: LOGOUT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

export function logoutUser() {
  return (dispatch) => {
    dispatch(requestLogout());

    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/auth/logout`)
        .then(() => resolve())
        .then(() => dispatch(logoutSuccess()))
        .catch(error => dispatch(logoutFailure(error)));
    });
  };
}

// ------------------------- AUTH STATUS ----------------------------------- //

export function setAuthStatus(status) {
  return {
    type: SET_AUTH_STATUS,
    status
  };
}

