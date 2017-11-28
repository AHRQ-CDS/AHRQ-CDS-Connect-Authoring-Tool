import {
  ARTIFACTS_REQUEST, LOAD_ARTIFACTS_SUCCESS, LOAD_ARTIFACTS_FAILURE,
  ADD_ARTIFACT_REQUEST, ADD_ARTIFACT_SUCCESS, ADD_ARTIFACT_FAILURE,
  EDIT_ARTIFACT_REQUEST, EDIT_ARTIFACT_SUCCESS, EDIT_ARTIFACT_FAILURE,
  DELETE_ARTIFACT_REQUEST, DELETE_ARTIFACT_SUCCESS, DELETE_ARTIFACT_FAILURE } from '../actions/types';

const defaultState = {
  isFetching: false,
  fetchStatus: null,
  isAdding: false,
  addStatus: null,
  isEditing: false,
  editStatus: null,
  isDeleting: false,
  deleteStatus: null,
  artifacts: null
};

export default function auth(state = defaultState, action) {
  switch (action.type) {
    case ARTIFACTS_REQUEST:
      return Object.assign({}, state, { isFetching: true, fetchStatus: null });
    case LOAD_ARTIFACTS_SUCCESS:
      return Object.assign({}, state, { isFetching: false, fetchStatus: 'success', artifacts: action.artifacts });
    case LOAD_ARTIFACTS_FAILURE:
      return Object.assign({}, state, { isFetching: false, fetchStatus: 'failure' });
    case ADD_ARTIFACT_REQUEST:
      return Object.assign({}, state, { isAdding: true, addStatus: null });
    case ADD_ARTIFACT_SUCCESS:
      return Object.assign({}, state, { isAdding: false, addStatus: 'success' });
    case ADD_ARTIFACT_FAILURE:
      return Object.assign({}, state, { isAdding: false, addStatus: 'failure' });
    case EDIT_ARTIFACT_REQUEST:
      return Object.assign({}, state, { isEditing: true, editStatus: null });
    case EDIT_ARTIFACT_SUCCESS:
      return Object.assign({}, state, { isEditing: false, editStatus: 'success' });
    case EDIT_ARTIFACT_FAILURE:
      return Object.assign({}, state, { isEditing: false, editStatus: 'failure' });
    case DELETE_ARTIFACT_REQUEST:
      return Object.assign({}, state, { isDeleting: true, deleteStatus: null });
    case DELETE_ARTIFACT_SUCCESS:
      return Object.assign({}, state, { isDeleting: false, deleteStatus: 'success' });
    case DELETE_ARTIFACT_FAILURE:
      return Object.assign({}, state, { isDeleting: false, deleteStatus: 'failure' });
    default:
      return state;
  }
}
