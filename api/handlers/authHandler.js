const passport = require('passport');
const config = require('../config');
const { sendUnauthorized } = require('./common');

function login(req, res, next) {
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

  passport.authenticate(strategies, { failWithError: true })(req, res, err => {
    const remoteIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (err) {
      console.log(`${new Date().toISOString()}: Login FAILURE: ${req?.body?.username || 'unknown'} (${remoteIP})`, err);
      sendUnauthorized(res);
    } else {
      console.log(`${new Date().toISOString()}: Login SUCCESS: ${req?.user?.uid || 'unknown'} (${remoteIP})`);
      res.json(req.user);
    }
  });
}

function logout(req, res) {
  req.logout(function () {
    req.session = null;
    res.sendStatus(200);
  });
}

function currentUser(req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    sendUnauthorized(res);
  }
}

module.exports = {
  login,
  currentUser,
  logout
};
