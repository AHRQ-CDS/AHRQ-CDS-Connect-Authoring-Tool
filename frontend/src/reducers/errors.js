import * as types from '../actions/types';

const defaultState = { errorMessage: '' };

export default function errors(state = defaultState, action) {
  switch (action.type) {
    case types.SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.errorMessage
      };
    default:
      return state;
  }
}
