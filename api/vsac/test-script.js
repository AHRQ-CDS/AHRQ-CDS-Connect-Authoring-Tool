/**
 * This is a simple command-line class for testing the VSAC API client.
 */
const client = require('./client');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (process.argv.length < 4) {
  console.error('Usage: node test-script.js <username> <password>');
  process.exit(1);
}

const [user, pass] = process.argv.slice(2);
console.log('Logging in w/ user:', user, pass);
client.getTicketGrantingTicket(user, pass)
  .then(t => {
    console.log('Ticket Granting Ticket:', t);
    return client.getServiceTicket(t);
  })
  .then(t => {
    console.log('Service Ticket:', t);
  })
  .catch(e => {
    console.log('Error:', e.message);
    process.exit(2);
  });

