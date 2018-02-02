import axios from 'axios';
import Promise from 'promise';

import * as types from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- GET RESOURCES --------------------------------- //

function requestResources() {
  return {
    type: types.RESOURCES_REQUEST
  };
}

function loadResourcesSuccess(resources) {
  return {
    type: types.LOAD_RESOURCES_SUCCESS,
    resources
  };
}

function loadResourcesFailure(error) {
  return {
    type: types.LOAD_RESOURCES_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendResourcesRequest() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/config/resources`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export default function loadResources() {
  return (dispatch) => {
    dispatch(requestResources());

    return sendResourcesRequest()
      .then(data => dispatch(loadResourcesSuccess(data)))
      .catch(error => dispatch(loadResourcesFailure(error)));
  };
}
