// Import Dependencies
const path = require('path');
const process = require('process');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mm = require('mongodb-migrations');
const config = require('./config');
const configPassport = require('./auth/configPassport');
const routes = require('./routes');
const mmConfig = require('./mm-config');

// Turn on/off strict SSL (turn off in dev only, use with caution!)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = config.get('tlsRejectUnauthorized');

// Create App
const app = express();

// Set port or check environment
const port = process.env.API_PORT || 3001;

// MongoDB Configuration
mongoose.connect(config.get('mongo.url'));

// Configure API to use BodyParser and handle json data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure passport authentication
configPassport(app);

// Setting headers to Prevent Errors from Cross Origin Resource Sharing
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  // eslint-disable-next-line max-len
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  // Remove caching for most recent authors
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Set api routes
routes(app);

// Starts Server
if (!module.parent) { // check if within a test or not.
  if (config.get('migrations.active')) {
    // Run any necessary migrations before starting the server
    console.log('Running Migrations');
    const migrator = new mm.Migrator(mmConfig);
    migrator.runFromDir(path.resolve(__dirname, 'migrations'), (err, results) => {
      if (err) {
        console.err('Migration Error:', err);
        process.exit(1);
      }
      console.log('Migrations Complete');
      app.listen(port, () => {
        console.log(`api running on port ${port}`);
      });
    });
  } else {
    console.log('Skipping Migrations Due to Config');
    app.listen(port, () => {
      console.log(`api running on port ${port}`);
    });
  }
}
