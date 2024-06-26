// Import Dependencies
const fs = require('fs');
const process = require('process');
const express = require('express');
const helmet = require('helmet');
const https = require('https');
const morgan = require('morgan');
const mongoose = require('mongoose');
const migrate = require('./migrations/migrate-mongo');
const config = require('./config');
const configPassport = require('./auth/configPassport');
const routes = require('./routes');

// This uses the same evironment variables as documented for Create React App:
// https://create-react-app.dev/docs/using-https-in-development/
const useHTTPS = /^true$/i.test(process.env.HTTPS);
const sslKeyFile = process.env.SSL_KEY_FILE;
const sslCrtFile = process.env.SSL_CRT_FILE;
if (useHTTPS) {
  const sslFilesExist = sslKeyFile && fs.existsSync(sslKeyFile) && sslCrtFile && fs.existsSync(sslCrtFile);
  if (!sslFilesExist) {
    console.error(
      'HTTPS mode detected, but SSL_KEY_FILE and/or SSL_CRT_FILE environment variables do not resolve to valid file paths.'
    );
    process.exit(1);
  }
}

// Turn on/off strict SSL (turn off in dev only, use with caution!)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = config.get('tlsRejectUnauthorized');

// Create App
const app = express();

// Use Helmet, a module that "helps secure Express apps by setting HTTP response headers."
// See: https://helmetjs.github.io/
app.use(helmet());

const logRequests = /^true$/i.test(process.env.LOG_REQUESTS) || /^true$/i.test(process.env.LOG_API_REQUESTS);
if (logRequests) {
  // Log HTTP requests and responses
  app.use(morgan('combined'));
}

// Set port or check environment
const port = process.env.API_PORT || 3001;

// MongoDB Configuration
mongoose.set('strictQuery', true); // Suppress warning. See: https://mongoosejs.com/docs/guide.html#strictQuery
mongoose.connect(config.get('mongo.url'));

// Configure API to use BodyParser and handle json data
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

// Configure passport authentication
configPassport(app);

// Setting headers to handle cache-control
app.use((req, res, next) => {
  // Remove caching and set to private, as recommended by AHRQ
  res.setHeader('Cache-Control', 'private, no-store');
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
    console.log('Checking migrations...');
    migrate()
      .then(() => {
        startServer();
      })
      .catch(err => {
        console.error('Migration Error:', err);
        process.exit(1);
      });
  } else {
    console.log('Skipping Migrations Due to Config');
    startServer();
  }
}
