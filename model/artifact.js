'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtifactSchema = new Schema({
  name: String,
  version: String,
  template_instances: [{ type: Schema.Types.ObjectId, ref: 'TemplateInstance' }] // TODO: create a TemplateInstance model
},{
  timestamps: true // adds created_at, updated_at
});

module.exports = mongoose.model('Artifact', ArtifactSchema);
