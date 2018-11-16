/**
 * The VSAC client is a java script client for VSAC's API, documented at:
 * https://www.nlm.nih.gov/vsac/support/usingvsac/vsacsvsapiv2.html
 */
const rpn = require('request-promise-native');

const VSAC_ENDPOINT = 'https://vsac.nlm.nih.gov/vsac';

/**
 * Gets a ticket granting ticket.  This is essentially a session token that is valid for 8 hours.
 * The ticket granting ticket is used to get a service ticket.
 *
 * @param {string} username the VSAC user to authenticate as
 * @param {string} password the VSAC user's password
 * @returns {Promise<string>} a ticket granting ticket
 */
function getTicketGrantingTicket(username, password) {
  const options = {
    method: 'POST',
    url: `${VSAC_ENDPOINT}/ws/Ticket`,
    form: { username, password }
  };
  return rpn(options);
}

/**
 * Gets a service ticket.  A service ticket is required to make API calls to VSAC.  Each service
 * ticket is good for one call and expires after five minutes.
 *
 * @param {string} ticketGrantingTicket the ticket granting ticket for the API session
 * @returns {Promise<string>} a service ticket
 */
function getServiceTicket(ticketGrantingTicket) {
  const options = {
    method: 'POST',
    url: `${VSAC_ENDPOINT}/ws/Ticket/${ticketGrantingTicket}`,
    form: { service: 'http://umlsks.nlm.nih.gov' }
  };
  return rpn(options);
}

module.exports = {
  getTicketGrantingTicket,
  getServiceTicket
};