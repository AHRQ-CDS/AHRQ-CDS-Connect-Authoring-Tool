'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ArtifactSchema = new Schema({
	name: String,
	templateInstances: Array
});

module.exports = mongoose.model('Artifact', ArtifactSchema);