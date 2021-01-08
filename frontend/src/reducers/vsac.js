import { SET_VSAC_API_KEY } from 'actions/types';

const defaultState = {
  apiKey: null
};

export default function auth(state = defaultState, action) {
  switch (action.type) {
    case SET_VSAC_API_KEY:
      return {
        ...state,
        apiKey: action.apiKey
      };
    default:
      return state;
  }
}
