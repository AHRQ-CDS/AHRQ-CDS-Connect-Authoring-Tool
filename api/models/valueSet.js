const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ValueSetSchema = new Schema({
  name: String,
  codeSystem: [String],
  type: String,
  steward: String,
  oid: String,
  codeCount: Number,
  downloaded: Date
});

ValueSetSchema.index({ "$**": 'text', oid: 1 });

module.exports = mongoose.model('ValueSet', ValueSetSchema);
