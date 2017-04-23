'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ArtifactSchema = new Schema({
  name: String,
  version: String,
  template_instances: [{ type: Schema.Types.ObjectId, ref: 'TemplateInstance' }]
},{
  timestamps: true // adds created_at, updated_at
});

module.exports = mongoose.model('Artifact', ArtifactSchema);
