const express = require('express');
const AgeRangeRouter = express.Router();
const AgeRange = require('../models/ageRange');

AgeRangeRouter.route('/')
   // Get all age ranges saved in the ageranges collection
  .get(function(request, result) {
    AgeRange.find(function(err, ageRanges) {
      if(err) {
        result.send(err);
      }
      result.json(ageRanges);
    });
  })

  // Post a new age range
  .post(function(request, result) {
    var ageRange = new AgeRange();
    ageRange.type = request.body.type;
    ageRange.low = request.body.low;
    ageRange.high = request.body.high;
    ageRange.save(function(err, savedItem) {
      if(err) {
        result.send(err);
      }
      result.json({
        message: "Posted new age range",
        item: savedItem 
      })
    });
  });

AgeRangeRouter.route('/:author')
  // TODO: Update an age range (right now it just shows the specific one, it doesn't delete it)
  .put(function(request, result) {
    AgeRange.findById(request.params.ageRange_id, function(err, ageRange) {
      if(err) {
        result.send(err);
      }
      // Just gets a specific ageRange, doesn't actually update anything yet
      result.json(ageRange)
    })
  })
  
  // Delete an age range
  .delete(function(request, result) {
    AgeRange.remove({ _id: request.params.ageRange_id }, function(err, ageRange) {
      if(err) {
        result.send(err);
      }
      result.json("Deleted something")
    })
  });

module.exports = AgeRangeRouter;