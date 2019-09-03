import moment from 'moment';

import * as types from '../actions/types';

const defaultState = {
  artifacts: [],
  artifact: null,
  names: [],
  statusMessage: null,
  loadArtifacts: { isLoading: false, loadStatus: null },
  loadArtifact: { isLoading: false, loadStatus: null },
  addArtifact: { isAdding: false, addStatus: null },
  editArtifact: { isEditing: false, editStatus: null },
  deleteArtifact: { isDeleting: false, deleteStatus: null },
  saveArtifact: { isSaving: false, saveStatus: null },
  publishArtifact: { isPublishing: false, publishStatus: null },
  downloadArtifact: {
    isDownloading: false,
    downloadStatus: null,
    isValidating: false,
    validateStatus: null,
    elmFiles: [],
    elmErrors: []
  },
  executeArtifact: {
    isExecuting: false,
    executeStatus: null,
    results: null,
    artifactExecuted: null,
    patientsExecuted: null,
    errorMessage: null
  },
  artifactSaved: true,
  publishEnabled: false,
  librariesInUse: []
};

export default function auth(state = defaultState, action) {
  switch (action.type) {
    case types.SET_STATUS_MESSAGE:
      return {
        ...state,
        statusMessage: action.message
      };
    case types.UPDATE_ARTIFACT:
      return {
        ...state,
        artifact: action.artifact,
        names: action.names,
        artifactSaved: false,
        librariesInUse: action.librariesInUse
      };
    case types.INITIALIZE_ARTIFACT:
      return {
        ...state,
        statusMessage: null,
        artifact: action.artifact
      };
    case types.ARTIFACTS_REQUEST:
      return {
        ...state,
        loadArtifacts: { isLoading: true, loadStatus: null }
      };
    case types.LOAD_ARTIFACTS_SUCCESS:
      return {
        ...state,
        artifacts: action.artifacts,
        loadArtifacts: { isLoading: false, loadStatus: 'success' }
      };
    case types.LOAD_ARTIFACTS_FAILURE:
      return {
        ...state,
        loadArtifacts: { isLoading: false, loadStatus: 'failure' }
      };
    case types.ARTIFACT_REQUEST:
      return {
        ...state,
        loadArtifact: { isLoading: true, loadStatus: null }
      };
    case types.LOAD_ARTIFACT_SUCCESS:
      return {
        ...state,
        artifact: action.artifact,
        names: action.names,
        librariesInUse: action.librariesInUse,
        loadArtifact: { isLoading: false, loadStatus: 'success' }
      };
    case types.LOAD_ARTIFACT_FAILURE:
      return {
        ...state,
        loadArtifact: { isLoading: false, loadStatus: 'failure' }
      };
    case types.ADD_ARTIFACT_REQUEST:
      return {
        ...state,
        addArtifact: { isAdding: true, addStatus: null }
      };
    case types.ADD_ARTIFACT_SUCCESS:
      return {
        ...state,
        addArtifact: { isAdding: false, addStatus: 'success' }
      };
    case types.ADD_ARTIFACT_FAILURE:
      return {
        ...state,
        addArtifact: { isAdding: false, addStatus: 'failure' }
      };
    case types.DOWNLOAD_ARTIFACT_REQUEST:
      return {
        ...state,
        statusMessage: null,
        downloadArtifact: { isDownloading: true, downloadStatus: null, elmErrors: [] }
      };
    case types.DOWNLOAD_ARTIFACT_SUCCESS: {
      const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
      return {
        ...state,
        statusMessage: `Downloaded ${time}.`,
        downloadArtifact: { isDownloading: false, downloadStatus: 'success', elmErrors: [] }
      };
    }
    case types.DOWNLOAD_ARTIFACT_FAILURE:
      return {
        ...state,
        statusMessage: `Download failed. ${action.statusText}.`,
        downloadArtifact: { isDownloading: false, downloadStatus: 'failure', elmErrors: [] }
      };
    case types.VALIDATE_ARTIFACT_REQUEST:
      return {
        ...state,
        downloadArtifact: { isValidating: true, validateStatus: null, elmFiles: [], elmErrors: [] }
      };
    case types.VALIDATE_ARTIFACT_SUCCESS:
      return {
        ...state,
        downloadArtifact: {
          isValidating: false,
          validateStatus: 'success',
          elmFiles: action.data.elmFiles,
          elmErrors: action.data.elmErrors
        }
      };
    case types.VALIDATE_ARTIFACT_FAILURE:
      return {
        ...state,
        downloadArtifact: { isValidating: false, validateStatus: 'failure', elmFiles: [], elmErrors: [] }
      };
    case types.EXECUTE_ARTIFACT_REQUEST:
      return {
        ...state,
        executeArtifact: {
          isExecuting: true,
          executeStatus: null,
          results: null,
          artifactExecuted: null,
          patientsExecuted: null
        }
      };
    case types.EXECUTE_ARTIFACT_SUCCESS:
      return {
        ...state,
        executeArtifact: {
          isExecuting: false,
          executeStatus: 'success',
          results: action.data,
          artifactExecuted: action.artifact,
          patientsExecuted: action.patients,
          errorMessage: null
        }
      };
    case types.EXECUTE_ARTIFACT_FAILURE:
      return {
        ...state,
        executeArtifact: {
          isExecuting: false,
          executeStatus: 'failure',
          errorMessage: `Execute failed. ${action.statusText}.`
        }
      };
    case types.CLEAR_ARTIFACT_VALIDATION_WARNINGS:
      return {
        ...state,
        downloadArtifact: { isDownloading: false, downloadStatus: null, elmFiles: [], elmErrors: [] }
      };
    case types.CLEAR_EXECUTION_RESULTS:
      return {
        ...state,
        executeArtifact: {
          isExecuting: false,
          executeStatus: null,
          results: null,
          artifactExecuted: null,
          patientsExecuted: null,
          errorMessage: null
        }
      };
    case types.PUBLISH_ARTIFACT_REQUEST:
      return {
        ...state,
        statusMessage: null,
        publishArtifact: { isPublishing: true, publishStatus: null }
      };
    case types.PUBLISH_ARTIFACT_SUCCESS: {
      const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
      return {
        ...state,
        statusMessage: `Published ${time}.`,
        publishArtifact: { isPublishing: false, publishStatus: 'success' }
      };
    }
    case types.PUBLISH_ARTIFACT_FAILURE:
      return {
        ...state,
        statusMessage: `Publish failed. ${action.statusText}.`,
        publishArtifact: { isPublishing: false, publishStatus: 'failure' }
      };
    case types.UPDATE_PUBLISH_ENABLED:
      return {
        ...state,
        publishEnabled: action.bool
      };
    case types.SAVE_ARTIFACT_REQUEST:
      return {
        ...state,
        statusMessage: null,
        artifactSaved: false,
        saveArtifact: { isSaving: true, saveStatus: null }
      };
    case types.SAVE_ARTIFACT_SUCCESS: {
      const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
      return {
        ...state,
        artifact: action.artifact,
        statusMessage: `Last saved ${time}.`,
        artifactSaved: true,
        saveArtifact: { isSaving: false, saveStatus: 'success' }
      };
    }
    case types.SAVE_ARTIFACT_FAILURE:
      return {
        ...state,
        statusMessage: `Save failed. ${action.statusText}.`,
        saveArtifact: { isSaving: false, saveStatus: 'failure' }
      };
    case types.DELETE_ARTIFACT_REQUEST:
      return {
        ...state,
        statusMessage: null,
        deleteArtifact: { isDeleting: true, deleteStatus: null }
      };
    case types.DELETE_ARTIFACT_SUCCESS: {
      const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
      return {
        ...state,
        statusMessage: `Deleted ${time}.`,
        deleteArtifact: { isDeleting: false, deleteStatus: 'success' }
      };
    }
    case types.DELETE_ARTIFACT_FAILURE:
      return {
        ...state,
        statusMessage: `Delete failed. ${action.statusText}.`,
        deleteArtifact: { isDeleting: false, deleteStatus: 'failure' }
      };
    default:
      return state;
  }
}
