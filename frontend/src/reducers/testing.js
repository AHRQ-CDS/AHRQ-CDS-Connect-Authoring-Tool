import * as types from '../actions/types';

const defaultState = {
  patients: [],
  patient: null,
  fhirVersion: null,
  loadPatients: { isLoading: false, loadStatus: null },
  loadPatient: { isLoading: false, loadStatus: null },
  addPatient: { isAdding: false, addStatus: null },
  deletePatient: { isDeleting: false, deleteStatus: null },
  savePatient: { isSaving: false, saveStatus: null },
};

export default function auth(state = defaultState, action) {
  switch (action.type) {
    case types.PATIENTS_REQUEST:
      return {
        ...state,
        loadPatients: { isLoading: true, loadStatus: null }
      };
    case types.LOAD_PATIENTS_SUCCESS:
      return {
        ...state,
        patients: action.patients,
        loadPatients: { isLoading: false, loadStatus: 'success' }
      };
    case types.LOAD_PATIENTS_FAILURE:
      return {
        ...state,
        loadPatients: { isLoading: false, loadStatus: 'failure' }
      };
    case types.PATIENT_REQUEST:
      return {
        ...state,
        loadPatient: { isLoading: true, loadStatus: null }
      };
    case types.LOAD_PATIENT_SUCCESS:
      return {
        ...state,
        patient: action.patient,
        loadPatient: { isLoading: false, loadStatus: 'success' }
      };
    case types.LOAD_PATIENT_FAILURE:
      return {
        ...state,
        loadPatient: { isLoading: false, loadStatus: 'failure' }
      };
    case types.ADD_PATIENT_REQUEST:
      return {
        ...state,
        addPatient: { isAdding: true, addStatus: null }
      };
    case types.ADD_PATIENT_SUCCESS:
      return {
        ...state,
        addPatient: { isAdding: false, addStatus: 'success' }
      };
    case types.ADD_PATIENT_FAILURE:
      return {
        ...state,
        addPatient: { isAdding: false, addStatus: 'failure' }
      };
    case types.SAVE_PATIENT_REQUEST:
      return {
        ...state,
        savePatient: { isSaving: true, saveStatus: null }
      };
    case types.SAVE_PATIENT_SUCCESS:
      return {
        ...state,
        patient: action.patient,
        fhirVersion: action.fhirVersion,
        savePatient: { isSaving: false, saveStatus: 'success' }
      };
    case types.SAVE_PATIENT_FAILURE:
      return {
        ...state,
        savePatient: { isSaving: false, saveStatus: 'failure' }
      };
    case types.DELETE_PATIENT_REQUEST:
      return {
        ...state,
        deletePatient: { isDeleting: true, deleteStatus: null }
      };
    case types.DELETE_PATIENT_SUCCESS:
      return {
        ...state,
        deletePatient: { isDeleting: false, deleteStatus: 'success' }
      };
    case types.DELETE_PATIENT_FAILURE:
      return {
        ...state,
        deletePatient: { isDeleting: false, deleteStatus: 'failure' }
      };
    default:
      return state;
  }
}
