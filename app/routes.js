module.exports = function(app) {

  // Routing for API check
  app.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
  });

  // Routing for Artifacts
  app.use('/api/artifacts', require('./routers/artifactRouter.js'));

  // Routing for Resources, ValueSets, Templates
  app.use('/api/config', require('./routers/configRouter.js'));

  // Routing for cql files
  app.use('/api/cql', require('./routers/cqlRouter'));

  // Routing for Artifact Elements
  app.use('/api/expressions', require('./routers/expressionRouter'))

  app.use('/api/repository', require('./routers/repository'))

  // Catch all other Api calls
  app.get('/api/*', function(req, res) { res.sendStatus(404); });

}
