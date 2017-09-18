const artifactRouter = require('./routers/artifactRouter.js');
const configRouter = require('./routers/configRouter.js');
const cqlRouter = require('./routers/cqlRouter');
const expressionRouter = require('./routers/expressionRouter');
const repository = require('./routers/repository');

module.exports = (app) => {
  // Routing for API check
  app.get('/', (req, res) => {
    res.json({ message: 'API Initialized!' });
  });

  // Routing for Artifacts
  app.use('/api/artifacts', artifactRouter);

  // Routing for Resources, ValueSets, Templates
  app.use('/api/config', configRouter);

  // Routing for cql files
  app.use('/api/cql', cqlRouter);

  // Routing for Artifact Elements
  app.use('/api/expressions', expressionRouter);

  app.use('/api/repository', repository);

  // Catch all other Api calls
  app.get('/api/*', (req, res) => { res.sendStatus(404); });
};
