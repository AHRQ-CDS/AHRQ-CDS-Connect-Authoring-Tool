// List of username/passwords that will be authenticated using the local authentication strategy
const users = [{ uid: 'demo', password: 'demo' }];

function findByUsername(name, cb) {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.uid === name) {
      return cb(null, user);
    }
  }
  return cb(null, null);
}

module.exports = {
  findByUsername
};
