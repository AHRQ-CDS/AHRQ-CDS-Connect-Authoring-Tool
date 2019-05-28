import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import * as actions from '../../actions/external_cql';
import * as types from '../../actions/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('external cql actions', () => {
  // ----------------------- LOAD EXTERNAL CQL LIST ------------------------ //
  describe('load external cql list', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a LOAD_EXTERNAL_CQL_LIST_SUCCESS action upon a successful GET of list', () => {
      const store = mockStore({});
      const externalCqlList = [{ name: 'My Artifact' }, { name: 'My other artifact' }];
      const artifactId = 'abc132';

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${artifactId}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      const expectedActions = [
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList }
      ];

      return store.dispatch(actions.loadExternalCqlList(artifactId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOAD_EXTERNAL_CQL_LIST_FAILURE action upon an unsuccessful GET of list', () => {
      const store = mockStore({});
      const artifactId = 'abc132';

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${artifactId}`,
        method: 'GET',
        response: { status: 404, statusText: 'Not found' }
      });

      const expectedActions = [
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_FAILURE, status: 404, statusText: 'Not found' }
      ];

      return store.dispatch(actions.loadExternalCqlList(artifactId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ------------------------- LOAD EXTERNAL CQL LIBRARY DETAILS ------------- //
  describe('library details', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_SUCCESS action upon successful details request', () => {
      const store = mockStore({});
      const libraryId = 'lib123';
      const externalCqlLibraryDetails = [{ name: 'My Library', details: [] }];

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/details/${libraryId}`,
        method: 'GET',
        response: { status: 200, response: externalCqlLibraryDetails }
      });

      const expectedActions = [
        { type: types.EXTERNAL_CQL_LIBRARY_DETAILS_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_SUCCESS, externalCqlLibraryDetails }
      ];

      return store.dispatch(actions.loadExternalCqlLibraryDetails(libraryId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_FAILURE action upon an unsuccessful details request', () => {
      const store = mockStore({});
      const badLibraryId = 'notLib123';

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/details/${badLibraryId}`,
        method: 'GET',
        response: { status: 404, statusText: 'Not found' }
      });

      const expectedActions = [
        { type: types.EXTERNAL_CQL_LIBRARY_DETAILS_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_FAILURE, status: 404, statusText: 'Not found' }
      ];

      return store.dispatch(actions.loadExternalCqlLibraryDetails(badLibraryId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ------------------------- ADD EXTERNAL CQL LIBRARY ---------------------- //
  describe('add library', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches ADD_EXTERNAL_CQL_LIBRARY_SUCCESS action upon successful add', () => {
      const store = mockStore({});
      const library = { artifactId: 'id123' };
      const externalCqlList = [{ name: 'My Artifact' }, { name: 'My other artifact' }];

      moxios.stubs.track({
        url: '/authoring/api/externalCQL',
        method: 'POST',
        response: { status: 200, response: {} }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${library.artifactId}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      const expectedActions = [
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_SUCCESS },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList }
      ];

      return store.dispatch(actions.addExternalLibrary(library)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a ADD_EXTERNAL_CQL_LIBRARY_FAILURE action upon an unsuccessful add due to CQL-to-ELM errors', () => {
      const store = mockStore({});
      const badLibrary = { artifactId: 'id123' };
      const elmErrors = [{ startLine: 1 }, { startLine: 2 }];
      const externalCqlList = [{ name: 'My Artifact' }, { name: 'My other artifact' }];

      moxios.stubs.track({
        url: '/authoring/api/externalCQL',
        method: 'POST',
        response: { status: 400, statusText: 'Bad Request', response: elmErrors }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${badLibrary.artifactId}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });


      const expectedActions = [
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE, status: 400, statusText: '', data: elmErrors },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList }
      ];

      return store.dispatch(actions.addExternalLibrary(badLibrary)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a ADD_EXTERNAL_CQL_LIBRARY_FAILURE action upon an unsuccessful add due to duplicate library', () => {
      const store = mockStore({});
      const badLibrary = { artifactId: 'id123' };
      const dupLibraryText = 'Library with identical name and version already exists.';
      const externalCqlList = [{ name: 'My Artifact' }, { name: 'My other artifact' }];

      moxios.stubs.track({
        url: '/authoring/api/externalCQL',
        method: 'POST',
        response: { status: 409, statusText: 'Conflict', response: dupLibraryText }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${badLibrary.artifactId}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      const expectedActions = [
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE, status: 409, statusText: dupLibraryText, data: [] },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList }
      ];

      return store.dispatch(actions.addExternalLibrary(badLibrary)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a ADD_EXTERNAL_CQL_LIBRARY_FAILURE action upon an unsuccessful add due to other errors', () => {
      // An other error could be that the cql-to-elm translator is down.
      const store = mockStore({});
      const badLibrary = { artifactId: 'id123' };
      const externalCqlList = [{ name: 'My Artifact' }, { name: 'My other artifact' }];

      moxios.stubs.track({
        url: '/authoring/api/externalCQL',
        method: 'POST',
        response: { status: 500, statusText: 'Internal Server Error' }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${badLibrary.artifactId}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      const expectedActions = [
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE, status: 500, statusText: '', data: [] },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList }
      ];

      return store.dispatch(actions.addExternalLibrary(badLibrary)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ------------------------- DELETE EXTERNAL CQL LIBRARY ------------------- //
  describe('delete library', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a DELETE_EXTERNAL_CQL_LIBRARY_SUCCESS action upon successful delete', () => {
      const store = mockStore({});
      const libraryId = 'lib123';
      const artifactId = 'artifact123';
      const externalCqlList = [{ name: 'My Artifact' }, { name: 'My other artifact' }];

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${libraryId}`,
        method: 'DELETE',
        response: { status: 200, response: {} }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${artifactId}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      const expectedActions = [
        { type: types.DELETE_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.DELETE_EXTERNAL_CQL_LIBRARY_SUCCESS },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList }
      ];

      return store.dispatch(actions.deleteExternalCqlLibrary(libraryId, artifactId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a DELETE_EXTERNAL_CQL_LIBRARY_FAILURE action upon failed delete', () => {
      const store = mockStore({});
      const libraryId = 'lib123';
      const artifactId = 'artifact123';
      const externalCqlList = [{ name: 'My Artifact' }, { name: 'My other artifact' }];

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${libraryId}`,
        method: 'DELETE',
        response: { status: 404, statusText: 'Not found', response: {} }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${artifactId}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      const expectedActions = [
        { type: types.DELETE_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.DELETE_EXTERNAL_CQL_LIBRARY_FAILURE, status: 404, statusText: 'Not found' },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList }
      ];

      return store.dispatch(actions.deleteExternalCqlLibrary(libraryId, artifactId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
