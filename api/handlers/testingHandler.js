const Patient = require('../models/patient');

module.exports = {
  allGet,
  singleGet,
  singlePost,
  singleDelete
};

// Get all patients
function allGet(req, res) {
  if (req.user) {
    // eslint-disable-next-line array-callback-return
    Patient.find({ user: req.user.uid }, (error, patients) => {
      if (error) res.status(500).send(error);
      else res.json(patients);
    });
  } else {
    res.sendStatus(401);
  }
}

// Get a single patient
function singleGet(req, res) {
  if (req.user) {
    const id = req.params.patient;
    Patient.find({ user: req.user.uid, _id: id }, (error, patient) => {
      if (error) res.status(500).send(error);
      else if (patient.length === 0) res.sendStatus(404);
      else res.json(patient);
    });
  } else {
    res.sendStatus(401);
  }
}

// Post a single patient
function singlePost(req, res) {
  if (req.user) {
    const newPatient = req.body;
    newPatient.user = req.user.uid;
    Patient.create(newPatient,
      (error, response) => {
        if (error) res.status(500).send(error);
        else res.status(201).json(response);
      });
  } else {
    res.sendStatus(401);
  }
}

// Delete a single patient
function singleDelete(req, res) {
  if (req.user) {
    const id = req.params.patient;
    Patient.remove({ user: req.user.uid, _id: id }, (error, response) => {
      if (error) res.status(500).send(error);
      else if (response.n === 0) res.sendStatus(404);
      else res.sendStatus(200);
    });
  } else {
    res.sendStatus(401);
  }
}
