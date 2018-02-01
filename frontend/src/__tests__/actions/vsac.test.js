import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import * as actions from '../../actions/vsac';
import * as types from '../../actions/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('vsac actions', () => {
  // ----------------------- AUTHENTICATION--------------------------------- //
  describe('check VSAC authentication', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('sends a GET request to check authentication', () => {
      const store = mockStore({});
      const date = (new Date()).toISOString();

      moxios.stubs.track({
        url: '/authoring/api/vsac/checkAuthentication',
        method: 'GET',
        response: { status: 200, response: date }
      });

      const expectedActions = [
        { type: types.VSAC_AUTHENTICATION_REQUEST },
        {
          type: types.VSAC_AUTHENTICATION_RECEIVED,
          timeLastAuthenticated: new Date(date)
        }
      ];

      return store.dispatch(actions.checkVSACAuthentication()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('sends a VSAC_AUTHENTICATION_RECEIVED action with a null date if the request fails', () => {
      const store = mockStore({});

      moxios.stubs.track({
        url: /\/authoring\/api\/vsac\/checkAuthentication.*/,
        method: 'GET',
        response: { status: 401, response: {} }
      });

      const expectedActions = [
        { type: types.VSAC_AUTHENTICATION_REQUEST },
        { type: types.VSAC_AUTHENTICATION_RECEIVED, timeLastAuthenticated: new Date(null) }
      ];

      return store.dispatch(actions.checkVSACAuthentication()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- LOGIN ----------------------------------------- //
  describe('logging in', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a VSAC_LOGIN_SUCCESS action upon a successful login attempt', () => {
      const store = mockStore({});
      const username = 'myUserName';
      const password = 'myPw';

      moxios.stubs.track({
        url: '/authoring/api/vsac/login',
        method: 'POST',
        response: { status: 200, response: {} }
      });

      const date = new Date();
      date.setSeconds(date.getSeconds() + (Math.round(date.getMilliseconds() / 1000)));
      date.setMilliseconds(0);

      const expectedActions = [
        { type: types.VSAC_LOGIN_REQUEST },
        { type: types.VSAC_LOGIN_SUCCESS, timeLastAuthenticated: date }
      ];

      return store.dispatch(actions.loginVSACUser(username, password)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a VSAC_LOGIN_FAILURE action upon an unsuccessful login attempt', () => {
      const store = mockStore({});
      const username = 'myUserName';
      const password = 'myPw';

      moxios.stubs.track({
        url: '/authoring/api/vsac/login',
        method: 'POST',
        response: { status: 401, statusText: 'Unauthorized' }
      });

      const expectedActions = [
        { type: types.VSAC_LOGIN_REQUEST },
        { type: types.VSAC_LOGIN_FAILURE, status: 401, statusText: 'Unauthorized' }
      ];

      return store.dispatch(actions.loginVSACUser(username, password)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- AUTH STATUS ----------------------------------- //
  describe('setVSACAuthStatus', () => {
    it('dispatches a SET_VSAC_AUTH_STATUS action', () => {
      const store = mockStore({});

      store.dispatch(actions.setVSACAuthStatus('status message'));
      expect(store.getActions()).toEqual([
        { type: types.SET_VSAC_AUTH_STATUS, status: 'status message' }
      ]);
    });
  });

  // ----------------------- SEARCH ---------------------------------------- //
  describe('search vsac', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a VSAC_LOGIN_SUCCESS action upon a successful search', () => {
      const store = mockStore({});
      const keyword = 'key';
      const count = 2;
      const results = [{ a: 1 }, { b: 2 }];

      moxios.stubs.track({
        url: `/authoring/api/vsac/search?keyword=${keyword}`,
        method: 'GET',
        response: { status: 200, response: { keyword, count, results } }
      });

      const expectedActions = [
        { type: types.VSAC_SEARCH_REQUEST },
        { type: types.VSAC_SEARCH_SUCCESS, searchCount: count, searchResults: results }
      ];

      return store.dispatch(actions.searchVSACByKeyword(keyword)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a VSAC_SEARCH_FAILURE action upon an unsuccessful search attempt', () => {
      const store = mockStore({});
      const keyword = 'key';

      moxios.stubs.track({
        url: `/authoring/api/vsac/search?keyword=${keyword}`,
        method: 'GET',
        response: { status: 401, statusText: 'Unauthorized' }
      });

      const expectedActions = [
        { type: types.VSAC_SEARCH_REQUEST },
        { type: types.VSAC_SEARCH_FAILURE }
      ];

      return store.dispatch(actions.searchVSACByKeyword(keyword)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
