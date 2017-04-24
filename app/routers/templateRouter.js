const express = require('express');
const router = express.Router();
const TemplateInstance = require('../models/templateInstance');

// Route for saving template instance
router.route('/')
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

router.route('/:template_id')
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

module.exports = router;