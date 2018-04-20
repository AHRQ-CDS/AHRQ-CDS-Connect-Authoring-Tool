import axios from 'axios';
import Promise from 'promise';

import * as types from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- GET CONVERSION FUNCTIONS --------------------------------- //

function requestConversionFunctions() {
  return {
    type: types.CONVERSION_FUNCTIONS_REQUEST
  };
}

function loadConversionFunctionsSuccess(conversionFunctions) {
  return {
    type: types.LOAD_CONVERSION_FUNCTIONS_SUCCESS,
    conversionFunctions
  };
}

function loadConversionFunctionsFailure(error) {
  return {
    type: types.LOAD_CONVERSION_FUNCTIONS_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendConversionFunctionsRequest() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/config/conversions`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export default function loadConversionFunctions() {
  return (dispatch) => {
    dispatch(requestConversionFunctions());

    return sendConversionFunctionsRequest()
      .then(data => dispatch(loadConversionFunctionsSuccess(data)))
      .catch(error => dispatch(loadConversionFunctionsFailure(error)));
  };
}
