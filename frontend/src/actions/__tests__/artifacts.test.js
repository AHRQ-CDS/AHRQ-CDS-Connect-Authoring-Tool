import _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import moment from 'moment';
import FileSaver from 'file-saver';

import * as actions from '../artifacts';
import * as types from '../types';
import mockArtifact from 'mocks/mockArtifact';
import mockPatientDstu2 from 'mocks/mockPatientDstu2';
import mockPatientStu3 from 'mocks/mockPatientStu3';
import mockPatientR4 from 'mocks/mockPatientR4';
import mockElmFilesDstu2 from 'mocks/mockElmFilesDstu2.json';
import mockElmFilesStu3 from 'mocks/mockElmFilesStu3.json';
import mockElmFilesR4 from 'mocks/mockElmFilesR4.json';
import mockTestResultsDstu2 from 'mocks/mockTestResultsDstu2';
import mockTestResultsStu3 from 'mocks/mockTestResultsStu3.json';
import mockTestResultsR4 from 'mocks/mockTestResultsR4.json';

import CodeService from 'utils/code_service/CodeService';

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
      const mockArtifactWithoutId = _.cloneDeep(mockArtifact);
      mockArtifactWithoutId._id = null;

      const andTemplate = { id: 'And', name: 'And', conjunction: true, returnType: 'boolean', fields: [] };
      const orTemplate = { id: 'Or', name: 'Or', conjunction: true, returnType: 'boolean', fields: [] };
      const expectedAction = {
        type: types.INITIALIZE_ARTIFACT,
        artifact: {
          ...mockArtifactWithoutId,
          expTreeInclude: {
            ...mockArtifactWithoutId.expTreeInclude,
            fields: []
          },
          expTreeExclude: {
            ...mockArtifactWithoutId.expTreeExclude,
            fields: []
          }
        }
      };

      expect(actions.initializeArtifact(andTemplate, orTemplate)).toEqual(expectedAction);
    });
  });

  // ----------------------- LOAD ARTIFACTS -------------------------------- //
  describe('load artifacts', () => {
    it('creates LOAD_ARTIFACTS_SUCCESS after successfully loading artifacts', () => {
      nock('http://localhost')
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact]);

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

      nock('http://localhost')
        .get(`/authoring/api/artifacts/${id}`)
        .reply(200, [mockArtifact]);

      return store.dispatch(actions.loadArtifact(id)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- DOWNLOAD ARTIFACT ----------------------------- //
  describe('download artifact', () => {
    it('creates DOWNLOAD_ARTIFACT_SUCCESS after successfully downloading an artifact', () => {
      nock('http://localhost')
        .post('/authoring/api/cql')
        .reply(200, [])
        .post('/authoring/api/cql/validate')
        .reply(200, {});

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
    it('creates EXECUTE_ARTIFACT_SUCCESS after successfully executing an artifact for DSTU2', () => {
      nock('http://localhost')
        .post('/authoring/api/cql/validate')
        .reply(200, { elmFiles: mockElmFilesDstu2.elmFiles });

      const store = mockStore({ artifacts: [mockArtifact], patients: [mockPatientDstu2] });
      const expectedActions = [
        { type: types.EXECUTE_ARTIFACT_REQUEST },
        { type: types.VALIDATE_ARTIFACT_SUCCESS, data: { elmFiles: mockElmFilesDstu2.elmFiles } },
        {
          type: types.EXECUTE_ARTIFACT_SUCCESS,
          artifact: mockArtifact,
          patients: [mockPatientDstu2.patient],
          data: mockTestResultsDstu2.data
        }
      ];

      // If for some reason the mock ELM files or the mock patients ever need to be changed,
      // the mock test results will need to be changed to match them
      return store.dispatch(actions.executeCQLArtifact(
        mockArtifact,
        [], // params
        [mockPatientDstu2.patient],
        'apiKey',
        new CodeService(),
        { name: 'FHIR', version: '1.0.2' }
      )).then(() => {
        expect(_.initial(store.getActions())).toEqual(_.initial(expectedActions));
        expect(_.last(store.getActions()).type).toEqual(_.last(expectedActions).type);
        expect(_.last(store.getActions()).artifact).toEqual(_.last(expectedActions).artifact);
        expect(_.last(store.getActions()).patients).toEqual(_.last(expectedActions).patients);
        expect(JSON.parse(JSON.stringify(_.last(store.getActions()).data))).toEqual(_.last(expectedActions).data);
      });
    });

    it('creates EXECUTE_ARTIFACT_SUCCESS after successfully executing an artifact for STU3', () => {
      nock('http://localhost')
        .post('/authoring/api/cql/validate')
        .reply(200, { elmFiles: mockElmFilesStu3.elmFiles });

      const store = mockStore({ artifacts: [mockArtifact], patients: [mockPatientStu3] });
      const expectedActions = [
        { type: types.EXECUTE_ARTIFACT_REQUEST },
        { type: types.VALIDATE_ARTIFACT_SUCCESS, data: { elmFiles: mockElmFilesStu3.elmFiles } },
        {
          type: types.EXECUTE_ARTIFACT_SUCCESS,
          artifact: mockArtifact,
          patients: [mockPatientStu3.patient],
          data: mockTestResultsStu3.data
        }
      ];

      // If for some reason the mock ELM files or the mock patients ever need to be changed,
      // the mock test results will need to be changed to match them
      return store.dispatch(actions.executeCQLArtifact(
        mockArtifact,
        [], // params
        [mockPatientStu3.patient],
        'apiKey',
        new CodeService(),
        { name: 'FHIR', version: '3.0.0' }
      )).then(() => {
        expect(_.initial(store.getActions())).toEqual(_.initial(expectedActions));
        expect(_.last(store.getActions()).type).toEqual(_.last(expectedActions).type);
        expect(_.last(store.getActions()).artifact).toEqual(_.last(expectedActions).artifact);
        expect(_.last(store.getActions()).patients).toEqual(_.last(expectedActions).patients);
        expect(JSON.parse(JSON.stringify(_.last(store.getActions()).data))).toEqual(_.last(expectedActions).data);
      });
    });

    it('creates EXECUTE_ARTIFACT_SUCCESS after successfully executing an artifact for R4', () => {
      nock('http://localhost')
        .post('/authoring/api/cql/validate')
        .reply(200, { elmFiles: mockElmFilesR4.elmFiles });

      const store = mockStore({ artifacts: [mockArtifact], patients: [mockPatientR4] });
      const expectedActions = [
        { type: types.EXECUTE_ARTIFACT_REQUEST },
        { type: types.VALIDATE_ARTIFACT_SUCCESS, data: { elmFiles: mockElmFilesR4.elmFiles } },
        {
          type: types.EXECUTE_ARTIFACT_SUCCESS,
          artifact: mockArtifact,
          patients: [mockPatientR4.patient],
          data: mockTestResultsR4.data
        }
      ];

      // If for some reason the mock ELM files or the mock patients ever need to be changed,
      // the mock test results will need to be changed to match them
      return store.dispatch(actions.executeCQLArtifact(
        mockArtifact,
        [], // params
        [mockPatientR4.patient],
        'apiKey',
        new CodeService(),
        { name: 'FHIR', version: '4.0.0' }
      )).then(() => {
        expect(_.initial(store.getActions())).toEqual(_.initial(expectedActions));
        expect(_.last(store.getActions()).type).toEqual(_.last(expectedActions).type);
        expect(_.last(store.getActions()).artifact).toEqual(_.last(expectedActions).artifact);
        expect(_.last(store.getActions()).patients).toEqual(_.last(expectedActions).patients);
        expect(JSON.parse(JSON.stringify(_.last(store.getActions()).data))).toEqual(_.last(expectedActions).data);
      });
    });
  });

  // ----------------------- SAVE ARTIFACT --------------------------------- //
  describe('save artifact', () => {
    it('makes a POST request to save a new artifact', () => {
      const mockArtifactWithoutId = _.cloneDeep(mockArtifact);
      mockArtifactWithoutId._id = null;

      nock('http://localhost')
        .post('/authoring/api/artifacts')
        .reply(200, mockArtifactWithoutId)
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact]);

      const store = mockStore({});
      const expectedActions = [
        { type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifactWithoutId },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] }
      ];

      return store.dispatch(actions.saveArtifact(mockArtifactWithoutId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('makes a PUT request to update an existing artifact', () => {
      nock('http://localhost')
        .put('/authoring/api/artifacts')
        .reply(200, {})
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact]);

      const store = mockStore({});
      const expectedActions = [
        { type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] }
      ];

      return store.dispatch(actions.saveArtifact(mockArtifact)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
