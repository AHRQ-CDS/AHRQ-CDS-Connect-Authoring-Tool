
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtifactSchema = new Schema({
  name: String,
  version: String,
  expTreeInclude: Object,
  expTreeExclude: Object,
  recommendations: Array,
  subpopulations: Array,
  booleanParameters: Array,
  errorStatement: Object,
  uniqueIdCounter: Number
}, {
  timestamps: true // adds created_at, updated_at
});

module.exports = mongoose.model('Artifact', ArtifactSchema);
