const FHIRClient = require('../vsac/FHIRClient');
var auth = require('basic-auth')

function login(req, res) {
  const user = auth(req);
  if (user == null) {
    return res.sendStatus(401);
  }

  FHIRClient.getAuthType()
    .then((type) => {
      switch (type) {
        case 'Basic': {
          // For basic auth, try to get one value set with username/password. Success means correct credentials.
          FHIRClient.getOneValueSet(user.name, user.pass)
            .then(() => {
              res.sendStatus(200);
            })
            .catch((error) => {
              // If credentials are correct but VS is not found, can still be considered logged in.
              if (error.statusCode === 404) {
                res.sendStatus(200);
              } else {
                res.sendStatus(error.statusCode);
              }
            });
          break;
        }
        case 'SMART-on-FHIR': {
          // No implementation yet - return Unauthorized
          res.sendStatus(401);
          break;
        }
        default:
          res.sendStatus(401);
          break;
      }
    })
    .catch((error) => {
      if (error.statusCode) {
        res.sendStatus(error.statusCode);
      } else {
        res.status(500).send(error);
      }
    });
}

function getValueSet(req, res) {
  const user = auth(req);
  if (user == null) {
    return res.sendStatus(401);
  }
  const id = req.params.id;
  FHIRClient.getValueSet(id, user.name, user.pass)
    .then((t) => {
      res.json(t);
    })
    .catch((t) => {
      res.sendStatus(t.statusCode);
    });
}

function searchForValueSets(req, res) {
  const user = auth(req);
  if (user == null) {
    return res.sendStatus(401);
  }
  const keyword = req.query.keyword;
  FHIRClient.searchForValueSets(keyword, user.name, user.pass).then((t) => {
    res.json(t);
  })
  .catch((t) => {
    res.sendStatus(t.statusCode);
  });
}

function getCode(req, res) {
  const user = auth(req);
  if (user == null) {
    return res.sendStatus(401);
  }
  const code = req.query.code;
  const system = req.query.system;
  FHIRClient.getCode(code, system, user.name, user.pass).then((t) => {
    res.json(t);
  })
  .catch((t) => {
    res.sendStatus(t.statusCode);
  });
}

module.exports = {
  login,
  getValueSet,
  searchForValueSets,
  getCode
};
