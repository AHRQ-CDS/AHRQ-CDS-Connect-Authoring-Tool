'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AgeRangeSchema = new Schema({
	type: String,
	low: String,
	high: String
});
// TODO: This schema will eventually change when it becomes more general

module.exports = mongoose.model('AgeRange', AgeRangeSchema);