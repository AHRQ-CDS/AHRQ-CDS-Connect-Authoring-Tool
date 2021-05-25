import moment from 'moment';

import * as types from 'actions/types';
import reducer from '../artifacts';

// Get the time right now.  Note that tests can fail if the clock changes to the next minute
// between when the code was run (to get actual) and when the assertion is made (expected).
function time() {
  return moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
}

describe('artifacts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      artifacts: [],
      artifact: null,
      names: [],
      statusMessage: null,
      loadArtifacts: { isLoading: false, loadStatus: null },
      loadArtifact: { isLoading: false, loadStatus: null },
      editArtifact: { isEditing: false, editStatus: null },
      saveArtifact: { isSaving: false, saveStatus: null },
      downloadArtifact: {
        isDownloading: false,
        downloadStatus: null,
        isValidating: false,
        validateStatus: null,
        elmFiles: [],
        elmErrors: []
      },
      artifactSaved: true,
      librariesInUse: []
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
    const newState = { artifact: 'Test artifact', artifactSaved: false };
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

  // ----------------------- SAVE ARTIFACT --------------------------------- //
  it('should handle saving an artifact', () => {
    let action = { type: types.SAVE_ARTIFACT_REQUEST };
    let newState = {
      statusMessage: null,
      saveArtifact: { isSaving: true, saveStatus: null },
      artifactSaved: false
    };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { statusMessage: 'Test', saveArtifact: { isSaving: false, saveStatus: 'Test' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.SAVE_ARTIFACT_SUCCESS, artifact: 'Test artifact' };
    newState = {
      artifact: 'Test artifact',
      statusMessage: `Last saved ${time()}.`,
      saveArtifact: { isSaving: false, saveStatus: 'success' },
      artifactSaved: true
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.SAVE_ARTIFACT_FAILURE, status: 'Test status', statusText: 'Test status message' };
    newState = {
      statusMessage: 'Save failed. Test status message.',
      saveArtifact: { isSaving: false, saveStatus: 'failure' }
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });
});
