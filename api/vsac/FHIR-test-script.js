/**
 * This is a simple command-line class for testing the VSAC API client.
 */
const FHIRClient = require('./FHIRClient');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (process.argv.length < 4) {
  console.error(
    `Usage: node FHIR-test-script.js <username> <password>` + ` <vsOID_optional> <code_optional> <system_optional>`
  );
  process.exit(1);
}

let [user, pass, oid, code, system] = process.argv.slice(2);
// A default OID for LDL Test
if (oid === undefined) {
  oid = '2.16.840.1.113883.3.464.1003.198.12.1016';
}
// A default code and system for LDL
if (code === undefined && system === undefined) {
  code = '12773-8';
  system = 'http://loinc.org';
}

console.log('Check basic auth w/ user:', user, pass);
FHIRClient.getOneValueSet(user, pass)
  .then(() => {
    console.log('Logged in');
    console.log('Getting VS details for', oid);
    return FHIRClient.getValueSet(oid, user, pass);
  })
  .then(res => {
    console.log(res);
    console.log('Searching for VS w/ keyword Diabetes');
    return FHIRClient.searchForValueSets('Diabetes', user, pass);
  })
  .then(res => {
    console.log(res);
    console.log('Getting code details for code', code, 'from', system);
    return FHIRClient.getCode(code, system, user, pass);
  })
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log('Error:', e.message);
    process.exit(2);
  });
