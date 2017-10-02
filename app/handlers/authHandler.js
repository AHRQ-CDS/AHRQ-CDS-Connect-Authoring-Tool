const passport = require('passport');

function login(req, res, next) {
  // If the user is already logged in, log out first
  if (req.user) {
    req.logout();
  }
  passport.authenticate('ldapauth')(req, res, (err) => {
    if (err) {
      next(err);
    } else {
      res.json(req.user);
    }
  });
}

function logout(req, res) {
  req.logout();
  res.sendStatus(200);
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
