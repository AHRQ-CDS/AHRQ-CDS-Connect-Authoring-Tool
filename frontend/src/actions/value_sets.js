import axios from 'axios';
import Promise from 'promise';

import {
  VALUE_SETS_REQUEST, LOAD_VALUE_SETS_SUCCESS, LOAD_VALUE_SETS_FAILURE
} from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- GET VALUE SETS --------------------------------- //

function requestValueSets() {
  return {
    type: VALUE_SETS_REQUEST
  };
}

function loadValueSetsSuccess(valueSets) {
  return {
    type: LOAD_VALUE_SETS_SUCCESS,
    valueSets
  };
}

function loadValueSetsFailure(error) {
  return {
    type: LOAD_VALUE_SETS_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendValueSetsRequest(selection) {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/config/valuesets/${selection}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export default function loadValueSets(selection) {
  return (dispatch) => {
    dispatch(requestValueSets());

    return sendValueSetsRequest(selection)
      .then(data => dispatch(loadValueSetsSuccess(data)))
      .catch(error => dispatch(loadValueSetsFailure(error)));
  };
}
