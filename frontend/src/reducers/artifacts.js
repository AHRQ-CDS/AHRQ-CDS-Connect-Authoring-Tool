import moment from 'moment';

import {
  SET_STATUS_MESSAGE, UPDATE_ARTIFACT, INITIALIZE_ARTIFACT,
  ARTIFACTS_REQUEST, LOAD_ARTIFACTS_SUCCESS, LOAD_ARTIFACTS_FAILURE,
  ARTIFACT_REQUEST, LOAD_ARTIFACT_SUCCESS, LOAD_ARTIFACT_FAILURE,
  ADD_ARTIFACT_REQUEST, ADD_ARTIFACT_SUCCESS, ADD_ARTIFACT_FAILURE,
  EDIT_ARTIFACT_REQUEST, EDIT_ARTIFACT_SUCCESS, EDIT_ARTIFACT_FAILURE,
  DELETE_ARTIFACT_REQUEST, DELETE_ARTIFACT_SUCCESS, DELETE_ARTIFACT_FAILURE,
  DOWNLOAD_ARTIFACT_REQUEST, DOWNLOAD_ARTIFACT_SUCCESS, DOWNLOAD_ARTIFACT_FAILURE,
  SAVE_ARTIFACT_REQUEST, SAVE_ARTIFACT_SUCCESS, SAVE_ARTIFACT_FAILURE,
  PUBLISH_ARTIFACT_REQUEST, PUBLISH_ARTIFACT_SUCCESS, PUBLISH_ARTIFACT_FAILURE
} from '../actions/types';

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
  publishArtifact: { isPublishing: false, publishStatus: null }
};

const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');

export default function auth(state = defaultState, action) {
  switch (action.type) {
    case SET_STATUS_MESSAGE:
      return Object.assign({}, state, { statusMessage: action.message });
    case UPDATE_ARTIFACT:
      return Object.assign({}, state, { artifact: action.artifact });
    case INITIALIZE_ARTIFACT:
      return Object.assign({}, state, { artifact: action.artifact });
    case ARTIFACTS_REQUEST:
      return Object.assign({}, state, { loadArtifacts: { isLoading: true, loadStatus: null } });
    case LOAD_ARTIFACTS_SUCCESS:
      return Object.assign({}, state, {
        artifacts: action.artifacts,
        statusMessage: null,
        loadArtifacts: { isLoading: false, loadStatus: 'success' }
      });
    case LOAD_ARTIFACTS_FAILURE:
      return Object.assign({}, state, { loadArtifacts: { isLoading: false, loadStatus: 'failure' } });
    case ARTIFACT_REQUEST:
      return Object.assign({}, state, { loadArtifact: { isLoading: true, loadStatus: null } });
    case LOAD_ARTIFACT_SUCCESS:
      return Object.assign({}, state, {
        artifact: action.artifact,
        loadArtifact: { isLoading: false, loadStatus: 'success' }
      });
    case LOAD_ARTIFACT_FAILURE:
      return Object.assign({}, state, { loadArtifact: { isLoading: false, loadStatus: 'failure' } });
    case ADD_ARTIFACT_REQUEST:
      return Object.assign({}, state, { addArtifact: { isAdding: true, addStatus: null } });
    case ADD_ARTIFACT_SUCCESS:
      return Object.assign({}, state, { addArtifact: { isAdding: false, addStatus: 'success' } });
    case ADD_ARTIFACT_FAILURE:
      return Object.assign({}, state, { addArtifact: { isAdding: false, addStatus: 'failure' } });
    case EDIT_ARTIFACT_REQUEST:
      return Object.assign({}, state, {
        statusMessage: null,
        editArtifact: { isEditing: true, editStatus: null }
      });
    case EDIT_ARTIFACT_SUCCESS:
      return Object.assign({}, state, {
        artifact: action.artifact,
        statusMessage: `Last saved ${time}.`,
        editArtifact: { isEditing: false, editStatus: 'success' }
      });
    case EDIT_ARTIFACT_FAILURE:
      return Object.assign({}, state, {
        statusMessage: `Edit failed. ${action.statusText}.`,
        editArtifact: { isEditing: false, editStatus: 'failure' }
      });
    case DELETE_ARTIFACT_REQUEST:
      return Object.assign({}, state, {
        statusMessage: null,
        deleteArtifact: { isDeleting: true, deleteStatus: null }
      });
    case DELETE_ARTIFACT_SUCCESS:
      return Object.assign({}, state, {
        statusMessage: `Deleted ${time}.`,
        deleteArtifact: { isDeleting: false, deleteStatus: 'success' }
      });
    case DELETE_ARTIFACT_FAILURE:
      return Object.assign({}, state, {
        statusMessage: `Delete failed. ${action.statusText}.`,
        deleteArtifact: { isDeleting: false, deleteStatus: 'failure' }
      });
    case DOWNLOAD_ARTIFACT_REQUEST:
      return Object.assign({}, state, {
        statusMessage: null,
        downloadArtifact: { isDownloading: true, downloadStatus: null }
      });
    case DOWNLOAD_ARTIFACT_SUCCESS:
      return Object.assign({}, state, {
        statusMessage: `Downloaded ${time}.`,
        downloadArtifact: { isDownloading: false, downloadStatus: 'success' }
      });
    case DOWNLOAD_ARTIFACT_FAILURE:
      return Object.assign({}, state, {
        statusMessage: `Download failed. ${action.statusText}.`,
        downloadArtifact: { isDownloading: false, downloadStatus: 'failure' }
      });
    case SAVE_ARTIFACT_REQUEST:
      return Object.assign({}, state, {
        statusMessage: null,
        saveArtifact: { isSaving: true, saveStatus: null }
      });
    case SAVE_ARTIFACT_SUCCESS:
      return Object.assign({}, state, {
        statusMessage: `Last saved ${time}.`,
        saveArtifact: { isSaving: false, saveStatus: 'success' }
      });
    case SAVE_ARTIFACT_FAILURE:
      return Object.assign({}, state, {
        statusMessage: `Save failed. ${action.statusText}.`,
        saveArtifact: { isSaving: false, saveStatus: 'failure' }
      });
    case PUBLISH_ARTIFACT_REQUEST:
      return Object.assign({}, state, {
        statusMessage: null,
        publishArtifact: { isPublishing: true, publishStatus: null }
      });
    case PUBLISH_ARTIFACT_SUCCESS:
      return Object.assign({}, state, {
        statusMessage: `Published ${time}.`,
        publishArtifact: { isPublishing: false, publishStatus: 'success' }
      });
    case PUBLISH_ARTIFACT_FAILURE:
      return Object.assign({}, state, {
        statusMessage: `Publish failed. ${action.statusText}.`,
        publishArtifact: { isPublishing: false, publishStatus: 'failure' }
      });
    default:
      return state;
  }
}
