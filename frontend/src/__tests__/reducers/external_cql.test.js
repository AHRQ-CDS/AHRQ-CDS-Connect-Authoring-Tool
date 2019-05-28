import * as types from '../../actions/types';
import reducer from '../../reducers/external_cql';

describe('external_cql reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      externalCqlList: [],
      externalCqlLibrary: null,
      externalCqlLibraryDetails: null,
      fhirVersion: null,
      loadExternalCqlList: { isLoading: false, loadStatus: null },
      loadExternalCqlLibrary: { isLoading: false, loadStatus: null },
      loadExternalCqlLibraryDetails: { isLoading: false, loadStatus: null },
      addExternalCqlLibrary: { isAdding: false, addStatus: null, error: null, message: '' },
      saveExternalCqlLibrary: { isSaving: false, saveStatus: null },
      deleteExternalCqlLibrary: { isDeleting: false, deleteStatus: null },
      externalCqlErrors: []
    });
  });

  // ------------------------- LOAD EXTERNAL CQL LIST ------------------------ //
  it('should handle getting the current cql list', () => {
    let action = { type: types.EXTERNAL_CQL_LIST_REQUEST };
    let newState = { loadExternalCqlList: { isLoading: true, loadStatus: null } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { loadExternalCqlList: { isLoading: false, loadStatus: null } };
    expect(reducer(previousState, action)).toEqual(newState);

    const externalCqlList = [{ name: 'My Artifact' }];
    action = { type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS, externalCqlList };
    newState = {
      externalCqlList,
      loadExternalCqlList: { isLoading: false, loadStatus: 'success' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_EXTERNAL_CQL_LIST_FAILURE };
    newState = { loadExternalCqlList: { isLoading: false, loadStatus: 'failure' } };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ------------------------- LOAD EXTERNAL CQL LIBRARY DETAILS ------------- //
  it('should handle getting details of external lib', () => {
    let action = { type: types.EXTERNAL_CQL_LIBRARY_DETAILS_REQUEST };
    let newState = { loadExternalCqlLibraryDetails: { isLoading: true, loadStatus: null } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { loadExternalCqlLibraryDetails: { isLoading: false, loadStatus: 'some other status' } };
    expect(reducer(previousState, action)).toEqual(newState);

    const externalCqlLibraryDetails = [{ name: 'My external lib', details: [] }];
    action = { type: types.LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_SUCCESS, externalCqlLibraryDetails };
    newState = {
      externalCqlLibraryDetails: externalCqlLibraryDetails[0],
      loadExternalCqlLibraryDetails: { isLoading: false, loadStatus: 'success' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_FAILURE, status: 400, statusText: 'Test status text' };
    newState = { loadExternalCqlLibraryDetails: { isLoading: false, loadStatus: 'failure' } };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ------------------------- ADD EXTERNAL CQL LIBRARY ---------------------- //
  it('should handle adding a new external lib', () => {
    let action = { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST };
    let newState = { addExternalCqlLibrary: { isAdding: true, addStatus: null, error: null, message: '' } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = {
      addExternalCqlLibrary: { isAdding: false, addStatus: 'other status', error: 'some error', message: 'some msg' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.ADD_EXTERNAL_CQL_LIBRARY_SUCCESS };
    newState = { addExternalCqlLibrary: { isAdding: false, addStatus: 'success', error: null, message: '' } };
    expect(reducer(previousState, action)).toEqual(newState);

    // CQL to ELM errors cause an add failure and pass an array of data to display
    const elmErrors = [{ startLine: 1 }, { startLine: 2 }];
    action = { type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE, status: 400, statusText: '', data: elmErrors };
    newState = {
      addExternalCqlLibrary: { isAdding: false, addStatus: 'failure', error: 400, message: '' },
      externalCqlErrors: elmErrors
    };
    expect(reducer(previousState, action)).toEqual(newState);

    // Duplicate library causes an add failure
    const dupLibraryText = 'Library with identical name and version already exists.';
    action = { type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE, status: 409, statusText: dupLibraryText, data: [] };
    newState = {
      addExternalCqlLibrary: { isAdding: false, addStatus: 'failure', error: 409, message: dupLibraryText },
      externalCqlErrors: []
    };
    expect(reducer(previousState, action)).toEqual(newState);

    // Other generic errors cause an add failure
    action = {
      type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE, status: 500, statusText: '', data: []
    };
    newState = {
      addExternalCqlLibrary: { isAdding: false, addStatus: 'failure', error: 500, message: '' },
      externalCqlErrors: []
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  it('should clear external CQL validation errors', () => {
    const action = { type: types.CLEAR_EXTERNAL_CQL_VALIDATION_WARNINGS };
    const newState = { externalCqlErrors: [] };

    const previousState = { externalCqlErrors: [{ startLine: 1 }, { startLine: 2 }] };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ------------------------- DELETE EXTERNAL CQL LIBRARY ------------------- //
  it('should handle deleting external lib', () => {
    let action = { type: types.DELETE_EXTERNAL_CQL_LIBRARY_REQUEST };
    let newState = { deleteExternalCqlLibrary: { isDeleting: true, deleteStatus: null } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { deleteExternalCqlLibrary: { isDeleting: false, deleteStatus: 'some other status' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.DELETE_EXTERNAL_CQL_LIBRARY_SUCCESS };
    newState = { deleteExternalCqlLibrary: { isDeleting: false, deleteStatus: 'success' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.DELETE_EXTERNAL_CQL_LIBRARY_FAILURE };
    newState = { deleteExternalCqlLibrary: { isDeleting: false, deleteStatus: 'failure' } };
    expect(reducer(previousState, action)).toEqual(newState);
  });
});
