const path = require('path');
const config = require('./config');

module.exports = {
  url: config.get('mongo.url'),
  directory: path.relative('', path.resolve(__dirname, 'migrations')),
  collection: 'migrations'
}
