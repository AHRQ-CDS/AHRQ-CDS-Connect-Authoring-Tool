const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  name: String,
  patient: Object,
  user: String
}, {
  timestamps: true // adds created_at, updated_at
});

module.exports = mongoose.model('Patient', PatientSchema);
