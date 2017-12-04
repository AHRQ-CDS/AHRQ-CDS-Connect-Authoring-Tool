// Load the username/passwords that will be authenticated using the local authentication strategy
const config = require('../config');
const filePath = '../config/' + config.get('auth.local.file');
const users = require(filePath);

const userNames = Object.keys(users);

function findByUsername(name, cb) {
  for (let i = 0; i < userNames.length; i++) {
    if (userNames[i] === name) {
      // Set up user object to mirror LDAP structure
      const user = { uid: userNames[i], password: users[userNames[i]]};
      return cb(null, user);
    }
  }
  return cb(null, null);
}

module.exports = {
  findByUsername
};
