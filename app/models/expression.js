'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ExpressionSchema = new Schema({
	id: String,
	name: String,
	parameters: Array
});

module.exports = mongoose.model('Expression', ExpressionSchema);