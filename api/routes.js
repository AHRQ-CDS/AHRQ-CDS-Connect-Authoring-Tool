const artifactRouter = require('./routers/artifactRouter.js');
const testingRouter = require('./routers/testingRouter.js');
const externalCQLRouter = require('./routers/externalCQLRouter.js');
const configRouter = require('./routers/configRouter.js');
const cqlRouter = require('./routers/cqlRouter');
const authRouter = require('./routers/authRouter.js');
const fhirRouter = require('./routers/fhirRouter');
const foreseeHandler = require('./handlers/foreseeHandler');

module.exports = app => {
  // Routing for API check
  app.get('/', (req, res) => {
    res.json({ message: 'API Initialized!' });
  });

  // Routing for Artifacts
  app.use('/authoring/api/artifacts', artifactRouter);

  // Routing for Testing
  app.use('/authoring/api/testing', testingRouter);

  // Routing for External CQL
  app.use('/authoring/api/externalCQL', externalCQLRouter);

  // Routing for Resources, ValueSets, Templates
  app.use('/authoring/api/config', configRouter);

  // Routing for cql files
  app.use('/authoring/api/cql', cqlRouter);

  // Routing for Auth
  app.use('/authoring/api/auth', authRouter);

  // Routing for FHIR VSAC endpoint
  app.use('/authoring/api/fhir', fhirRouter);

  // Handling for ForeSee script
  app.get('/authoring/api/foresee.js', foreseeHandler);

  // Catch all other Api calls
  app.get('/authoring/api/*', (req, res) => {
    res.sendStatus(404);
  });
};
