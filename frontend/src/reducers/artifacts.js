import moment from 'moment';

import * as types from 'actions/types';

const defaultState = {
  artifacts: [],
  artifact: null,
  artifactSaved: true,
  downloadArtifact: {
    isDownloading: false,
    downloadStatus: null,
    isValidating: false,
    validateStatus: null,
    elmFiles: [],
    elmErrors: []
  },
  editArtifact: { isEditing: false, editStatus: null },
  librariesInUse: [],
  loadArtifact: { isLoading: false, loadStatus: null },
  loadArtifacts: { isLoading: false, loadStatus: null },
  names: [],
  saveArtifact: { isSaving: false, saveStatus: null },
  statusMessage: null
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
        artifact: state.artifact
          ? action.artifacts.find(loadedArtifact => loadedArtifact._id === state.artifact._id)
          : null,
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
    case types.CLEAR_ARTIFACT_VALIDATION_WARNINGS:
      return {
        ...state,
        downloadArtifact: { isDownloading: false, downloadStatus: null, elmFiles: [], elmErrors: [] }
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
    default:
      return state;
  }
}
