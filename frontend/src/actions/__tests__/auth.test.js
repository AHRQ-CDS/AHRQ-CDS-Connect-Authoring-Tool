import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import * as actions from '../auth';
import * as types from '../types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('auth actions', () => {
  // ----------------------- USER ------------------------------------------ //
  describe('get current user', () => {
    it('sends a GET request to find the current user', () => {
      const store = mockStore({});
      const username = 'myUserName';

      nock('http://localhost').get('/authoring/api/auth/user').query(true).reply(200, { uid: username });
      nock('http://localhost').get('/authoring/api/settings').reply(200, {});

      const expectedActions = [
        { type: types.USER_REQUEST },
        { type: types.USER_SETTINGS_REQUEST },
        { type: types.USER_SETTINGS_SUCCESS, settings: {} },
        { type: types.USER_RECEIVED, username }
      ];

      return store.dispatch(actions.getCurrentUser()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('sends a USER_RECEIVED action with a null username if the request fails', () => {
      const store = mockStore({});

      nock('http://localhost').get('/authoring/api/auth/user').query(true).reply(403);

      const expectedActions = [{ type: types.USER_REQUEST }, { type: types.USER_RECEIVED, username: null }];

      return store.dispatch(actions.getCurrentUser()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- LOGIN ----------------------------------------- //
  describe('logging in', () => {
    it('dispatches a LOGIN_SUCCESS action upon a successful login attempt', () => {
      const store = mockStore({});
      const username = 'myUserName';
      const password = 'myPw';

      nock('http://localhost').post('/authoring/api/auth/login').reply(200, { uid: username });
      nock('http://localhost').get('/authoring/api/settings').reply(200, {});

      const expectedActions = [
        { type: types.LOGIN_REQUEST },
        { type: types.USER_SETTINGS_REQUEST },
        { type: types.USER_SETTINGS_SUCCESS, settings: {} },
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

      nock('http://localhost')
        .post('/authoring/api/auth/login')
        .reply(403, function () {
          this.req.response.statusMessage = 'Invalid credentials';
          return { status: 403 };
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
    it('dispatches a LOGOUT_SUCCESS action upon successful logout', () => {
      const store = mockStore({});

      nock('http://localhost').get('/authoring/api/auth/logout').reply(200, {});

      const expectedActions = [{ type: types.LOGOUT_REQUEST }, { type: types.LOGOUT_SUCCESS }];

      return store.dispatch(actions.logoutUser()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOGOUT_FAILURE action upon an unsuccessful logout', () => {
      const store = mockStore({});

      nock('http://localhost')
        .get('/authoring/api/auth/logout')
        .reply(500, function () {
          this.req.response.statusMessage = 'Whoops!';
          return { status: 500 };
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
      expect(store.getActions()).toEqual([{ type: types.SET_AUTH_STATUS, status: 'status message' }]);
    });
  });

  // ------------------------- GET SETTINGS -------------------------------- //
  describe('get user settings', () => {
    it('dispatches a USER_SETTINGS_SUCCESS action upon successful attempt to get settings', () => {
      const store = mockStore();

      const mockSettings = { termsAcceptedDate: new Date().toString() };

      nock('http://localhost').get('/authoring/api/settings').reply(200, mockSettings);

      const expectedActions = [
        { type: types.USER_SETTINGS_REQUEST },
        { type: types.USER_SETTINGS_SUCCESS, settings: mockSettings }
      ];

      return store.dispatch(actions.getSettings()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a USER_SETTINGS_FAILURE action upon unsuccessful attempt to get settings', () => {
      const store = mockStore();

      nock('http://localhost')
        .get('/authoring/api/settings')
        .reply(500, function () {
          this.req.response.statusMessage = 'Internal error';
          return { status: 500 };
        });

      const expectedActions = [
        { type: types.USER_SETTINGS_REQUEST },
        { type: types.USER_SETTINGS_FAILURE, status: 500, statusText: 'Internal error' }
      ];

      return store.dispatch(actions.getSettings()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ------------------------- UPDATE SETTINGS ----------------------------- //
  describe('update user settings', () => {
    it('dispatches an UPDATE_USER_SETTINGS_SUCCESS action upon successfully updating settings', () => {
      const store = mockStore();

      const settings = {};

      nock('http://localhost').put('/authoring/api/settings').reply(200, settings);

      const expectedActions = [
        { type: types.UPDATE_USER_SETTINGS_REQUEST },
        { type: types.UPDATE_USER_SETTINGS_SUCCESS, settings }
      ];

      return store.dispatch(actions.updateSettings(settings)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches an UPDATE_USER_SETTINGS_FAILURE action upon unsuccessfully updating settings', () => {
      const store = mockStore();

      const settings = { termsAcceptedDate: new Date().toString() };

      nock('http://localhost')
        .put('/authoring/api/settings')
        .reply(500, function () {
          this.req.response.statusMessage = 'Internal error';
          return { status: 500 };
        });

      const expectedActions = [
        { type: types.UPDATE_USER_SETTINGS_REQUEST },
        { type: types.UPDATE_USER_SETTINGS_FAILURE, status: 500, statusText: 'Internal error' }
      ];

      return store.dispatch(actions.updateSettings(settings)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
