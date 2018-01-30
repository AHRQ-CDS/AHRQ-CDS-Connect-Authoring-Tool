import * as types from './types';

// ------------------------- ERROR MESSAGES -------------------------------- //

// sets the currently visible error message
export default function setErrorMessage(errorMessage) {
  return {
    type: types.SET_ERROR_MESSAGE,
    errorMessage
  };
}
