import {
  VSAC_AUTHENTICATION_REQUEST, VSAC_AUTHENTICATION_RECEIVED,
  VSAC_LOGIN_REQUEST, VSAC_LOGIN_SUCCESS, VSAC_LOGIN_FAILURE,
  SET_VSAC_AUTH_STATUS,
  VSAC_SEARCH_REQUEST, VSAC_SEARCH_SUCCESS, VSAC_SEARCH_FAILURE,
  VSAC_DETAILS_REQUEST, VSAC_DETAILS_SUCCESS, VSAC_DETAILS_FAILURE, LOGOUT_REQUEST,
  VALIDATE_CODE_REQUEST, VALIDATE_CODE_SUCCESS, VALIDATE_CODE_FAILURE, VALIDATE_CODE_RESET
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
  isValidatingCode: false,
  isValidCode: null,
  codeData: null,
  detailsCodes: [],
  username: null,
  password: null
};

export default function auth(state = defaultState, action) {
  switch (action.type) {
    case VSAC_AUTHENTICATION_REQUEST:
      return {
        ...state,
        isAuthenticating: true
      };
    case VSAC_AUTHENTICATION_RECEIVED:
      return {
        ...state,
        isAuthenticating: false,
        timeLastAuthenticated: action.timeLastAuthenticated
      };
    case VSAC_LOGIN_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
        authStatus: null
      };
    case VSAC_LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        timeLastAuthenticated: action.timeLastAuthenticated,
        authStatus: 'loginSuccess',
        authStatusText: 'You have been successfully logged in to VSAC.',
        username: action.username,
        password: action.password
      };
    case VSAC_LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        timeLastAuthenticated: null,
        authStatus: 'loginFailure',
        authStatusText: `Authentication Error: ${action.status} ${action.statusText}, please try again.`
      };
    case SET_VSAC_AUTH_STATUS:
      return {
        ...state,
        authStatus: action.status
      };
    case VSAC_SEARCH_REQUEST:
      return {
        ...state,
        isSearchingVSAC: true
      };
    case VSAC_SEARCH_SUCCESS:
      return {
        ...state,
        isSearchingVSAC: false,
        searchResults: action.searchResults,
        searchCount: action.searchCount
      };
    case VSAC_SEARCH_FAILURE:
      return {
        ...state,
        isSearchingVSAC: false,
        searchResults: [],
        searchCount: 0
      };
    case VSAC_DETAILS_REQUEST:
      return {
        ...state,
        isRetrievingDetails: true
      };
    case VSAC_DETAILS_SUCCESS:
      return {
        ...state,
        isRetrievingDetails: false,
        detailsCodes: action.codes
      };
    case VSAC_DETAILS_FAILURE:
      return {
        ...state,
        isRetrievingDetails: false,
        detailsCodes: []
      };
    case VALIDATE_CODE_REQUEST:
      return {
        ...state,
        isValidatingCode: true
      };
    case VALIDATE_CODE_SUCCESS:
      return {
        ...state,
        isValidatingCode: false,
        isValidCode: true,
        codeData: action.codeData
      };
    case VALIDATE_CODE_FAILURE:
      return {
        ...state,
        isValidatingCode: false,
        isValidCode: false,
        codeData: null
      };
    case VALIDATE_CODE_RESET:
      return {
        ...state,
        isValidatingCode: false,
        isValidCode: null,
        codeData: null
      };
    case LOGOUT_REQUEST:
      return defaultState;
    default:
      return state;
  }
}
