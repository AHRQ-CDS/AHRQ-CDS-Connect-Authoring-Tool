/**
 * This is a simple command-line class for testing the VSAC API client.
 */
const FHIRClient = require('./FHIRClient');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (process.argv.length < 4) {
  console.error(`Usage: node FHIR-test-script.js <username> <password> <vsOID_optional>`);
  process.exit(1);
}

let [user, pass, oid] = process.argv.slice(2);
console.log('Logging in w/ user:', user, pass);
FHIRClient.getValueSet(oid, user, pass).then((t) => {
  console.log(t);
});

FHIRClient.searchForValueSets("Diabetes", user, pass).then((t) => {
  console.log(t);
});
