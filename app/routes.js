const AuthorRouter = require('./routers/AuthorRouter.js');
const AgeRangeRouter = require('./routers/AgeRangeRouter.js');

module.exports = function(app) {

  // Routing for API check
  app.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
  });

  // Routing for Authors
  app.use('/api/authors', AuthorRouter);

  // Routing for Age Range
  app.use('/api/ageRange', AgeRangeRouter);

  // Catch all other Api calls
  app.get('/api/*', function(req, res) { res.sendStatus(404); });

}