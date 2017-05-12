'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ArtifactSchema = new Schema({
  name: String,
  version: String,
  templateInstances: Array
},{
  timestamps: true // adds created_at, updated_at
});

module.exports = mongoose.model('Artifact', ArtifactSchema);
