import {
  VSAC_AUTHENTICATION_REQUEST, VSAC_AUTHENTICATION_RECEIVED,
  VSAC_LOGIN_REQUEST, VSAC_LOGIN_SUCCESS, VSAC_LOGIN_FAILURE,
  SET_VSAC_AUTH_STATUS,
  VSAC_SEARCH_REQUEST, VSAC_SEARCH_SUCCESS, VSAC_SEARCH_FAILURE,
  VSAC_DETAILS_REQUEST, VSAC_DETAILS_SUCCESS, VSAC_DETAILS_FAILURE
} from '../actions/types';

const defaultState = {
  isAuthenticating: false,
  timeLastAuthenticated: null,
  authStatus: null,
  authStatusText: '',
  isSearchingVSAC: false,
  searchResults: [],
  searchCount: 0,
  isRetrievingDetails: false,
  detailsCodes: []
};

export default function auth(state = defaultState, action) {
  switch (action.type) {
    case VSAC_AUTHENTICATION_REQUEST:
      return Object.assign({}, state, { isAuthenticating: true });
    case VSAC_AUTHENTICATION_RECEIVED:
      return Object.assign({}, state, {
        isAuthenticating: false,
        timeLastAuthenticated: action.timeLastAuthenticated
      });
    case VSAC_LOGIN_REQUEST:
      return Object.assign({}, state, { isAuthenticating: true, authStatus: null });
    case VSAC_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticating: false,
        timeLastAuthenticated: action.timeLastAuthenticated,
        authStatus: 'loginSuccess',
        authStatusText: 'You have been successfully logged in to VSAC.'
      });
    case VSAC_LOGIN_FAILURE:
      return Object.assign({}, state, {
        isAuthenticating: false,
        timeLastAuthenticated: null,
        authStatus: 'loginFailure',
        authStatusText: `Authentication Error: ${action.status} ${action.statusText}, please try again.`
      });
    case SET_VSAC_AUTH_STATUS:
      return Object.assign({}, state, { authStatus: action.status });
    case VSAC_SEARCH_REQUEST:
      return Object.assign({}, state, { isSearchingVSAC: true });
    case VSAC_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        isSearchingVSAC: false,
        searchResults: action.searchResults,
        searchCount: action.searchCount
      });
    case VSAC_SEARCH_FAILURE:
      return Object.assign({}, state, {
        isSearchingVSAC: false,
        searchResults: [],
        searchCount: 0
      });
    case VSAC_DETAILS_REQUEST:
      return Object.assign({}, state, { isRetrievingDetails: true });
    case VSAC_DETAILS_SUCCESS:
      return Object.assign({}, state, {
        isRetrievingDetails: false,
        detailsCodes: action.codes
      });
    case VSAC_DETAILS_FAILURE:
      return Object.assign({}, state, {
        isRetrievingDetails: false,
        detailsCodes: []
      });
    default:
      return state;
  }
}
