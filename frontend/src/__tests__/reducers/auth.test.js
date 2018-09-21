import * as types from '../../actions/types';
import reducer from '../../reducers/auth';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isAuthenticating: false,
      isAuthenticated: false,
      isLoggingOut: false,
      username: null,
      authStatus: null,
      authStatusText: ''
    });
  });

  // ----------------------- USER ------------------------------------------ //
  it('should handle getting the current user', () => {
    let action = { type: types.USER_REQUEST };
    let newState = { isAuthenticating: true };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { isAuthenticating: false };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.USER_RECEIVED, username: 'Test username' };
    newState = { isAuthenticating: false, isAuthenticated: true, username: 'Test username' };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- LOGIN ----------------------------------------- //
  it('should handle logging the user in', () => {
    let action = { type: types.LOGIN_REQUEST };
    let newState = { isAuthenticating: true, authStatus: null };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { isAuthenticating: false, authStatus: 'Test auth status' };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOGIN_SUCCESS, username: 'Test username' };
    newState = {
      isAuthenticating: false,
      isAuthenticated: true,
      username: 'Test username',
      authStatus: 'loginSuccess',
      authStatusText: 'You have been successfully logged in.'
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOGIN_FAILURE, status: 'Test status', statusText: 'Test status text' };
    newState = {
      isAuthenticating: false,
      isAuthenticated: false,
      authStatus: 'loginFailure',
      authStatusText: 'Authentication Error: Test status Test status text, please try again.'
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ------------------------- LOGOUT ---------------------------------------- //
  it('should handle logging the user out', () => {
    let action = { type: types.LOGOUT_REQUEST };
    let newState = { isAuthenticating: false, authStatus: null, isLoggingOut: true };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { isAuthenticating: false, authStatus: 'Test auth status' };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOGOUT_SUCCESS };
    newState = {
      isAuthenticating: false,
      isAuthenticated: false,
      isLoggingOut: false,
      username: null,
      authStatus: 'logoutSuccess',
      authStatusText: 'You have been successfully logged out.'
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOGOUT_FAILURE, status: 'Test status', statusText: 'Test status text' };
    newState = {
      isAuthenticating: false,
      isAuthenticated: false,
      isLoggingOut: false,
      authStatus: 'logoutFailure',
      authStatusText: 'Authentication Error: Test status Test status text, please try again.'
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ------------------------- AUTH STATUS ----------------------------------- //
  it('should handle setting the auth status', () => {
    const action = { type: types.SET_AUTH_STATUS, status: 'Test status' };
    const newState = { authStatus: 'Test status' };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { authStatus: 'Old test status' };
    expect(reducer(previousState, action)).toEqual(newState);
  });
});
