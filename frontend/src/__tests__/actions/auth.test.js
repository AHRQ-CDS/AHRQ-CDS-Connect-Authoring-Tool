import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import * as actions from '../../actions/auth';
import * as types from '../../actions/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('auth actions', () => {
  // ----------------------- USER ------------------------------------------ //
  describe('get current user', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('sends a GET request to find the current user', () => {
      const store = mockStore({});
      const username = 'myUserName';

      moxios.stubs.track({
        url: /\/authoring\/api\/auth\/user\?.*/,
        method: 'GET',
        response: { status: 200, response: { uid: username } }
      });

      const expectedActions = [
        { type: types.USER_REQUEST },
        { type: types.USER_RECEIVED, username }
      ];

      return store.dispatch(actions.getCurrentUser()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('sends a USER_RECEIVED action with a null username if the request fails', () => {
      const store = mockStore({});

      moxios.stubs.track({
        url: /\/authoring\/api\/auth\/user\?.*/,
        method: 'GET',
        response: { status: 403, response: {} }
      });

      const expectedActions = [
        { type: types.USER_REQUEST },
        { type: types.USER_RECEIVED, username: null }
      ];

      return store.dispatch(actions.getCurrentUser()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- LOGIN ----------------------------------------- //
  describe('logging in', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a LOGIN_SUCCESS action upon a successful login attempt', () => {
      const store = mockStore({});
      const username = 'myUserName';
      const password = 'myPw';

      moxios.stubs.track({
        url: '/authoring/api/auth/login',
        method: 'POST',
        response: { status: 200, response: { uid: username } }
      });

      const expectedActions = [
        { type: types.LOGIN_REQUEST },
        { type: types.LOGIN_SUCCESS, username }
      ];

      return store.dispatch(actions.loginUser(username, password)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOGIN_FAILURE action upon an unsuccessful login attempt', () => {
      const store = mockStore({});
      const username = 'myUserName';
      const password = 'myPw';

      moxios.stubs.track({
        url: '/authoring/api/auth/login',
        method: 'POST',
        response: { status: 403, statusText: 'Invalid credentials' }
      });

      const expectedActions = [
        { type: types.LOGIN_REQUEST },
        { type: types.LOGIN_FAILURE, status: 403, statusText: 'Invalid credentials' }
      ];

      return store.dispatch(actions.loginUser(username, password)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- LOGOUT ---------------------------------------- //
  describe('logging out', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a LOGOUT_SUCCESS action upon successful logout', () => {
      const store = mockStore({});

      moxios.stubs.track({
        url: '/authoring/api/auth/logout',
        method: 'GET',
        response: { status: 200, response: {} }
      });

      const expectedActions = [
        { type: types.LOGOUT_REQUEST },
        { type: types.LOGOUT_SUCCESS }
      ];

      return store.dispatch(actions.logoutUser()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOGOUT_FAILURE action upon an unsuccessful logout', () => {
      const store = mockStore({});

      moxios.stubs.track({
        url: '/authoring/api/auth/logout',
        method: 'GET',
        response: { status: 500, statusText: 'Whoops!' }
      });

      const expectedActions = [
        { type: types.LOGOUT_REQUEST },
        { type: types.LOGOUT_FAILURE, status: 500, statusText: 'Whoops!' }
      ];

      return store.dispatch(actions.logoutUser()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- AUTH STATUS ----------------------------------- //
  describe('setAuthStatus', () => {
    it('dispatches a SET_AUTH_STATUS action', () => {
      const store = mockStore({});

      store.dispatch(actions.setAuthStatus('status message'));
      expect(store.getActions()).toEqual([
        { type: types.SET_AUTH_STATUS, status: 'status message' }
      ]);
    });
  });
});
