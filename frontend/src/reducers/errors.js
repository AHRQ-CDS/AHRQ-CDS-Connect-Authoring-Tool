import { SET_ERROR_MESSAGE } from '../actions/types';

const defaultState = { errorMessage: '' };

export default function errors(state = defaultState, action) {
  switch (action.type) {
    case SET_ERROR_MESSAGE:
      return Object.assign({}, state, { errorMessage: action.errorMessage });
    default:
      return state;
  }
}
