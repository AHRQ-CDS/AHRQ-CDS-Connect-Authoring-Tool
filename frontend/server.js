/**
 * This is a simple launch script for serving up the built (production) react code and proxying
 * the api server.  The proxy can be disabled by setting the API_PROXY_ACTIVE environment
 * variable to true.
 * See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#other-solutions
 * See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development
 *
 * This is mainly used by PM2 and our Docker image.
 */
require('dotenv-expand').expand({ ...require('dotenv-flow').config(), processEnv: {} });

const express = require('express');
const helmet = require('helmet');
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

// Use Helmet, a module that "helps secure Express apps by setting HTTP response headers."
// See: https://helmetjs.github.io/
// Allow loading resources from the same domain, the NIH sub-domain that supports UCUM unit lookups,
// and domains related to required analytics.
const contentSecurityPolicy = {
  directives: {
    'default-src': ["'self'", 'clin-table-search.lhc.nlm.nih.gov', 'www.google-analytics.com'],
    'script-src': [
      "'self'",
      'clin-table-search.lhc.nlm.nih.gov',
      'gateway.foresee.com',
      'dap.digitalgov.gov',
      'www.google-analytics.com'
    ],
    'img-src': ["'self'", 'www.google-analytics.com']
  }
};
// GoogleTagManager uses an inline script, so we need to add its hash to the CSP. The hash varies
// depending on the GTM key, so get it from an ENV var. If you don't know the hash, look at the CSP
// error in the console, as it usually lists the expected hash. Since the CSP hash is needed to load
// GoogleTagManager, only add the other GTM stuff to the CSP if CSP_SCRIPT_HASH is available.
if (process.env.CSP_SCRIPT_HASH?.length) {
  contentSecurityPolicy.directives['default-src'].push('analytics.google.com', 'stats.g.doubleclick.net');
  contentSecurityPolicy.directives['script-src'].push(
    `'${process.env.CSP_SCRIPT_HASH}'`,
    "'unsafe-eval'",
    'www.googletagmanager.com'
  );
}
app.use(helmet({ contentSecurityPolicy }));

const logRequests = /^true$/i.test(process.env.LOG_REQUESTS) || /^true$/i.test(process.env.LOG_FRONTEND_REQUESTS);
if (logRequests) {
  // Log HTTP requests and responses
  app.use(morgan('combined'));
}

app.use(
  '/authoring',
  express.static(path.join(__dirname, 'build'), {
    setHeaders: function (res, path, stat) {
      // Set to private and no-cache, which may be overkill for static content, but recommended by AHRQ
      res.set('Cache-Control', 'private, no-cache, max-age=0, must-revalidate');
    }
  })
);

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
  res.sendFile(path.join(__dirname, 'build', 'index.html'), {
    // Set to private and no-cache, which may be overkill for static content, but recommended by AHRQ
    headers: {
      'Cache-Control': 'private, no-cache, max-age=0, must-revalidate'
    }
  });
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
