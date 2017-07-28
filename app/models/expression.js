'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ExpressionSchema = new Schema({
	id: String,
	name: String,
	extends: String,
	modifiers: Array,
	supressedModifiers: Array,
	returnType: String,
	parameters: Array,
	type: String
});

module.exports = mongoose.model('Expression', ExpressionSchema);