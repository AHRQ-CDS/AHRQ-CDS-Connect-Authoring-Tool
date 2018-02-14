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
// A default OID for LDL Test
if (oid === undefined) {
  oid = '2.16.840.1.113883.3.464.1003.198.12.1016';
}
console.log('Using basic auth w/ user:', user, pass);
console.log('Getting VS details for', oid);
FHIRClient.getValueSet(oid, user, pass)
.then((t) => {
  console.log(t);
})
.then(() => {
  console.log('Searching for VS w/ keyword Diabetes');
  return FHIRClient.searchForValueSets("Diabetes", user, pass)
})
.then((t) => {
  console.log(t);
});
