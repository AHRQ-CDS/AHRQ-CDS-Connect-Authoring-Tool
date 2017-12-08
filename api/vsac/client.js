/**
 * The VSAC client is a java script client for VSAC's API, documented at:
 * https://www.nlm.nih.gov/vsac/support/usingvsac/vsacsvsapiv2.html
 */
const rpn = require('request-promise-native');
const { parseVsacDetails} = require('./parseVsac');

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

/**
 * Gets the details of a value set based on an OID. A service ticket is required to make this API call.
 *
 * @param {string} oid the OID of the value set to retrieve
 * @param {string} serviceTicket the service ticket to be used when making the API call
 * @return {Promise<string>} the JSON that contains all value set details
 */
function getVSDetailsByOID(oid, serviceTicket) {
  const options = {
    method: 'GET',
    uri: `${VSAC_ENDPOINT}/svs/RetrieveValueSet`,
    qs: { id: oid, ticket: serviceTicket }
  };
  return rpn(options).then(details => {
    return parseVsacDetails(details);
  });
}

module.exports = {
  getTicketGrantingTicket,
  getServiceTicket,
  getVSDetailsByOID
};