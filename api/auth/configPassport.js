const process = require('process');
const session = require('express-session');
const passport = require('passport');
const LdapStrategy = require('passport-ldapauth');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const config = require('../config');
const findLocalUserById = require('./localAuthUsers').findByUsername;

function getLdapConfiguration(req, callback) {
  // Replace {{username}} and {{password}} with values from request
  const ldapConfig = JSON.parse(
    JSON.stringify(config.get('auth.ldap'))
      .replace(/\{\{username\}\}/g, req.body.username)
      .replace(/\{\{password\}\}/g, req.body.password)
  );
  callback(null, ldapConfig);
}

function getLocalConfiguration(username, password, done) {
  findLocalUserById(username, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    if (user.password !== password) {
      return done(null, false);
    }
    return done(null, user);
  });
}

module.exports = app => {
  // Configuring cookie security as suggested at: https://github.com/expressjs/session#cookiesecure
  const sess = {
    secret: config.get('auth.session.secret'),
    cookie: {},
    unset: 'destroy',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  };
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }
  app.use(session(sess));

  // Configure authentication using Passport LDAP Strategy
  if (config.get('auth.ldap.active')) {
    passport.use(new LdapStrategy(getLdapConfiguration));
  }

  // Configure authentication using Passport Local Strategy - enabled based on configuration
  if (config.get('auth.local.active')) {
    passport.use(new LocalStrategy(getLocalConfiguration));
  }

  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user, done) => {
    done(null, user.uid);
  });
  passport.deserializeUser((uid, done) => {
    // In the future, we might store user info (name, roles, etc) in Mongo via the passport.authenticate cb.
    // If we did that, this is where we would reconstitute the user from Mongo.
    done(null, { uid });
  });
};
