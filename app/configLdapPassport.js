const session = require('express-session');
const passport = require('passport');
const LdapStrategy = require('passport-ldapauth');
const config = require('../config');

function getLdapConfiguration(req, callback) {
  // Replace {{username}} and {{password}} with values from request
  const ldapConfig = JSON.parse(JSON.stringify(config.auth.ldap)
    .replace(/\{\{username\}\}/g, req.body.username)
    .replace(/\{\{password\}\}/g, req.body.password)
  );
  callback(null, ldapConfig);
}

module.exports = (app) => {
  // Configuring cookie security as suggested at: https://github.com/expressjs/session#cookiesecure
  const sess = {
    secret: config.auth.sessionSecret,
    cookie: {}
  };
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }
  app.use(session(sess));

  // Configure authentication using Passport
  passport.use(new LdapStrategy(getLdapConfiguration));
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
