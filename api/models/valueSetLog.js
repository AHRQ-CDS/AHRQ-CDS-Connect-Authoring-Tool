const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ValueSetLogSchema = new Schema({
  date: Date,
  file: String,
  fileDate: Date,
  count: Number,
  error: String
});

module.exports = mongoose.model('ValueSetLog', ValueSetLogSchema);
