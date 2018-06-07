const express = require('express');
const patient = require('../handlers/patientHandler');

const PatientRouter = express.Router();

// Routes for /authoring/api/patients
PatientRouter.route('/')
  .get(patient.allGet)
  .post(patient.singlePost);

// Routes for /authoring/api/patients/:patient
PatientRouter.route('/:patient')
  .get(patient.singleGet)
  .delete(patient.singleDelete);

module.exports = PatientRouter;
