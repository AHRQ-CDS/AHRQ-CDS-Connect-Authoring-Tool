/**
 * This is a simple launch script for serving up the built (production) react code and proxying
 * the api server.  The proxy can be disabled by setting the API_PROXY_ACTIVE environment
 * variable to true.
 * See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#other-solutions
 * See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development
 *
 * This is mainly used by PM2 and our Docker image.
 */
require('dotenv-expand').expand(require('dotenv').config());

const express = require('express');
const https = require('https');
const proxy = require('express-http-proxy');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const url = require('url');

const PORT = 9000;

// This uses the same environment variables as documented for Create React App:
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

const app = express();

const logRequests = /^true$/i.test(process.env.LOG_REQUESTS) || /^true$/i.test(process.env.LOG_FRONTEND_REQUESTS);
if (logRequests) {
  // Log HTTP requests and responses
  app.use(morgan('combined'));
}

app.use('/authoring', express.static(path.join(__dirname, 'build')));

// When running this in Docker without a proxy in front of it, we need to proxy /authoring/api in Express.
const proxyActive = !/^(false|f|no|n|0)$/i.test(process.env.API_PROXY_ACTIVE);
if (proxyActive) {
  const apiHost = process.env.API_PROXY_HOST || 'localhost';
  const apiPort = process.env.API_PROXY_PORT || 3001;
  const proxyOptions = {
    // By default, the API base URL (e.g., /authoring/api) isn't preserved, so we need to add it back
    proxyReqPathResolver: req => `${process.env.REACT_APP_API_URL}${url.parse(req.url).path}`
  };
  if (useHTTPS) {
    // Enable HTTPS proxy to API
    proxyOptions.https = true;
    // API usually uses a self-signed cert, so disable cert-checking just for this proxy
    proxyOptions.proxyReqOptDecorator = proxyReqOpts => {
      proxyReqOpts.rejectUnauthorized = false;
      return proxyReqOpts;
    };
  }
  app.use(process.env.REACT_APP_API_URL, proxy(`${apiHost}:${apiPort}`, proxyOptions));
}

app.get('/authoring/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/', (req, res) => {
  res.redirect('/authoring');
});

if (useHTTPS) {
  https.createServer({ key: fs.readFileSync(sslKeyFile), cert: fs.readFileSync(sslCrtFile) }, app).listen(PORT, () => {
    console.log(`Frontend listening on port ${PORT} using https`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Frontend listening on port ${PORT} using http`);
  });
}
