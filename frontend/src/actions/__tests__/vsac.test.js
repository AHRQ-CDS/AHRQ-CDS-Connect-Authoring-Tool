import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import * as actions from '../vsac';
import * as types from '../types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('vsac actions', () => {
  // ----------------------- LOGIN ----------------------------------------- //
  describe('logging in', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a VSAC_LOGIN_SUCCESS action upon a successful login attempt', () => {
      const store = mockStore({});
      const username = 'myUserName';
      const password = 'myPw';

      moxios.stubs.track({
        url: '/authoring/api/fhir/login',
        method: 'POST',
        response: { status: 200, response: {} }
      });

      const expectedActions = [
        { type: types.VSAC_LOGIN_REQUEST },
        { type: types.VSAC_LOGIN_SUCCESS, username: 'myUserName', password: 'myPw' }
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
        url: '/authoring/api/fhir/login',
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
        url: `/authoring/api/fhir/search?keyword=${keyword}`,
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
        url: `/authoring/api/fhir/search?keyword=${keyword}`,
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

  // ----------------------- DETAILS --------------------------------------- //
  describe('get vsac vs details', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a VSAC_DETAILS_SUCCESS action upon a successful attempt to get details', () => {
      const store = mockStore({});
      const oid = '1.2.3';
      const codes = [{ code: '123-4' }, { code: '987-6' }];

      moxios.stubs.track({
        url: `/authoring/api/fhir/vs/${oid}`,
        method: 'GET',
        response: { status: 200, response: { oid, codes } }
      });

      const expectedActions = [
        { type: types.VSAC_DETAILS_REQUEST },
        { type: types.VSAC_DETAILS_SUCCESS, codes }
      ];

      return store.dispatch(actions.getVSDetails(oid)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a VSAC_DETAILS_FAILURE action upon an unsuccessful attempt to get details', () => {
      const store = mockStore({});
      const oid = '1.2.3';

      moxios.stubs.track({
        url: `/authoring/api/fhir/vs/${oid}`,
        method: 'GET',
        response: { status: 404, statusText: 'Not Found' }
      });

      const detailsCodesErrorMessage = 'Unable to retrieve codes for this value set. This is a known issue with'
        + ' intensional value sets that will be resolved in an upcoming release.';

      const expectedActions = [
        { type: types.VSAC_DETAILS_REQUEST },
        { type: types.VSAC_DETAILS_FAILURE, detailsCodesErrorMessage }
      ];

      return store.dispatch(actions.getVSDetails(oid)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- VALIDATION ------------------------------------ //
  describe('get vsac validation', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a VALIDATE_CODE_SUCCESS action upon a successful attempt to validate a code', () => {
      const store = mockStore({});
      const codeText = '1.2.3';
      const selectedId = 'icd-9';
      const codeData = {};

      moxios.stubs.track({
        url: `/authoring/api/fhir/code?code=${codeText}&system=${selectedId}`,
        method: 'GET',
        response: { status: 200, response: codeData }
      });

      const expectedActions = [
        { type: types.VALIDATE_CODE_REQUEST },
        { type: types.VALIDATE_CODE_SUCCESS, codeData }
      ];

      return store.dispatch(actions.validateCode(codeText, selectedId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a VALIDATE_CODE_FAILURE action upon an unsuccessful attempt to validate a code', () => {
      const store = mockStore({});
      const codeText = '1.2.3';
      const selectedId = 'icd-9';

      moxios.stubs.track({
        url: `/authoring/api/fhir/code?code=${codeText}&system=${selectedId}`,
        method: 'GET',
        response: { status: 404, statusText: 'Not Found' }
      });

      const expectedActions = [
        { type: types.VALIDATE_CODE_REQUEST },
        { type: types.VALIDATE_CODE_FAILURE }
      ];

      return store.dispatch(actions.validateCode(codeText, selectedId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
