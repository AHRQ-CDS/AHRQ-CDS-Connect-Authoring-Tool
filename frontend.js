/**
 * This is a simple launch script for serving up the built (production) react code and proxying
 * the api server.  The proxy can be disabled by setting the API_PROXY_ACTIVE environment
 * variable to true.
 * See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#other-solutions
 * See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development
 *
 * This is mainly used by PM2 and our Docker image.
 */
require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const process = require('process');
const url = require('url');

const app = express();

app.use('/authoring', express.static(path.join(__dirname, 'build')));

// When running this in Docker without a proxy in front of it, we need to proxy /authoring/api in Express.
const proxyActive = !(/^(false|f|no|n|0)$/i.test(process.env.API_PROXY_ACTIVE));
if (proxyActive) {
  const apiHost = process.env.API_PROXY_HOST || 'localhost';
  const apiPort = process.env.API_PROXY_PORT || 3001;
  app.use(process.env.REACT_APP_API_URL, proxy(`${apiHost}:${apiPort}`, {
    // By default, the API base URL (e.g., /authoring/api) isn't preserved, so we need to add it back
    proxyReqPathResolver: req => `${process.env.REACT_APP_API_URL}${url.parse(req.url).path}` }
  ));
}

app.get('/authoring/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/', (req, res) => {
  res.redirect('/authoring');
});

app.listen(9000);
