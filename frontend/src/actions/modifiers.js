import axios from 'axios';
import Promise from 'promise';
import _ from 'lodash';

import * as types from './types';
import localModifiers from '../data/modifiers';

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

  modifiers.forEach((modifier) => {
    modifier.inputTypes.forEach((inputType) => {
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

function sendModifiersRequest() {
  // We only support editors for these types, so we have to use this list to
  // filter functions for modifiers that we are able to support.
  const editorTypes = ['boolean', 'system_code', 'system_concept', 'integer', 'datetime', 'decimal', 'system_quantity',
    'string', 'time', 'interval_of_integer', 'interval_of_datetime', 'interval_of_decimal', 'interval_of_quantity'];
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      try {
        const externalCqlList = getState().externalCQL.externalCqlList;
        const externalModifiers = [];
        externalCqlList.forEach(lib => {
          lib.details.functions.forEach(func => {
            // The ExternalModifier requires a functionName, libraryName,
            // arguments, and argumentTypes field that is not on other modifiers.
            // This is needed for the sake of testing whether external CQL libraries
            // can be deleted or updated or used as modifiers, by checking these details.
            if ((func.operand.length) >= 1 && (func.argumentTypes.length >= 1)
              && func.argumentTypes.slice(1).every(type => editorTypes.includes(type.calculated))) {
              const functionAndLibraryName = `${func.name} (from ${lib.name})`;
              const modifier = {
                id: functionAndLibraryName,
                type: 'ExternalModifier',
                name: functionAndLibraryName,
                inputTypes: func.inputTypes,
                returnType: func.calculatedReturnType,
                cqlTemplate: 'ExternalModifier',
                cqlLibraryFunction: `"${lib.name}"."${func.name}"`,
                values: { value: [] },
                functionName: func.name,
                libraryName: lib.name,
                arguments: func.operand,
                argumentTypes: func.argumentTypes
              };
              externalModifiers.push(modifier);
            }
          });
        });
        resolve(localModifiers.concat(externalModifiers));
      } catch (error) {
        reject(error);
      }
    });
  };
}

export function loadModifiers() {
  return (dispatch) => {
    dispatch(requestModifiers());

    return dispatch(sendModifiersRequest())
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
    axios.get(`${API_BASE}/config/conversions`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadConversionFunctions() {
  return (dispatch) => {
    dispatch(requestConversionFunctions());

    return sendConversionFunctionsRequest()
      .then(data => dispatch(loadConversionFunctionsSuccess(data)))
      .catch(error => dispatch(loadConversionFunctionsFailure(error)));
  };
}
