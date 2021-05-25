import axios from 'axios';
import Promise from 'promise';

import * as types from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- GET TEMPLATES --------------------------------- //

function requestTemplates() {
  return {
    type: types.TEMPLATES_REQUEST
  };
}

function loadTemplatesSuccess(templates) {
  return {
    type: types.LOAD_TEMPLATES_SUCCESS,
    templates
  };
}

function loadTemplatesFailure(error) {
  return {
    type: types.LOAD_TEMPLATES_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendTemplatesRequest() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_BASE}/config/templates`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export default function loadTemplates() {
  return dispatch => {
    dispatch(requestTemplates());

    return sendTemplatesRequest()
      .then(data => dispatch(loadTemplatesSuccess(data)))
      .catch(error => dispatch(loadTemplatesFailure(error)));
  };
}
