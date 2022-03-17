const UserSettings = require('../models/userSettings');

module.exports = {
  get,
  put
};

// Get current user's settings
function get(req, res) {
  if (req.user) {
    UserSettings.find({ user: req.user.uid }, (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else if (results.length === 0) {
        res.sendStatus(404);
      } else if (results.length > 1) {
        // There should never be multiple settings for a single user
        res.sendStatus(500);
      } else {
        const settings = {
          termsAcceptedDate: results[0].termsAcceptedDate
        };
        res.json(settings);
      }
    });
  } else {
    res.sendStatus(401);
  }
}

// Update current user's settings
function put(req, res) {
  if (req.user) {
    const settings = { ...req.body };
    UserSettings.findOneAndUpdate(
      { user: req.user.uid },
      { $set: settings },
      { upsert: true, new: true },
      (error, response) => {
        if (error) res.status(500).send(error);
        else
          res.json({
            termsAcceptedDate: response ? response.termsAcceptedDate : null
          });
      }
    );
  } else {
    res.sendStatus(401);
  }
}
