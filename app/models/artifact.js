'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ArtifactSchema = new Schema({
  name: String,
  version: String,
  template_instances: Array // { type: mongoose.Schema.Types.ObjectId, ref: 'TemplateInstance' }
  // In order to reference the TemplateInstance by ObjectId, it needs to be saved first
},{
  timestamps: true // adds created_at, updated_at
});

module.exports = mongoose.model('Artifact', ArtifactSchema);
