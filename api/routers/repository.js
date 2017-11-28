const express = require('express');
const publish = require('../handlers/publish');

const Repository = express.Router();

Repository.route('/artifacts')
  .get(publish.getArtifacts);

module.exports = Repository;
