import {
  SET_ERROR_MESSAGE
} from './types';

// ------------------------- ERROR MESSAGES -------------------------------- //

// sets the currently visible error message
export default function setErrorMessage(errorMessage) {
  return {
    type: SET_ERROR_MESSAGE,
    errorMessage
  };
}
