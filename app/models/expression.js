

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpressionSchema = new Schema({
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
