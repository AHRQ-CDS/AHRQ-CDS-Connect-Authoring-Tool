// Import Dependencies
const path = require('path');
const fs = require('fs');
const process = require('process');
const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const mm = require('mongodb-migrations');
const config = require('./config');
const configPassport = require('./auth/configPassport');
const routes = require('./routes');
const mmConfig = require('./mm-config');

// This uses the same evironment variables as documented for Create React App:
// https://create-react-app.dev/docs/using-https-in-development/
const useHTTPS = /^true$/i.test(process.env.HTTPS);
const sslKeyFile = process.env.SSL_KEY_FILE;
const sslCrtFile = process.env.SSL_CRT_FILE;
if (useHTTPS) {
  const sslFilesExist = sslKeyFile && fs.existsSync(sslKeyFile) && sslCrtFile && fs.existsSync(sslCrtFile);
  if (!sslFilesExist) {
    console.error(
      // eslint-disable-next-line max-len
      'HTTPS mode detected, but SSL_KEY_FILE and/or SSL_CRT_FILE environment variables do not resolve to valid file paths.'
    );
    process.exit(1);
  }
}

// Turn on/off strict SSL (turn off in dev only, use with caution!)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = config.get('tlsRejectUnauthorized');

// Create App
const app = express();

// Set port or check environment
const port = process.env.API_PORT || 3001;

// MongoDB Configuration
mongoose.Promise = global.Promise;
mongoose.connect(config.get('mongo.url'));

// Configure API to use BodyParser and handle json data
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

// Configure passport authentication
configPassport(app);

// Setting headers to Prevent Errors from Cross Origin Resource Sharing
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    // eslint-disable-next-line max-len
    'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  // Remove caching for most recent authors
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Set api routes
routes(app);

// Starts Server
if (!module.parent) {
  const startServer = () => {
    if (useHTTPS) {
      https
        .createServer({ key: fs.readFileSync(sslKeyFile), cert: fs.readFileSync(sslCrtFile) }, app)
        .listen(port, () => {
          console.log(`API listening on port ${port} using https`);
        });
    } else {
      app.listen(port, () => {
        console.log(`API listening on port ${port} using http`);
      });
    }
  };

  // check if within a test or not.
  if (config.get('migrations.active')) {
    // Run any necessary migrations before starting the server
    console.log('Running Migrations');
    const migrator = new mm.Migrator(mmConfig);
    migrator.runFromDir(path.resolve(__dirname, 'migrations'), (err, results) => {
      if (err) {
        console.error('Migration Error:', err);
        process.exit(1);
      }
      console.log('Migrations Complete');
      startServer();
    });
  } else {
    console.log('Skipping Migrations Due to Config');
    startServer();
  }
}
