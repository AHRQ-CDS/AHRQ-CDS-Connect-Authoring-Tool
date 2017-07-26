'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ArtifactSchema = new Schema({
  name: String,
  version: String,
  expTreeInclude: Object,
  expTreeExclude: Object,
  recommendations: Array,
  subpopulations: Array,
  booleanParameters: Array,
  errorStatements: Array,
  uniqueIdCounter: Number
},{
  timestamps: true // adds created_at, updated_at
});

module.exports = mongoose.model('Artifact', ArtifactSchema);
