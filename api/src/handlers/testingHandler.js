const Patient = require('../models/patient');
const { sendUnauthorized } = require('./common');

module.exports = {
  allGet,
  singleGet,
  singlePost,
  singleDelete
};

// Get all patients
async function allGet(req, res) {
  if (req.user) {
    try {
      const patients = await Patient.find({ user: req.user.uid }).exec();
      res.json(patients);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    sendUnauthorized(res);
  }
}

// Get a single patient
async function singleGet(req, res) {
  if (req.user) {
    const id = req.params.patient;
    try {
      const patient = await Patient.find({ user: req.user.uid, _id: id }).exec();
      patient.length === 0 ? res.sendStatus(404) : res.json(patient);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    sendUnauthorized(res);
  }
}

// Post a single patient
async function singlePost(req, res) {
  if (req.user) {
    const newPatient = req.body;
    newPatient.user = req.user.uid;
    try {
      const response = await Patient.create(newPatient);
      res.status(201).json(response);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    sendUnauthorized(res);
  }
}

// Delete a single patient
async function singleDelete(req, res) {
  if (req.user) {
    const id = req.params.patient;
    try {
      const response = await Patient.deleteMany({ user: req.user.uid, _id: id }).exec();
      response.n === 0 ? res.sendStatus(404) : res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    sendUnauthorized(res);
  }
}
