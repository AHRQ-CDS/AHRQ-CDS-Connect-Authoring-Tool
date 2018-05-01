const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArtifactSchema = new Schema({
  name: String,
  version: String,
  expTreeInclude: Object,
  expTreeExclude: Object,
  recommendations: Array,
  subpopulations: Array,
  subelements: Array,
  parameters: Array,
  errorStatement: Object,
  patients: Array,
  uniqueIdCounter: Number,
  user: String
}, {
  timestamps: true // adds created_at, updated_at
});

module.exports = mongoose.model('Artifact', ArtifactSchema);
