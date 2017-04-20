// //server.js
// 'use strict'
// //first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Author = require('./model/author');
var TemplateInstance = require('./model/templateInstance');
var Artifact = require('./model/artifact');

//and create our instances
var app = express();
var router = express.Router();
//set our port to either a predetermined port number if you have set
//it up, or 3001
var port = process.env.API_PORT || 3001;

//db config
mongoose.connect('mongodb://localhost/cds_authoring')

//now we should configure the API to use bodyParser and look for
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  //and remove cacheing so we get the most recent authors
  res.setHeader('Cache-Control', 'no-cache');
  next();
});
//now we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

//adding the /authors route to our /api router
router.route('/authors')
  //retrieve all authors from the database
  .get(function(req, res) {
    //looks at our Author Schema
    Author.find(function(err, authors) {
      if (err)
        res.send(err);
        //responds with a json object of our database authors.
        res.json(authors);
    });
  })
  //post new author to the database
  .post(function(req, res) {
    var author = new Author();
    //body parser lets us use the req.body
    author.name = req.body.name;
    author.text = req.body.text;
    author.save(function(err) {
      if (err)
        res.send(err);
        res.json({ message: 'Author successfully added!' })
    });
  });

// Adding a route to a specific author based on the database ID
router.route('/authors/:author_id')
  // The put method gives us the chance to update our author based on
  // the ID passed to the route
  .put(function(req, res) {
    Author.findById(req.params.author_id, function(err, author) {
      if(err) {
        res.send(err);
      }
      // Setting the new author text to whatever was changed.
      // If nothing was changed we will not alter the field
      (req.body.name) ? author.name = req.body.name : null;
      (req.body.text) ? author.text = req.body.text : null;

      // Save author
      author.save(function(err) {
        if(err) {
          res.send(err);
        }
        res.json({ message: 'Author has been updated'})
      });
    });
  })

  // Delete method for removing an author from our database
  .delete(function(req, res) {
    // Selects the author by its ID, then removes it
    Author.remove({ _id: req.params.author_id }, function(err, author) {
      if(err) {
        res.send(err);
      }
      res.json({ message: 'Author has been deleted'})
    });
  });

// Route for saving artifact
router.route('/Artifact')
  // Post a new age range
  .post(function(request, result) {
    var artifact = new Artifact(request.body);
    artifact.save(function(err, savedItem) {
      if(err) {
        result.send(err);
      }
      result.json({
        message: "Posted new artifact",
        item: savedItem 
      })
    });
  });



// Route for saving template instance
router.route('/TemplateInstance')
  // Get all age ranges saved in the templates collection
  .get(function(request, result) {
    TemplateInstance.find(function(err, instances) {
      if(err) {
        result.send(err);
      }
      result.json(instances);
    });
  })

  // Post a new age range
  .post(function(request, result) {
    var instance = new TemplateInstance(request.body);
    instance.save(function(err, savedItem) {
      if(err) {
        result.send(err);
      }
      result.json({
        message: "Posted new age range",
        item: savedItem 
      })
    });
  });

router.route('/TemplateInstance/:template_id')
  // TODO: Update an age range (right now it just shows the specific one, it doesn't delete it)
  .put(function(request, result) {
    TemplateInstance.findById(request.params.template_id, function(err, template) {
      if(err) {
        result.send(err);
      }
      // Just gets a specific template, doesn't actually update anything yet
      result.json(template)
    })
  })
  
  // Delete an age range
  .delete(function(request, result) {
    TemplateInstance.remove({ _id: request.params.template_id }, function(err, template) {
      if(err) {
        result.send(err);
      }
      result.json("Deleted something")
    })
  });

//Use our router configuration when we call /api
app.use('/api', router);
//starts the server and listens for requests
if(!module.parent) { // check if within a test or not.
  app.listen(port, function() {
    console.log(`api running on port ${port}`);
  });
}

//export default app;
