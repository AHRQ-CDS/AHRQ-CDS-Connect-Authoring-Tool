module.exports = function(app) {

  // Routing for API check
  app.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
  });

  // Routing for Artifacts
  app.use('/api/artifacts', require('./routers/artifactRouter.js'));

  // Routing for Resources
  app.use('/api/resources', require('./routers/resourceRouter.js'));

  // Routing for cql files
  app.use('/api/cql', require('./routers/cqlRouter'))

  // Catch all other Api calls
  app.get('/api/*', function(req, res) { res.sendStatus(404); });

}