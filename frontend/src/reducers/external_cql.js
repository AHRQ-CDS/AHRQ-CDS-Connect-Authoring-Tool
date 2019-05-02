import * as types from '../actions/types';

const defaultState = {
  externalCqlList: [],
  externalCqlLibrary: null,
  fhirVersion: null,
  loadExternalCqlList: { isLoading: false, loadStatus: null },
  loadExternalCqlLibrary: { isLoading: false, loadStatus: null },
  addExternalCqlLibrary: { isAdding: false, addStatus: null },
  saveExternalCqlLibrary: { isSaving: false, saveStatus: null },
  deleteExternalCqlLibrary: { isDeleting: false, deleteStatus: null }
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
        loadExternalCqlList: { isLoading: false, loadStatus: 'success' }
      };
    case types.LOAD_EXTERNAL_CQL_LIST_FAILURE:
      return {
        ...state,
        loadExternalCqlList: { isLoading: false, loadStatus: 'failure' }
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
    case types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST:
      return {
        ...state,
        addExternalCqlLibrary: { isAdding: true, addStatus: null }
      };
    case types.ADD_EXTERNAL_CQL_LIBRARY_SUCCESS:
      return {
        ...state,
        addExternalCqlLibrary: { isAdding: false, addStatus: 'success' }
      };
    case types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE:
      return {
        ...state,
        addExternalCqlLibrary: { isAdding: false, addStatus: 'failure' }
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
