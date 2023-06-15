const FHIRClient = require('../vsac/FHIRClient');
const auth = require('basic-auth');
const { sendUnauthorized } = require('./common');

function login(req, res) {
  const user = auth(req);
  if (user == null) {
    return sendUnauthorized(res);
  }

  // Since NLM uses basic auth, try to get one value set with username/password. Success means correct credentials.
  FHIRClient.getOneValueSet(user.name, user.pass)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      // If credentials are correct but VS is not found, can still be considered logged in.
      if (error.response?.status === 404) {
        res.sendStatus(200);
      } else {
        res.sendStatus(error.response?.status ?? 500);
      }
    });
}

function getValueSet(req, res) {
  const user = auth(req);
  if (user == null) {
    return sendUnauthorized(res);
  }
  const id = req.params.id;
  FHIRClient.getValueSet(id, user.name, user.pass)
    .then(t => {
      res.json(t);
    })
    .catch(t => {
      res.sendStatus(t.response?.status ?? 500);
    });
}

function searchForValueSets(req, res) {
  const user = auth(req);
  if (user == null) {
    return sendUnauthorized(res);
  }
  const keyword = req.query.keyword;
  FHIRClient.searchForValueSets(keyword, user.name, user.pass)
    .then(t => {
      res.json(t);
    })
    .catch(t => {
      res.sendStatus(t.response?.status ?? 500);
    });
}

function getCode(req, res) {
  const user = auth(req);
  if (user == null) {
    return sendUnauthorized(res);
  }
  const code = req.query.code;
  const system = req.query.system;
  FHIRClient.getCode(code, system, user.name, user.pass)
    .then(t => {
      res.json(t);
    })
    .catch(t => {
      res.sendStatus(t.response?.status ?? 500);
    });
}

module.exports = {
  login,
  getValueSet,
  searchForValueSets,
  getCode
};
