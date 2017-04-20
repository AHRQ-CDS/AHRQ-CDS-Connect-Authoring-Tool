'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TemplateInstanceSchema = new Schema({
	id: String,
	name: String,
	category: String,
	parameters: Array,
	cql: String
});
// TODO: This schema will eventually change when it becomes more general

module.exports = mongoose.model('TemplateInstance', TemplateInstanceSchema);