const rpn = require('request-promise-native');


const VSAC_FHIR_ENDPOINT = 'https://cts.nlm.nih.gov/fhir';


/**
* Gets the value set for the given oid,

* @param {string} oid - the VSAC oid you are after
* @param {string} username the VSAC user to authenticate as
* @param {string} password the VSAC user's password
* @returns {Promise<object>} an object containing the FHIR response for the OID
*/
function getValueSet(oid, username, password) {
  const options = {
    method: 'GET',
    url: `${VSAC_FHIR_ENDPOINT}/ValueSet/${oid}/$expand`,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`
    }
  };

  return rpn(options).then((res) => {
    const response = JSON.parse(res);
    return {
      oid: response.id,
      version: response.meta.versionId,
      displayName: response.name,
      codes: response.expansion.contains
    }
  });
}

function searchForValueSets(search, username, password) {
  const options = {
    method: 'GET',
    url: `${VSAC_FHIR_ENDPOINT}/ValueSet?name:contains=${search}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`
    }
  };

  return rpn(options).then((res) => {
    const response = JSON.parse(res);
    const results = response.entry.map((v, i) => {
      return {
        name: v.resource.name,
        steward: v.resource.publisher,
        oid: v.resource.id
      }
    });
    return {
      _total: response.total,
      count: results.length,
      page: 1,
      results
    }
  });
}


module.exports = {
  getValueSet,
  searchForValueSets
}
