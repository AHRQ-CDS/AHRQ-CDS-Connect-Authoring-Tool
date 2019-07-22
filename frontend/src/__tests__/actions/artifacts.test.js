import _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import moment from 'moment';
import FileSaver from 'file-saver';

import * as actions from '../../actions/artifacts';
import * as types from '../../actions/types';
import mockArtifact from '../../mocks/mockArtifact';
import mockTemplates from '../../mocks/mockTemplates';
import mockPatientDstu2 from '../../mocks/mockPatientDstu2';
import mockPatientStu3 from '../../mocks/mockPatientStu3';
import mockElmFilesDstu2 from '../../mocks/mockElmFilesDstu2.json';
import mockElmFilesStu3 from '../../mocks/mockElmFilesStu3.json';
import mockTestResultsDstu2 from '../../mocks/mockTestResultsDstu2.json';
import mockTestResultsStu3 from '../../mocks/mockTestResultsStu3.json';

import CodeService from '../../utils/code_service/CodeService';

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
      const artifactToUpdate = mockArtifact;
      const props = { id: 2 };
      const artifact = { ...mockArtifact, id: 2 };
      const names = [ // Names used in mockArtifact
        { name: 'Doesn\'t Meet Inclusion Criteria', id: 'default-subpopulation-1' },
        { name: 'Meets Exclusion Criteria', id: 'default-subpopulation-2' },
        { name: 'Subpopulation 1', id: 'And-TEST-1' }
      ];
      const librariesInUse = [];

      const expectedAction = {
        type: types.UPDATE_ARTIFACT,
        artifact,
        names,
        librariesInUse
      };

      actions.updateArtifact(artifactToUpdate, props)((response) => {
        expect(response).toEqual(expectedAction);
      });
    });
  });

  // ----------------------- INITIALIZE ARTIFACT --------------------------- //
  describe('initialize artifact', () => {
    it('should create an action to initialize an artifact', () => {
      const andTemplate = { id: 'And', name: 'And', conjunction: true, returnType: 'boolean', fields: [] };
      const orTemplate = { id: 'Or', name: 'Or', conjunction: true, returnType: 'boolean', fields: [] };
      const expectedAction = {
        type: types.INITIALIZE_ARTIFACT,
        artifact: mockArtifact
      };

      expect(actions.initializeArtifact(andTemplate, orTemplate)).toEqual(expectedAction);
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
      const names = [ // Names used in mockArtifact
        { name: 'Doesn\'t Meet Inclusion Criteria', id: 'default-subpopulation-1' },
        { name: 'Meets Exclusion Criteria', id: 'default-subpopulation-2' },
        { name: 'Subpopulation 1', id: 'And-TEST-1' }
      ];
      const librariesInUse = [];

      const expectedActions = [
        { type: types.ARTIFACT_REQUEST, id },
        { type: types.LOAD_ARTIFACT_SUCCESS, artifact: mockArtifact, names, librariesInUse },
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
      FileSaver.saveAs = jest.fn();

      const store = mockStore({ artifacts: [mockArtifact] });
      const expectedActions = [
        { type: types.DOWNLOAD_ARTIFACT_REQUEST },
        { type: types.DOWNLOAD_ARTIFACT_SUCCESS }
      ];

      return store.dispatch(actions.downloadArtifact(mockArtifact)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- EXECUTE ARTIFACT ------------------------------ //
  describe('execute artifact', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('creates EXECUTE_ARTIFACT_SUCCESS after successfully executing an artifact for DSTU2', () => {
      moxios.stubs.track({
        url: '/authoring/api/cql/validate',
        method: 'POST',
        response: { status: 200, response: { elmFiles: mockElmFilesDstu2.elmFiles } }
      });

      const store = mockStore({ artifacts: [mockArtifact], patients: [mockPatientDstu2] });
      const expectedActions = [
        { type: types.EXECUTE_ARTIFACT_REQUEST },
        { type: types.VALIDATE_ARTIFACT_SUCCESS, data: { elmFiles: mockElmFilesDstu2.elmFiles } },
        {
          type: types.EXECUTE_ARTIFACT_SUCCESS,
          artifact: mockArtifact,
          patient: mockPatientDstu2.patient,
          data: mockTestResultsDstu2.data
        }
      ];

      // If for some reason the mock ELM files or the mock patients ever need to be changed,
      // the mock test results will need to be changed to match them
      return store.dispatch(actions.executeCQLArtifact(
        mockArtifact,
        [], // params
        [mockPatientDstu2.patient],
        { username: 'u', password: 'p' },
        new CodeService(),
        { name: 'FHIR', version: '1.0.2' }
      )).then(() => {
        expect(_.initial(store.getActions())).toEqual(_.initial(expectedActions));
        expect(_.last(store.getActions()).type).toEqual(_.last(expectedActions).type);
        expect(_.last(store.getActions()).artifact).toEqual(_.last(expectedActions).artifact);
        expect(_.last(store.getActions()).patient).toEqual(_.last(expectedActions).patient);
        expect(JSON.parse(JSON.stringify(_.last(store.getActions()).data))).toEqual(_.last(expectedActions).data);
      });
    });

    it('creates EXECUTE_ARTIFACT_SUCCESS after successfully executing an artifact for STU3', () => {
      moxios.stubs.track({
        url: '/authoring/api/cql/validate',
        method: 'POST',
        response: { status: 200, response: { elmFiles: mockElmFilesStu3.elmFiles } }
      });

      const store = mockStore({ artifacts: [mockArtifact], patients: [mockPatientStu3] });
      const expectedActions = [
        { type: types.EXECUTE_ARTIFACT_REQUEST },
        { type: types.VALIDATE_ARTIFACT_SUCCESS, data: { elmFiles: mockElmFilesStu3.elmFiles } },
        {
          type: types.EXECUTE_ARTIFACT_SUCCESS,
          artifact: mockArtifact,
          patient: mockPatientStu3.patient,
          data: mockTestResultsStu3.data
        }
      ];

      // If for some reason the mock ELM files or the mock patients ever need to be changed,
      // the mock test results will need to be changed to match them
      return store.dispatch(actions.executeCQLArtifact(
        mockArtifact,
        [], // params
        [mockPatientStu3.patient],
        { username: 'u', password: 'p' },
        new CodeService(),
        { name: 'FHIR', version: '3.0.0' }
      )).then(() => {
        expect(_.initial(store.getActions())).toEqual(_.initial(expectedActions));
        expect(_.last(store.getActions()).type).toEqual(_.last(expectedActions).type);
        expect(_.last(store.getActions()).artifact).toEqual(_.last(expectedActions).artifact);
        expect(_.last(store.getActions()).patient).toEqual(_.last(expectedActions).patient);
        expect(JSON.parse(JSON.stringify(_.last(store.getActions()).data))).toEqual(_.last(expectedActions).data);
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
        { type: types.PUBLISH_ARTIFACT_SUCCESS, active: false }
      ];

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200, response: { active: false } });
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
