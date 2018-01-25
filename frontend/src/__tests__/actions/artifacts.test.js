import _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import moment from 'moment';

import * as actions from '../../actions/artifacts';
import * as types from '../../actions/types';
import mockArtifact from '../../mocks/mockArtifact';
import mockTemplates from '../../mocks/mockTemplates';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('artifact actions', () => {
  // ----------------------- SET STATUS MESSAGE ---------------------------- //
  describe('status message', () => {
    it('should create an action to set a status message', () => {
      const statusType = 'save';
      const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
      const message = `Saved ${time}.`;

      const expectedAction = {
        type: types.SET_STATUS_MESSAGE,
        message
      };

      expect(actions.setStatusMessage(statusType)).toEqual(expectedAction);
    });
  });

  // ----------------------- UPDATE ARTIFACT ------------------------------- //
  describe('update artifact', () => {
    it('should create an action to update an artifact', () => {
      const artifactToUpdate = { id: 1 };
      const props = { id: 2 };
      const artifact = { id: 2 };

      const expectedAction = {
        type: types.UPDATE_ARTIFACT,
        artifact
      };

      actions.updateArtifact(artifactToUpdate, props)((response) => {
        expect(response).toEqual(expectedAction);
      });
    });
  });

  // ----------------------- INITIALIZE ARTIFACT --------------------------- //
  describe('initialize artifact', () => {
    it('should create an action to initialize an artifact', () => {
      const andTemplate = { id: 'And', name: 'And', conjunction: true, returnType: 'boolean', parameters: [] };
      const expectedAction = {
        type: types.INITIALIZE_ARTIFACT,
        artifact: mockArtifact
      };

      expect(actions.initializeArtifact(andTemplate)).toEqual(expectedAction);
    });
  });

  // ----------------------- LOAD ARTIFACTS -------------------------------- //
  describe('load artifacts', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('creates LOAD_ARTIFACTS_SUCCESS after successfully loading artifacts', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200, response: [mockArtifact], });
      });

      const store = mockStore({ artifacts: [] });
      const expectedActions = [
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] }
      ];

      return store.dispatch(actions.loadArtifacts()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- LOAD ARTIFACT -------------------------------- //
  describe('load artifact', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('creates LOAD_ARTIFACT_SUCCESS after successfully loading an artifact', () => {
      const id = '1';
      const store = mockStore({ artifacts: [] });
      const expectedActions = [
        { type: types.ARTIFACT_REQUEST, id },
        { type: types.LOAD_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      moxios.stubs.track({
        url: `/authoring/api/artifacts/${id}`,
        method: 'GET',
        response: { status: 200, response: [mockArtifact] }
      });

      return store.dispatch(actions.loadArtifact(id)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- ADD ARTIFACT ---------------------------------- //
  describe('add artifact', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('creates ADD_ARTIFACT_SUCCESS after successfully adding an artifact', () => {
      moxios.stubRequest('/authoring/api/config/templates', {
        status: 200, response: mockTemplates
      });
      moxios.stubs.track({
        url: '/authoring/api/artifacts', method: 'POST', response: { status: 200, response: {} }
      });
      moxios.stubs.track({
        url: /\/artifacts.*/, method: 'GET', response: { status: 200, response: [mockArtifact] }
      });

      const store = mockStore({ artifacts: { artifact: {} } });
      const expectedActions = [
        { type: types.ADD_ARTIFACT_REQUEST },
        { type: types.TEMPLATES_REQUEST },
        { type: types.LOAD_TEMPLATES_SUCCESS, templates: mockTemplates },
        { type: types.INITIALIZE_ARTIFACT, artifact: mockArtifact },
        { type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: {} },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },
        { type: types.ADD_ARTIFACT_SUCCESS }
      ];

      return store.dispatch(actions.addArtifact(mockArtifact)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- DOWNLOAD ARTIFACT ----------------------------- //
  describe('download artifact', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('creates DOWNLOAD_ARTIFACT_SUCCESS after successfully downloading an artifact', () => {
      moxios.stubs.track({ url: '/authoring/api/cql', method: 'POST', response: { status: 200, response: [] } });

      const store = mockStore({ artifacts: [mockArtifact] });
      const expectedActions = [
        { type: types.DOWNLOAD_ARTIFACT_REQUEST },
        { type: types.DOWNLOAD_ARTIFACT_SUCCESS }
      ];

      moxios.wait(() => {
        store.dispatch(actions.downloadArtifact(mockArtifact)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });

  // ----------------------- PUBLISH ARTIFACT ------------------------------ //
  describe('publish artifact', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('creates PUBLISH_ARTIFACT_SUCCESS after successfully publishing an artifact', () => {
      const store = mockStore({ artifacts: [] });
      const expectedActions = [
        { type: types.PUBLISH_ARTIFACT_REQUEST },
        { type: types.PUBLISH_ARTIFACT_SUCCESS, artifact: {} }
      ];

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200, response: {} });
      });

      return store.dispatch(actions.publishArtifact(mockArtifact)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- SAVE ARTIFACT --------------------------------- //
  describe('save artifact', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('makes a POST request to save a new artifact', () => {
      const mockArtifactWithId = _.cloneDeep(mockArtifact);
      mockArtifactWithId._id = '1234abcd';

      moxios.stubs.track({
        url: '/authoring/api/artifacts', method: 'POST', response: { status: 200, response: mockArtifact }
      });
      moxios.stubs.track({
        url: /\/artifacts.*/, method: 'GET', response: { status: 200, response: [mockArtifactWithId] }
      });

      const store = mockStore({});
      const expectedActions = [
        { type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifactWithId] }
      ];

      return store.dispatch(actions.saveArtifact(mockArtifact)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('makes a PUT request to update an existing artifact', () => {
      const mockArtifactWithId = _.cloneDeep(mockArtifact);
      mockArtifactWithId._id = '1234abcd';

      moxios.stubs.track({
        url: '/authoring/api/artifacts', method: 'PUT', response: { status: 200, response: {} }
      });
      moxios.stubs.track({
        url: /\/artifacts.*/, method: 'GET', response: { status: 200, response: [mockArtifactWithId] }
      });

      const store = mockStore({});
      const expectedActions = [
        { type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifactWithId },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifactWithId] }
      ];

      return store.dispatch(actions.saveArtifact(mockArtifactWithId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- DELETE ARTIFACT ------------------------------- //
  describe('delete artifact', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('makes a DELETE request to delete an artifact', () => {
      const mockArtifactWithId = _.cloneDeep(mockArtifact);
      mockArtifactWithId._id = '1234abcd';

      moxios.stubs.track({
        url: `/authoring/api/artifacts/${mockArtifactWithId._id}`,
        method: 'DELETE',
        response: { status: 200, response: {} }
      });
      moxios.stubs.track({
        url: /\/artifacts.*/, method: 'GET', response: { status: 200, response: [] }
      });

      const store = mockStore({});
      const expectedActions = [
        { type: types.DELETE_ARTIFACT_REQUEST },
        { type: types.DELETE_ARTIFACT_SUCCESS, artifact: mockArtifactWithId },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [] }
      ];

      return store.dispatch(actions.deleteArtifact(mockArtifactWithId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
