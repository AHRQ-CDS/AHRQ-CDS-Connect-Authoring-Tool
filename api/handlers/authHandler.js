const passport = require('passport');
const config = require('../config');

function login(req, res, next) {
  console.log(`${new Date().toISOString()}: Login ATTEMPT: ${req && req.body && req.body.username}`);

  // If the user is already logged in, log out first
  if (req.user) {
    req.logout(function () {});
  }

  // Add strategies for authentication based on configuration
  const strategies = [];
  if (config.get('auth.ldap.active')) {
    strategies.push('ldapauth');
  }
  if (config.get('auth.local.active')) {
    strategies.push('local');
  }

  passport.authenticate(strategies)(req, res, err => {
    if (err) {
      console.log(`${new Date().toISOString()}: Login FAILURE: ${req && req.body && req.body.username}`, err);
      next(err);
    } else {
      console.log(`${new Date().toISOString()}: Login SUCCESS: ${req.user && req.user.uid}`);
      res.json(req.user);
    }
  });
}

function logout(req, res) {
  console.log(`${new Date().toISOString()}: Logout: ${JSON.stringify(req.user && req.user.uid)}`);
  req.logout(function () {
    req.session = null;
    res.sendStatus(200);
  });
}

function currentUser(req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
}

module.exports = {
  login,
  currentUser,
  logout
};
