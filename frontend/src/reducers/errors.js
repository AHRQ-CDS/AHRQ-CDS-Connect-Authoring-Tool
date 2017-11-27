import {
  SET_ERROR_MESSAGE
} from '../actions/types';

export default function errors(state = { errorMessage: '' }, action) {
  switch (action.type) {
    case SET_ERROR_MESSAGE:
      return Object.assign({}, state, { errorMessage: action.errorMessage });
    default:
      return state;
  }
}
