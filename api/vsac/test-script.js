/**
 * This is a simple command-line class for testing the VSAC API client.
 */
const client = require('./client');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (process.argv.length < 4) {
  console.error('Usage: node test-script.js <username> <password> <vsOID_optional>');
  process.exit(1);
}

let [user, pass, oid] = process.argv.slice(2);
console.log('Logging in w/ user:', user, pass);
client.getTicketGrantingTicket(user, pass)
  .then(t => {
    console.log('Ticket Granting Ticket:', t);
    return client.getServiceTicket(t);
  })
  .then(t => {
    console.log('Service Ticket:', t);
    // A default OID for LDL Test
    if (oid === undefined) {
      oid = '2.16.840.1.113883.3.464.1003.198.12.1016';
    }
    return client.getVSDetailsByOID(oid, t);
  })
  .then(details => {
    console.log('Parsed VS details:', details);
  })
  .catch(e => {
    console.log('Error:', e.message);
    process.exit(2);
  });

