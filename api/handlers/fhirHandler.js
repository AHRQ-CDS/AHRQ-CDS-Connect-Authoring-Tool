const FHIRClient = require('../vsac/FHIRClient');
var auth = require('basic-auth')


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
  getValueSet,
  searchForValueSets,
  getCode
};
