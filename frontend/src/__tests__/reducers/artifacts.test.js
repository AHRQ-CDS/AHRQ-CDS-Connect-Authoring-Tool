import moment from 'moment';

import * as types from '../../actions/types';
import reducer from '../../reducers/artifacts';

// Get the time right now.  Note that tests can fail if the clock changes to the next minute
// between when the code was run (to get actual) and when the assertion is made (expected).
function time() { return moment().format('dddd, MMMM Do YYYY, h:mm:ss a'); }

describe.only('artifacts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
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
        patientExecuted: null,
        errorMessage: null
      },
      publishEnabled: false
    });
  });

  // ----------------------- SET STATUS MESSAGE ---------------------------- //
  it('should handle setting the status message', () => {
    const action = { type: types.SET_STATUS_MESSAGE, message: 'Run the tests' };
    const newState = { statusMessage: 'Run the tests' };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { statusMessage: 'Old message' };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- UPDATE ARTIFACT ------------------------------- //
  it('should handle updating an artifact', () => {
    const action = { type: types.UPDATE_ARTIFACT, artifact: 'Test artifact' };
    const newState = { artifact: 'Test artifact' };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { artifact: 'Old artifact' };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- INITIALIZE ARTIFACT --------------------------- //
  it('should handle initializing an artifact', () => {
    const action = { type: types.INITIALIZE_ARTIFACT, artifact: 'Initialized artifact' };
    const newState = { artifact: 'Initialized artifact', statusMessage: null };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { artifact: [] };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- LOAD ARTIFACTS -------------------------------- //
  it('should handle loading artifacts', () => {
    let action = { type: types.ARTIFACTS_REQUEST };
    let newState = { loadArtifacts: { isLoading: true, loadStatus: null } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { loadArtifacts: { isLoading: false, loadStatus: 'loaded' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: ['artifact 1', 'artifact 2'] };
    newState = { artifacts: ['artifact 1', 'artifact 2'], loadArtifacts: { isLoading: false, loadStatus: 'success' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_ARTIFACTS_FAILURE, status: 'Test status', statusText: 'Test status message' };
    newState = { loadArtifacts: { isLoading: false, loadStatus: 'failure' } };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- LOAD ARTIFACT -------------------------------- //
  it('should handle loading an artifact', () => {
    let action = { type: types.ARTIFACT_REQUEST, id: '1' };
    let newState = { loadArtifact: { isLoading: true, loadStatus: null } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { loadArtifact: { isLoading: false, loadStatus: 'loaded' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_ARTIFACT_SUCCESS, artifact: 'Test artifact' };
    newState = { artifact: 'Test artifact', loadArtifact: { isLoading: false, loadStatus: 'success' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_ARTIFACT_FAILURE, status: 'Test status', statusText: 'Test status message' };
    newState = { loadArtifact: { isLoading: false, loadStatus: 'failure' } };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- ADD ARTIFACT ---------------------------------- //
  it('should handle adding an artifact', () => {
    let action = { type: types.ADD_ARTIFACT_REQUEST };
    let newState = { addArtifact: { isAdding: true, addStatus: null } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { addArtifact: { isAdding: false, addStatus: 'status' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.ADD_ARTIFACT_SUCCESS };
    newState = { addArtifact: { isAdding: false, addStatus: 'success' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.ADD_ARTIFACT_FAILURE, status: 'Test status', statusText: 'Test status message' };
    newState = { addArtifact: { isAdding: false, addStatus: 'failure' } };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  it('should handle valid artifacts', () => {
    const action = { type: types.VALIDATE_ARTIFACT_SUCCESS, data: { elmErrors: [] } };
    const newState = {
      downloadArtifact: { isValidating: false, elmFiles: undefined, elmErrors: [], validateStatus: 'success' }
    };
    expect(reducer([], action)).toEqual(newState);
  });

  it('should handle artifacts with errors', () => {
    const action = {
      type: types.VALIDATE_ARTIFACT_SUCCESS,
      data: {
        elmErrors: [
          { message: 'Syntax error at define', errorType: 'syntax', errorSeverity: 'error', type: 'CqlToElmError' }
        ]
      }
    };
    const newState = {
      downloadArtifact: {
        elmErrors: [
          { message: 'Syntax error at define', errorType: 'syntax', errorSeverity: 'error', type: 'CqlToElmError' }
        ],
        elmFiles: undefined,
        isValidating: false,
        validateStatus: 'success'
      }
    };
    expect(reducer([], action)).toEqual(newState);
  });

  it('should handle clear artifact errors', () => {
    const action = { type: types.CLEAR_ARTIFACT_VALIDATION_WARNINGS };
    const newState = {
      downloadArtifact: { isDownloading: false, downloadStatus: null, elmErrors: [], elmFiles: [] }
    };
    expect(reducer([], action)).toEqual(newState);
  });

  // ----------------------- DOWNLOAD ARTIFACT ----------------------------- //
  it('should handle downloading an artifact', () => {
    let action = { type: types.DOWNLOAD_ARTIFACT_REQUEST };
    let newState = {
      statusMessage: null,
      downloadArtifact: { isDownloading: true, downloadStatus: null, elmErrors: [] }
    };
    expect(reducer([], action)).toEqual(newState);

    const previousState = {
      statusMessage: 'message',
      downloadArtifact: { isDownloading: false, downloadStatus: 'test', elmErrors: [] }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.DOWNLOAD_ARTIFACT_SUCCESS };

    newState = {
      statusMessage: `Downloaded ${time()}.`,
      downloadArtifact: { isDownloading: false, downloadStatus: 'success', elmErrors: [] }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.DOWNLOAD_ARTIFACT_FAILURE, status: 'Test status', statusText: 'Test status message' };
    newState = {
      statusMessage: 'Download failed. Test status message.',
      downloadArtifact: { isDownloading: false, downloadStatus: 'failure', elmErrors: [] }
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- EXECUTE ARTIFACT ---------------------------- //
  it('should handle executing an artifact', () => {
    let action = { type: types.EXECUTE_ARTIFACT_REQUEST };
    let newState = {
      executeArtifact: {
        isExecuting: true,
        executeStatus: null,
        results: null,
        artifactExecuted: null,
        patientExecuted: null
      }
    };
    expect(reducer([], action)).toEqual(newState);

    const previousState = {
      executeArtifact: {
        isExecuting: false,
        executeStatus: 'test',
        results: {},
        artifactExecuted: 'Test artifact',
        patientExecuted: 'Test patient'
      }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = {
      type: types.EXECUTE_ARTIFACT_SUCCESS,
      data: 'Test data',
      artifact: 'Test artifact',
      patient: 'Test patient'
    };

    newState = {
      executeArtifact: {
        isExecuting: false,
        executeStatus: 'success',
        results: action.data,
        artifactExecuted: action.artifact,
        patientExecuted: action.patient,
        errorMessage: null
      }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = {
      type: types.EXECUTE_ARTIFACT_FAILURE,
      statusText: 'Test status message'
    };
    newState = {
      executeArtifact: {
        isExecuting: false,
        executeStatus: 'failure',
        errorMessage: `Execute failed. ${action.statusText}.`
      }
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- PUBLISH ARTIFACT ------------------------------ //
  it('should handle publishing an artifact', () => {
    let action = { type: types.PUBLISH_ARTIFACT_REQUEST };
    let newState = { statusMessage: null, publishArtifact: { isPublishing: true, publishStatus: null } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { statusMessage: 'test', publishArtifact: { isPublishing: false, publishStatus: 'test' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.PUBLISH_ARTIFACT_SUCCESS };
    newState = {
      statusMessage: `Published ${time()}.`,
      publishArtifact: { isPublishing: false, publishStatus: 'success' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.PUBLISH_ARTIFACT_FAILURE, status: 'Test status', statusText: 'Test status message' };
    newState = {
      statusMessage: 'Publish failed. Test status message.',
      publishArtifact: { isPublishing: false, publishStatus: 'failure' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.UPDATE_PUBLISH_ENABLED, bool: true };
    newState = { publishEnabled: true };
    expect(reducer([], action)).toEqual(newState);
  });

  // ----------------------- SAVE ARTIFACT --------------------------------- //
  it('should handle saving an artifact', () => {
    let action = { type: types.SAVE_ARTIFACT_REQUEST };
    let newState = { statusMessage: null, saveArtifact: { isSaving: true, saveStatus: null } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { statusMessage: 'Test', saveArtifact: { isSaving: false, saveStatus: 'Test' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.SAVE_ARTIFACT_SUCCESS, artifact: 'Test artifact' };
    newState = {
      artifact: 'Test artifact',
      statusMessage: `Last saved ${time()}.`,
      saveArtifact: { isSaving: false, saveStatus: 'success' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.SAVE_ARTIFACT_FAILURE, status: 'Test status', statusText: 'Test status message' };
    newState = {
      statusMessage: 'Save failed. Test status message.',
      saveArtifact: { isSaving: false, saveStatus: 'failure' }
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- DELETE ARTIFACT ------------------------------- //
  it('should handle deleting an artifact', () => {
    let action = { type: types.DELETE_ARTIFACT_REQUEST };
    let newState = { statusMessage: null, deleteArtifact: { isDeleting: true, deleteStatus: null } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { statusMessage: 'Test', deleteArtifact: { isDeleting: false, deleteStatus: 'Test' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.DELETE_ARTIFACT_SUCCESS };
    newState = { statusMessage: `Deleted ${time()}.`, deleteArtifact: { isDeleting: false, deleteStatus: 'success' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.DELETE_ARTIFACT_FAILURE, status: 'Test status', statusText: 'Test status message' };
    newState = {
      statusMessage: 'Delete failed. Test status message.',
      deleteArtifact: { isDeleting: false, deleteStatus: 'failure' }
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });
});
