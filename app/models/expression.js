'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ExpressionSchema = new Schema({
	id: String,
	name: String,
	extends: String,
	modifiers: Array,
	suppressedModifiers: Array,
	returnType: String,
	parameters: Array,
	type: String
});

module.exports = mongoose.model('Expression', ExpressionSchema);