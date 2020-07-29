import * as types from '../actions/types';

const defaultState = {
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
  externalCqlErrors: [],
  externalCQLLibraryParents: {}
};

export default function externalCQL(state = defaultState, action) {
  switch (action.type) {
    case types.EXTERNAL_CQL_LIST_REQUEST:
      return {
        ...state,
        loadExternalCqlList: { isLoading: true, loadStatus: null }
      };
    case types.LOAD_EXTERNAL_CQL_LIST_SUCCESS:
      return {
        ...state,
        externalCqlList: action.externalCqlList,
        externalCQLLibraryParents: action.parentsOfLibraries,
        loadExternalCqlList: { isLoading: false, loadStatus: 'success' }
      };
    case types.LOAD_EXTERNAL_CQL_LIST_FAILURE:
      return {
        ...state,
        loadExternalCqlList: { isLoading: false, loadStatus: 'failure' },
        externalCqlList: [],
        externalCQLLibraryParents: {}
      };
    case types.EXTERNAL_CQL_LIBRARY_REQUEST:
      return {
        ...state,
        loadExternalCqlLibrary: { isLoading: true, loadStatus: null }
      };
    case types.LOAD_EXTERNAL_CQL_LIBRARY_SUCCESS:
      return {
        ...state,
        externalCqlLibrary: action.externalCqlLibrary,
        loadExternalCqlLibrary: { isLoading: false, loadStatus: 'success' }
      };
    case types.LOAD_EXTERNAL_CQL_LIBRARY_FAILURE:
      return {
        ...state,
        loadExternalCqlLibrary: { isLoading: false, loadStatus: 'failure' }
      };
    case types.EXTERNAL_CQL_LIBRARY_DETAILS_REQUEST:
      return {
        ...state,
        loadExternalCqlLibraryDetails: { isLoading: true, loadStatus: null }
      };
    case types.LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_SUCCESS:
      return {
        ...state,
        externalCqlLibraryDetails: action.externalCqlLibraryDetails[0],
        loadExternalCqlLibraryDetails: { isLoading: false, loadStatus: 'success' }
      };
    case types.LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_FAILURE:
      return {
        ...state,
        loadExternalCqlLibraryDetails: { isLoading: false, loadStatus: 'failure' }
      };
    case types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST:
      return {
        ...state,
        addExternalCqlLibrary: { isAdding: true, addStatus: null, error: null, message: '' }
      };
    case types.ADD_EXTERNAL_CQL_LIBRARY_SUCCESS:
      return {
        ...state,
        addExternalCqlLibrary: { isAdding: false, addStatus: 'success', error: null, message: action.message }
      };
    case types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE:
      return {
        ...state,
        addExternalCqlLibrary: {
          isAdding: false,
          addStatus: 'failure',
          error: action.status,
          message: action.statusText
        },
        externalCqlErrors: action.data
      };
    case types.CLEAR_EXTERNAL_CQL_VALIDATION_WARNINGS:
      return {
        ...state,
        externalCqlErrors: []
      };
    case types.CLEAR_ADD_EXTERNAL_LIBRARY_ERROR_AND_MESSAGES:
      return {
        ...state,
        addExternalCqlLibrary: { ...state.addExternalCqlLibrary, error: null, message: '' },
      };
    case types.DELETE_EXTERNAL_CQL_LIBRARY_REQUEST:
      return {
        ...state,
        deleteExternalCqlLibrary: { isDeleting: true, deleteStatus: null }
      };
    case types.DELETE_EXTERNAL_CQL_LIBRARY_SUCCESS:
      return {
        ...state,
        deleteExternalCqlLibrary: { isDeleting: false, deleteStatus: 'success' }
      };
    case types.DELETE_EXTERNAL_CQL_LIBRARY_FAILURE:
      return {
        ...state,
        deleteExternalCqlLibrary: { isDeleting: false, deleteStatus: 'failure' }
      };
    default:
      return state;
  }
}
