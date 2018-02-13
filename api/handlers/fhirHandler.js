const FHIRClient = require('../vsac/FHIRClient');
var auth = require('basic-auth')


function getValueSet(req, res) {
  const {name, pass} = auth(req)
  const oid = req.params.id;
  FHIRClient.getValueSet(id, name, pass)
    .then((t) => {
      res.json(t);
    })
    .catch((t) => {
      res.sendStatus(t.statusCode);
    });
}

function searchForValueSets(req, res) {
  const {name, pass} = auth(req)
  const query = req.query.query;
  FHIRClient.searchForValueSets(query, name, pass).then((t) => {
    res.json(t);
  })
  .catch((t) => {
    res.sendStatus(t.statusCode);
  });
}

module.exports = {
  getValueSet,
  searchForValueSets
};
