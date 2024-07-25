const express = require('express');
const routes = require('../src/routes');

module.exports = { setupExpressApp, importChaiExpect };

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

async function importChaiExpect() {
  // Chai dynamic import. See: https://github.com/chaijs/chai/issues/1561#issuecomment-1933171936
  const chai = await import('chai');
  const chaiExclude = await import('chai-exclude');
  chai.use(chaiExclude.default);
  return chai.expect;
}
