// Import Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./app/routes');

// Create App
const app = express();

// Set port or check environment
const port = process.env.API_PORT || 3001;

// MongoDB Configuration
mongoose.connect(config.mongodb.localhost);

// Configure API to use BodyParser and handle json data 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setting headers to Prevent Errors from Cross Origin Resource Sharing
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  // Remove caching for most recent authors
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Set api routes
routes(app);

// Start Server
if(!module.parent) { // check if within a test or not.
  app.listen(port, function() {
    console.log(`api running on port ${port}`);
  });
};
