const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cqlLibrarySchema = new Schema(
  {
    name: String,
    version: String,
    fhirVersion: String,
    linkedArtifactId: String,
    user: String,
    details: Object
  },
  {
    timestamps: true // adds created_at, updated_at
  }
);

module.exports = mongoose.model('CQLLibrary', cqlLibrarySchema);
