'use strict';

module.exports.id = "booleanParameter-to-parameter";

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  var coll = this.db.collection('artifacts');
  // If an artifact has the booleanParameters field, give it a type of Boolean
  // and rename booleanParameters to parameter
  coll.updateMany(
    { 'booleanParameters': { $exists: true} },
    {
      $set: { 'booleanParameters.$[].type': 'Boolean' },
      $rename: { 'booleanParameters': 'parameters' }
    },
    done
  );
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  done();
};
