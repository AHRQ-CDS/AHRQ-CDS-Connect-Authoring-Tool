module.exports = {
  sendUnauthorized
};

function sendUnauthorized(res) {
  // A 401 should always be accompanied by a WWW-Authenticate header. There is no standard value
  // for form-based authentication, but it seems that many people have converged on "FormBased".
  res.setHeader('WWW-Authenticate', 'FormBased');
  return res.sendStatus(401);
}
