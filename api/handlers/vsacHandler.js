const vsacClient = require('../vsac/client');

function login(req, res) {
  const user = req.body.username;
  const pass = req.body.password;
  vsacClient.getTicketGrantingTicket(user, pass)
    .then(t => {
      req.session.ticketGrantingTicket = {
        ticket: t,
        timeCreated: new Date()
      };
      res.sendStatus(200);
    })
    .catch(error => {
      req.session.ticketGrantingTicket = null;
      res.sendStatus(error.statusCode);
    });
}

function getVSDetailsByOID(req, res) {
  const sessionTicketInfo = req.session.ticketGrantingTicket;
  if (sessionTicketInfo) {
    const ageOfTGT = new Date() - new Date(sessionTicketInfo.timeCreated);
    if (ageOfTGT < 28800000) {
      // TGT was created less than 8 hours ago and is valid. Generate ST to use to get VS details.
      vsacClient.getServiceTicket(sessionTicketInfo.ticket)
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
      // TGT created more than 8 hours ago and no longer valid.
      res.sendStatus(401);
    }
  } else {
    // No TGT on the session. Must login first.
    res.sendStatus(401);
  }
}

module.exports = {
  login,
  getVSDetailsByOID
};
