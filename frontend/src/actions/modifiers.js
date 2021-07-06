import axios from 'axios';
import Promise from 'promise';
import _ from 'lodash';

import * as types from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------------- GET MODIFIERS -------------------------------------- //

function requestModifiers() {
  return {
    type: types.MODIFIERS_REQUEST
  };
}

function loadModifiersSuccess(modifiers) {
  const modifierMap = _.keyBy(modifiers, 'id');
  const modifiersByInputType = {};

  modifiers.forEach(modifier => {
    modifier.inputTypes.forEach(inputType => {
      modifiersByInputType[inputType] = (modifiersByInputType[inputType] || []).concat(modifier);
    });
  });

  return {
    type: types.LOAD_MODIFIERS_SUCCESS,
    modifierMap,
    modifiersByInputType
  };
}

function loadModifiersFailure(error) {
  return {
    type: types.LOAD_MODIFIERS_FAILURE,
    status: 'error',
    statusText: error.message
  };
}

function sendModifiersRequest(artifactId) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_BASE}/modifiers/${artifactId}`)
        .then(result => {
          resolve(result.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function loadModifiers(artifactId) {
  return dispatch => {
    dispatch(requestModifiers());

    return dispatch(sendModifiersRequest(artifactId))
      .then(data => dispatch(loadModifiersSuccess(data)))
      .catch(error => dispatch(loadModifiersFailure(error)));
  };
}

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
    axios
      .get(`${API_BASE}/config/conversions`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadConversionFunctions() {
  return dispatch => {
    dispatch(requestConversionFunctions());

    return sendConversionFunctionsRequest()
      .then(data => dispatch(loadConversionFunctionsSuccess(data)))
      .catch(error => dispatch(loadConversionFunctionsFailure(error)));
  };
}
