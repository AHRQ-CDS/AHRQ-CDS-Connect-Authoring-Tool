import axios from 'axios';
import Promise from 'promise';

import * as types from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- USER ------------------------------------------ //

function requestUser() {
  return {
    type: types.USER_REQUEST
  };
}

function userReceived(username) {
  return {
    type: types.USER_RECEIVED,
    username
  };
}

function sendUserRequest() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/auth/user`, { params: { _: +(new Date()) } })
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function getCurrentUser() {
  return (dispatch) => {
    dispatch(requestUser());

    return sendUserRequest()
      .then(data => dispatch(userReceived(data.uid)))
      .catch(() => dispatch(userReceived(null)));
  };
}

// ------------------------- LOGIN ----------------------------------------- //

function requestLogin() {
  return {
    type: types.LOGIN_REQUEST
  };
}

function loginSuccess(username) {
  return {
    type: types.LOGIN_SUCCESS,
    username
  };
}

function loginFailure(error) {
  return {
    type: types.LOGIN_FAILURE,
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
    type: types.LOGOUT_REQUEST
  };
}

function logoutSuccess() {
  return {
    type: types.LOGOUT_SUCCESS
  };
}

function logoutFailure(error) {
  return {
    type: types.LOGOUT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

export function logoutUser() {
  return (dispatch) => {
    dispatch(requestLogout());

    return axios.get(`${API_BASE}/auth/logout`)
      .then(() => dispatch(logoutSuccess()))
      .catch(error => dispatch(logoutFailure(error)));
  };
}

// ------------------------- AUTH STATUS ----------------------------------- //

export function setAuthStatus(status) {
  return {
    type: types.SET_AUTH_STATUS,
    status
  };
}
