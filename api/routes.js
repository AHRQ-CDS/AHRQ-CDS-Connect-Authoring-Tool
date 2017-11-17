const artifactRouter = require('./routers/artifactRouter.js');
const configRouter = require('./routers/configRouter.js');
const cqlRouter = require('./routers/cqlRouter');
const expressionRouter = require('./routers/expressionRouter');
const authRouter = require('./routers/authRouter.js');
const repository = require('./routers/repository');

module.exports = (app) => {
  // Routing for API check
  app.get('/', (req, res) => {
    res.json({ message: 'API Initialized!' });
  });

  // Routing for Artifacts
  app.use('/authoring/api/artifacts', artifactRouter);

  // Routing for Resources, ValueSets, Templates
  app.use('/authoring/api/config', configRouter);

  // Routing for cql files
  app.use('/authoring/api/cql', cqlRouter);

  // Routing for Artifact Elements
  app.use('/authoring/api/expressions', expressionRouter);

  // Routing for Auth
  app.use('/authoring/api/auth', authRouter);

  // Routing for repository
  app.use('/authoring/api/repository', repository);

  // Catch all other Api calls
  app.get('/authoring/api/*', (req, res) => { res.sendStatus(404); });
};
