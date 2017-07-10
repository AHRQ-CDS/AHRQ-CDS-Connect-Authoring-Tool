/**
 * This is a simple launch script for serving up the built (production) react code and proxying
 * the api server.  The proxy can be disabled via a DISABLE_API_PROXY environment variable.
 * See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#other-solutions
 * See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development
 *
 * This is mainly used by PM2 and our Docker image.
 */
const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const process = require('process');
const url = require('url');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

// When running this in Docker without a proxy in front of it, we need to proxy /api in Express.
const disableProxy = process.env.DISABLE_API_PROXY && /^(true|t|yes|y|1)$/i.test(process.env.DISABLE_API_PROXY);
if (!disableProxy) {
  const apiPort = process.env.API_PORT || 3001;
  app.use('/api', proxy(`localhost:${apiPort}`, {
    // By default, the /api isn't preserved, so we need to add it back
    proxyReqPathResolver: req => `/api${url.parse(req.url).path}` }
  ));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(9000);
