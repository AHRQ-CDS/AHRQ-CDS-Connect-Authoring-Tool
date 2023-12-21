const UserSettings = require('../models/userSettings');
const { sendUnauthorized } = require('./common');

module.exports = {
  get,
  put
};

// Get current user's settings
async function get(req, res) {
  if (req.user) {
    try {
      const results = await UserSettings.find({ user: req.user.uid }).exec();
      if (results.length === 0) {
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
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    sendUnauthorized(res);
  }
}

// Update current user's settings
async function put(req, res) {
  if (req.user) {
    const settings = { ...req.body };
    try {
      const response = await UserSettings.findOneAndUpdate(
        { user: req.user.uid },
        { $set: settings },
        { upsert: true, new: true }
      ).exec();
      res.json({
        termsAcceptedDate: response ? response.termsAcceptedDate : null
      });
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    sendUnauthorized(res);
  }
}
