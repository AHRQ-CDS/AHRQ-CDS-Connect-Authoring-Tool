import * as types from '../../actions/types';
import reducer from '../../reducers/artifacts';

describe.only('artifacts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
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
});
