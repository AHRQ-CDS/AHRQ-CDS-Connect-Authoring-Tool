const vsacClient = require('../vsac/client');
const vsacSearch = require('../vsac/search');

function login(req, res) {
  const user = req.body.username;
  const pass = req.body.password;
  vsacClient.getTicketGrantingTicket(user, pass)
    .then(t => {
      req.session.ticketGrantingTicket = t;
      res.sendStatus(200);
    })
    .catch(error => {
      req.session.ticketGrantingTicket = null;
      res.sendStatus(error.statusCode);
    });
}

function getVSDetailsByOID(req, res) {
  const ticketGrantingTicket = req.session.ticketGrantingTicket;
  if (ticketGrantingTicket) {
    vsacClient.getServiceTicket(ticketGrantingTicket)
      .then(serviceTicket => {
        return vsacClient.getVSDetailsByOID(req.params.id, serviceTicket);
      })
      .then(details => {
        res.json(details);
      })
      .catch(error => {
        res.sendStatus(error.statusCode);
      });
  } else {
    // No TGT on the session. Must login first.
    res.sendStatus(401);
  }
}

function search(req, res) {
  const ticketGrantingTicket = req.session.ticketGrantingTicket;
  if (ticketGrantingTicket) {
    vsacSearch(req.query)
      .then(result => res.json(result))
      .catch(error => res.status(500).send(error));
  } else {
    // No TGT on the session. Must login first.
    res.sendStatus(401);
  }
}

module.exports = {
  login,
  getVSDetailsByOID,
  search
};
