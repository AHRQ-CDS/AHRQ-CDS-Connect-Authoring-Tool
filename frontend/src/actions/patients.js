import axios from 'axios';
import Promise from 'promise';

import * as types from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- LOAD PATIENTS -------------------------------- //

function requestPatients() {
  return {
    type: types.PATIENTS_REQUEST
  };
}

function loadPatientsSuccess(patients) {
  return {
    type: types.LOAD_PATIENTS_SUCCESS,
    patients
  };
}

function loadPatientsFailure(error) {
  return {
    type: types.LOAD_PATIENTS_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendPatientsRequest() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/patients`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadPatients() {
  return (dispatch) => {
    dispatch(requestPatients());

    return sendPatientsRequest()
      .then(data => dispatch(loadPatientsSuccess(data)))
      .catch(error => dispatch(loadPatientsFailure(error)));
  };
}

// ------------------------- LOAD PATIENT -------------------------------- //

function requestPatient(id) {
  return {
    type: types.PATIENT_REQUEST,
    id
  };
}

function loadPatientSuccess(patient) {
  return {
    type: types.LOAD_PATIENT_SUCCESS,
    patient
  };
}

function loadPatientFailure(error) {
  return {
    type: types.LOAD_PATIENT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendPatientRequest(id) {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/patients/${id}`)
      .then(result => resolve(result.data[0]))
      .catch(error => reject(error));
  });
}

export function loadPatient(id) {
  return (dispatch) => {
    dispatch(requestPatient(id));

    return sendPatientRequest(id)
      .then(data => dispatch(loadPatientSuccess(data)))
      .catch(error => dispatch(loadPatientFailure(error)));
  };
}

// ------------------------- ADD PATIENT ---------------------------------- //

function requestAddPatient() {
  return {
    type: types.ADD_PATIENT_REQUEST
  };
}

function addPatientSuccess() {
  return {
    type: types.ADD_PATIENT_SUCCESS
  };
}

function addPatientFailure(error) {
  return {
    type: types.ADD_PATIENT_FAILURE,
    status: error.response ? error.response.status : '',
    statusText: error.response ? error.response.statusText : ''
  };
}

function sendAddPatientRequest(patient) {
  return dispatch => dispatch(savePatient(patient));
}

export function addPatient(patient) {
  return (dispatch) => {
    dispatch(requestAddPatient());

    return dispatch(sendAddPatientRequest(patient))
      .then(data => dispatch(addPatientSuccess()))
      .catch(error => dispatch(addPatientFailure(error)));
  };
}

// ------------------------- SAVE PATIENT --------------------------------- //

function requestSavePatient() {
  return {
    type: types.SAVE_PATIENT_REQUEST
  };
}

function savePatientSuccess(patient) {
  return {
    type: types.SAVE_PATIENT_SUCCESS,
    patient
  };
}

function savePatientFailure(error) {
  return {
    type: types.SAVE_PATIENT_FAILURE,
    status: error.response ? error.response.status : '',
    statusText: error.response ? error.response.statusText : ''
  };
}

function sendSavePatientRequest(patient) {
  console.info(patient);
  return axios.post(`${API_BASE}/patients`, { patient })
    .then(result => result.data);
}

export function savePatient(patient) {
  return (dispatch) => {
    dispatch(requestSavePatient());

    return sendSavePatientRequest(patient)
      .then(data => dispatch(savePatientSuccess(data)))
      .catch(error => dispatch(savePatientFailure(error)))
      .then(() => dispatch(loadPatients()));
  };
}

// ------------------------- DELETE PATIENT ---------------------------------- //

function requestDeletePatient() {
  return {
    type: types.DELETE_PATIENT_REQUEST
  };
}

function deletePatientSuccess(patient) {
  return {
    type: types.DELETE_PATIENT_SUCCESS,
    patient
  };
}

function deletePatientFailure(error) {
  return {
    type: types.DELETE_PATIENT_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendDeletePatientRequest(patient) {
  return new Promise((resolve, reject) => {
    axios.delete(`${API_BASE}/patients/${patient._id}`)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function deletePatient(patient) {
  return (dispatch) => {
    dispatch(requestDeletePatient());

    return sendDeletePatientRequest(patient)
      .then(data => dispatch(deletePatientSuccess(patient)))
      .catch(error => dispatch(deletePatientFailure(error)))
      .then(() => dispatch(loadPatients()));
  };
}
