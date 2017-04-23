module.exports = function(app) {

  // Routing for API check
  app.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
  });

  // Routing for Artifacts
  app.use('/api/artifacts', require('./routers/artifactRouter.js'));

  // Routing for Authors
  app.use('/api/authors', require('./routers/authorRouter.js'));

  // Routing for Templates
  app.use('/api/TemplateInstance', require('./routers/templateRouter'));

  // Routing for cql files
  app.use('/api/cql', require('./routers/cqlRouter'))

  // Catch all other Api calls
  app.get('/api/*', function(req, res) { res.sendStatus(404); });

}