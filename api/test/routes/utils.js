const express = require('express');
const routes = require('../../src/routes');

module.exports = { setupExpressApp };

class Options {
  constructor() {
    this.reset();
  }

  reset() {
    this.user = { uid: 'bob' };
  }
}

function setupExpressApp(...configurers) {
  const options = new Options();
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(async (req, res, next) => {
    if (options.user) {
      req.user = options.user;
    }
    next();
  });
  for (const configurer of configurers) {
    configurer(app);
  }
  routes(app);
  return [app, options];
}
