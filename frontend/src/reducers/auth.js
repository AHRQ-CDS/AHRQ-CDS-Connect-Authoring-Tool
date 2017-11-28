import {
  USER_REQUEST, USER_RECEIVED,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
  SET_AUTH_STATUS
} from '../actions/types';

const defaultState = {
  isAuthenticating: false,
  isAuthenticated: false,
  username: null,
  authStatus: null,
  authStatusText: ''
};

export default function auth(state = defaultState, action) {
  const isAuthenticated = action.username != null;

  switch (action.type) {
    case USER_REQUEST:
      return Object.assign({}, state, { isAuthenticating: true });
    case USER_RECEIVED:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated,
        username: action.username
      });
    case LOGIN_REQUEST:
      return Object.assign({}, state, { isAuthenticating: true, authStatus: null });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: true,
        username: action.username,
        authStatus: 'loginSuccess',
        authStatusText: 'You have been successfully logged in.'
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: false,
        authStatus: 'loginFailure',
        authStatusText: `Authentication Error: ${action.status} ${action.statusText}, please try again.`
      });
    case LOGOUT_REQUEST:
      return Object.assign({}, state, { isAuthenticating: false, authStatus: null });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: false,
        username: null,
        authStatus: 'logoutSuccess',
        authStatusText: 'You have been successfully logged out.'
      });
    case LOGOUT_FAILURE:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: false,
        authStatus: 'logoutFailure',
        authStatusText: `Authentication Error: ${action.status} ${action.statusText}, please try again.`
      });
    case SET_AUTH_STATUS:
      return Object.assign({}, state, { authStatus: action.status });
    default:
      return state;
  }
}
