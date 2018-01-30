import moment from 'moment';

import * as types from '../actions/types';

const defaultState = {
  artifacts: [],
  artifact: null,
  statusMessage: null,
  loadArtifacts: { isLoading: false, loadStatus: null },
  loadArtifact: { isLoading: false, loadStatus: null },
  addArtifact: { isAdding: false, addStatus: null },
  editArtifact: { isEditing: false, editStatus: null },
  deleteArtifact: { isDeleting: false, deleteStatus: null },
  saveArtifact: { isSaving: false, saveStatus: null },
  publishArtifact: { isPublishing: false, publishStatus: null },
  publishEnabled: false
};

const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');

export default function auth(state = defaultState, action) {
  switch (action.type) {
    case types.SET_STATUS_MESSAGE:
      return Object.assign({}, state, { statusMessage: action.message });
    case types.UPDATE_ARTIFACT:
      return Object.assign({}, state, { artifact: action.artifact });
    case types.INITIALIZE_ARTIFACT:
      return Object.assign({}, state, {
        statusMessage: null,
        artifact: action.artifact
      });
    case types.ARTIFACTS_REQUEST:
      return Object.assign({}, state, { loadArtifacts: { isLoading: true, loadStatus: null } });
    case types.LOAD_ARTIFACTS_SUCCESS:
      return Object.assign({}, state, {
        artifacts: action.artifacts,
        loadArtifacts: { isLoading: false, loadStatus: 'success' }
      });
    case types.LOAD_ARTIFACTS_FAILURE:
      return Object.assign({}, state, { loadArtifacts: { isLoading: false, loadStatus: 'failure' } });
    case types.ARTIFACT_REQUEST:
      return Object.assign({}, state, { loadArtifact: { isLoading: true, loadStatus: null } });
    case types.LOAD_ARTIFACT_SUCCESS:
      return Object.assign({}, state, {
        artifact: action.artifact,
        loadArtifact: { isLoading: false, loadStatus: 'success' }
      });
    case types.LOAD_ARTIFACT_FAILURE:
      return Object.assign({}, state, { loadArtifact: { isLoading: false, loadStatus: 'failure' } });
    case types.ADD_ARTIFACT_REQUEST:
      return Object.assign({}, state, { addArtifact: { isAdding: true, addStatus: null } });
    case types.ADD_ARTIFACT_SUCCESS:
      return Object.assign({}, state, { addArtifact: { isAdding: false, addStatus: 'success' } });
    case types.ADD_ARTIFACT_FAILURE:
      return Object.assign({}, state, { addArtifact: { isAdding: false, addStatus: 'failure' } });
    case types.DELETE_ARTIFACT_REQUEST:
      return Object.assign({}, state, {
        statusMessage: null,
        deleteArtifact: { isDeleting: true, deleteStatus: null }
      });
    case types.DELETE_ARTIFACT_SUCCESS:
      return Object.assign({}, state, {
        statusMessage: `Deleted ${time}.`,
        deleteArtifact: { isDeleting: false, deleteStatus: 'success' }
      });
    case types.DELETE_ARTIFACT_FAILURE:
      return Object.assign({}, state, {
        statusMessage: `Delete failed. ${action.statusText}.`,
        deleteArtifact: { isDeleting: false, deleteStatus: 'failure' }
      });
    case types.DOWNLOAD_ARTIFACT_REQUEST:
      return Object.assign({}, state, {
        statusMessage: null,
        downloadArtifact: { isDownloading: true, downloadStatus: null }
      });
    case types.DOWNLOAD_ARTIFACT_SUCCESS:
      return Object.assign({}, state, {
        statusMessage: `Downloaded ${time}.`,
        downloadArtifact: { isDownloading: false, downloadStatus: 'success' }
      });
    case types.DOWNLOAD_ARTIFACT_FAILURE:
      return Object.assign({}, state, {
        statusMessage: `Download failed. ${action.statusText}.`,
        downloadArtifact: { isDownloading: false, downloadStatus: 'failure' }
      });
    case types.SAVE_ARTIFACT_REQUEST:
      return Object.assign({}, state, {
        statusMessage: null,
        saveArtifact: { isSaving: true, saveStatus: null }
      });
    case types.SAVE_ARTIFACT_SUCCESS:
      return Object.assign({}, state, {
        artifact: action.artifact,
        statusMessage: `Last saved ${time}.`,
        saveArtifact: { isSaving: false, saveStatus: 'success' }
      });
    case types.SAVE_ARTIFACT_FAILURE:
      return Object.assign({}, state, {
        statusMessage: `Save failed. ${action.statusText}.`,
        saveArtifact: { isSaving: false, saveStatus: 'failure' }
      });
    case types.PUBLISH_ARTIFACT_REQUEST:
      return Object.assign({}, state, {
        statusMessage: null,
        publishArtifact: { isPublishing: true, publishStatus: null }
      });
    case types.PUBLISH_ARTIFACT_SUCCESS:
      return Object.assign({}, state, {
        statusMessage: `Published ${time}.`,
        publishArtifact: { isPublishing: false, publishStatus: 'success' }
      });
    case types.PUBLISH_ARTIFACT_FAILURE:
      return Object.assign({}, state, {
        statusMessage: `Publish failed. ${action.statusText}.`,
        publishArtifact: { isPublishing: false, publishStatus: 'failure' }
      });
    case types.PUBLISH_ARTIFACT_ENABLED_REQUEST:
      return Object.assign({}, state);
    case types.PUBLISH_ARTIFACT_ENABLED_SUCCESS:
      return Object.assign({}, state, {
        publishEnabled: action.active
      });
    case types.PUBLISH_ARTIFACT_ENABLED_FAILURE:
      return Object.assign({}, state, {
        publishEnabled: false
      });
    default:
      return state;
  }
}
