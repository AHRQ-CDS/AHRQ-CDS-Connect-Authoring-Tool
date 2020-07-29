import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import * as actions from '../external_cql';
import * as types from '../types';

import mockArtifact from '../../mocks/mockArtifact';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Names used in mockArtifact -  used in multiple tests and never changed
const mockArtifactNames = [
  { name: 'Doesn\'t Meet Inclusion Criteria', id: 'default-subpopulation-1' },
  { name: 'Meets Exclusion Criteria', id: 'default-subpopulation-2' },
  { name: 'Subpopulation 1', id: 'And-TEST-1' }
];

describe('external cql actions', () => {
  // ----------------------- LOAD EXTERNAL CQL LIST ------------------------ //
  describe('load external cql list', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a LOAD_EXTERNAL_CQL_LIST_SUCCESS action upon a successful GET of list', () => {
      const store = mockStore({});
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        { name: 'My other artifact', version: '1', details: { dependencies: [] } }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };
      const artifactId = 'abc132';

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${artifactId}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      const expectedActions = [
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList, parentsOfLibraries }
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

    it('correctly calculates library parents after fetching list', () => {
      const store = mockStore({});
      const artifactId = 'abc132';

      // A list of libraries that has dependencies - used to check the parent library object is built correctly
      const externalCqlList = [
        {
          name: 'My Artifact',
          version: '1',
          details: {
            dependencies: [
              {
                version: '2',
                path: 'CDS_Connect_Conversions_New',
                localIdentifier: 'Convert'
              },
              {
                version: '2.0.0',
                path: 'CDS_Connect_Commons_New',
                localIdentifier: 'C3F'
              },
              {
                version: '2.0.1',
                path: 'FHIRHelpers_New',
                localIdentifier: 'FHIRHelpers'
              }
            ]
          }
        },
        {
          name: 'CDS_Connect_Conversions_New',
          version: '2',
          details: { dependencies: [] }
        },
        {
          name: 'CDS_Connect_Commons_New',
          version: '2.0.0',
          details: {
            dependencies: [
              {
                version: '2.0.1',
                path: 'FHIRHelpers_New',
                localIdentifier: 'FHIRHelpers'
              }
            ]
          }
        },
        {
          name: 'FHIRHelpers_New',
          version: '2.0.1',
          details: { dependencies: [] }
        }
      ];

      // Expected parent relationships based on dependencies defined above
      const expectedParentsOfLibraries = {
        'my-artifact-1': [],
        'cds-connect-conversions-new-2': ['my-artifact-1'],
        'cds-connect-commons-new-2.0.0': ['my-artifact-1'],
        'fhir-helpers-new-2.0.1': ['my-artifact-1', 'cds-connect-commons-new-2.0.0']
      };

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${artifactId}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      const expectedActions = [
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList, parentsOfLibraries: expectedParentsOfLibraries }
      ];

      // Confirm the parentsOfLibraries object is created correctly when the list is successfully loaded
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
      const library = { artifact: mockArtifact };
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        { name: 'My other artifact', version: '1', details: { dependencies: [] } }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      moxios.stubs.track({
        url: '/authoring/api/artifacts',
        method: 'PUT',
        response: { status: 200, response: mockArtifact }
      });

      moxios.stubs.track({
        url: /\/artifacts.*/, method: 'GET', response: { status: 200, response: [mockArtifact] }
      });

      moxios.stubs.track({
        url: '/authoring/api/externalCQL',
        method: 'POST',
        response: { status: 200, response: {} }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      moxios.stubs.track({
        url: `/authoring/api/artifacts/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: [mockArtifact] }
      });

      const expectedActions = [
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_SUCCESS, message: '' },
        //{ type: types.SAVE_ARTIFACT_REQUEST },
        //{ type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        //{ type: types.ARTIFACTS_REQUEST },
        //{ type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList, parentsOfLibraries },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        { type: types.LOAD_ARTIFACT_SUCCESS, artifact: mockArtifact, names: mockArtifactNames, librariesInUse: [] },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      return store.dispatch(actions.addExternalLibrary(library)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a ADD_EXTERNAL_CQL_LIBRARY_FAILURE action upon an unsuccessful add due to CQL-to-ELM errors', () => {
      const store = mockStore({});
      const badLibrary = { artifact: mockArtifact };
      const elmErrors = [{ startLine: 1 }, { startLine: 2 }];
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        { name: 'My other artifact', version: '1', details: { dependencies: [] } }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      moxios.stubs.track({
        url: '/authoring/api/artifacts',
        method: 'PUT',
        response: { status: 200, response: mockArtifact }
      });

      moxios.stubs.track({
        url: /\/artifacts.*/, method: 'GET', response: { status: 200, response: [mockArtifact] }
      });

      moxios.stubs.track({
        url: '/authoring/api/externalCQL',
        method: 'POST',
        response: { status: 400, statusText: 'Bad Request', response: elmErrors }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      moxios.stubs.track({
        url: `/authoring/api/artifacts/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: [mockArtifact] }
      });

      const expectedActions = [
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE, status: 400, statusText: '', data: elmErrors },
        /*{ type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },*/
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList, parentsOfLibraries },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        { type: types.LOAD_ARTIFACT_SUCCESS, artifact: mockArtifact, names: mockArtifactNames, librariesInUse: [] },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      return store.dispatch(actions.addExternalLibrary(badLibrary)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a ADD_EXTERNAL_CQL_LIBRARY_SUCCESS action upon an unsuccessful add due to duplicate library', () => {
      const store = mockStore({});
      const badLibrary = { artifact: mockArtifact };
      const dupLibraryText = 'Library with identical name and version already exists.';
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        { name: 'My other artifact', version: '1', details: { dependencies: [] } }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      moxios.stubs.track({
        url: '/authoring/api/artifacts',
        method: 'PUT',
        response: { status: 200, response: mockArtifact }
      });

      moxios.stubs.track({
        url: /\/artifacts.*/, method: 'GET', response: { status: 200, response: [mockArtifact] }
      });

      moxios.stubs.track({
        url: '/authoring/api/externalCQL',
        method: 'POST',
        response: { status: 200, statusText: 'OK', response: dupLibraryText }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      moxios.stubs.track({
        url: `/authoring/api/artifacts/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: [mockArtifact] }
      });

      const expectedActions = [
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_SUCCESS, message: dupLibraryText },
        /*{ type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },*/
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList, parentsOfLibraries },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        { type: types.LOAD_ARTIFACT_SUCCESS, artifact: mockArtifact, names: mockArtifactNames, librariesInUse: [] },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      return store.dispatch(actions.addExternalLibrary(badLibrary)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a ADD_EXTERNAL_CQL_LIBRARY_FAILURE action upon an unsuccessful add due to other errors', () => {
      // An other error could be that the cql-to-elm translator is down.
      const store = mockStore({});
      const badLibrary = { artifact: mockArtifact };
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        { name: 'My other artifact', version: '1', details: { dependencies: [] } }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      moxios.stubs.track({
        url: '/authoring/api/artifacts',
        method: 'PUT',
        response: { status: 200, response: mockArtifact }
      });

      moxios.stubs.track({
        url: /\/artifacts.*/, method: 'GET', response: { status: 200, response: [mockArtifact] }
      });

      moxios.stubs.track({
        url: '/authoring/api/externalCQL',
        method: 'POST',
        response: { status: 500, statusText: 'Internal Server Error' }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      moxios.stubs.track({
        url: `/authoring/api/artifacts/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: [mockArtifact] }
      });

      const expectedActions = [
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE, status: 500, statusText: '', data: [] },
        /*{ type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },*/
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList, parentsOfLibraries },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        { type: types.LOAD_ARTIFACT_SUCCESS, artifact: mockArtifact, names: mockArtifactNames, librariesInUse: [] },
        { type: types.SET_STATUS_MESSAGE, message: null }
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
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        { name: 'My other artifact', version: '1', details: { dependencies: [] } }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      moxios.stubs.track({
        url: '/authoring/api/artifacts',
        method: 'PUT',
        response: { status: 200, response: mockArtifact }
      });

      moxios.stubs.track({
        url: /\/artifacts.*/, method: 'GET', response: { status: 200, response: [mockArtifact] }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${libraryId}`,
        method: 'DELETE',
        response: { status: 200, response: {} }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      moxios.stubs.track({
        url: `/authoring/api/artifacts/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: [mockArtifact] }
      });

      const expectedActions = [
        { type: types.DELETE_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.DELETE_EXTERNAL_CQL_LIBRARY_SUCCESS },
        /*{ type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },*/
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList, parentsOfLibraries },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        { type: types.LOAD_ARTIFACT_SUCCESS, artifact: mockArtifact, names: mockArtifactNames, librariesInUse: [] },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      return store.dispatch(actions.deleteExternalCqlLibrary(libraryId, mockArtifact)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a DELETE_EXTERNAL_CQL_LIBRARY_FAILURE action upon failed delete', () => {
      const store = mockStore({});
      const libraryId = 'lib123';
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        { name: 'My other artifact', version: '1', details: { dependencies: [] } }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      moxios.stubs.track({
        url: '/authoring/api/artifacts',
        method: 'PUT',
        response: { status: 200, response: mockArtifact }
      });

      moxios.stubs.track({
        url: /\/artifacts.*/, method: 'GET', response: { status: 200, response: [mockArtifact] }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${libraryId}`,
        method: 'DELETE',
        response: { status: 404, statusText: 'Not found', response: {} }
      });

      moxios.stubs.track({
        url: `/authoring/api/externalCQL/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: externalCqlList }
      });

      moxios.stubs.track({
        url: `/authoring/api/artifacts/${mockArtifact._id}`,
        method: 'GET',
        response: { status: 200, response: [mockArtifact] }
      });

      const expectedActions = [
        { type: types.DELETE_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.DELETE_EXTERNAL_CQL_LIBRARY_FAILURE, status: 404, statusText: 'Not found' },
        /*{ type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },*/
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList, parentsOfLibraries },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        { type: types.LOAD_ARTIFACT_SUCCESS, artifact: mockArtifact, names: mockArtifactNames, librariesInUse: [] },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      return store.dispatch(actions.deleteExternalCqlLibrary(libraryId, mockArtifact)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
