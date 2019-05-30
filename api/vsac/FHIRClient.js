const rpn = require('request-promise-native');
const _ = require('lodash');
const config = require('../config');


const VSAC_FHIR_ENDPOINT = config.get('terminologyService');


/**
* Gets the value set for the given oid,

* @param {string} oid - the VSAC oid you are after
* @param {string} username the VSAC user to authenticate as
* @param {string} password the VSAC user's password
* @returns {Promise<object>} an object containing the FHIR response for the OID
*/

const codeLookups = {
  'http://snomed.info/sct': 'SNOMEDCT',
  'http://hl7.org/fhir/sid/icd-9-cm': 'ICD9CM',
  'http://hl7.org/fhir/sid/icd-10': 'ICD10',
  'http://hl7.org/fhir/sid/icd-10-cm': 'ICD10CM',
  'http://ncimeta.nci.nih.gov': 'NCI',
  'http://loinc.org': 'LOINC',
  'http://www.nlm.nih.gov/research/umls/rxnorm': 'RXNORM',
  'http://unitsofmeasure.org': 'UCUM',
  'http://www.ama-assn.org/go/cpt': 'CPT',
  'http://hl7.org/fhir/sid/cvx': 'CVX'
}

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
      codes: response.expansion.contains.map((c) => {
        return {
          code: c.code,
          codeSystemURI: c.system,
          codeSystemName: codeLookups[c.system]||c.system,
          codeSystemVersion: c.version,
          displayName: c.display
        }
      })
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

    const results = (response.entry||[]).map((v, i) => {
      return {
        name: v.resource.name,
        steward: v.resource.publisher,
        oid: v.resource.id,
        codeSystem: [],
        codeCount: (v.resource.expansion||{}).total||0
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



function getCode(code, system, username, password) {
  const options = {
    method: 'GET',
    url: `${VSAC_FHIR_ENDPOINT}/CodeSystem/$lookup?code=${code}&system=${system}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`
    }
  };
  return rpn(options).then((res) => {

    const codeJSON = JSON.parse(res).parameter;
    let codeObject = _.zipObject(_.map(codeJSON, 'name'), _.map(codeJSON, 'valueString'));
    return {
      system,
      systemName: codeObject.name,
      systemOID: codeObject.Oid,
      version: codeObject.version,
      code,
      display: codeObject.display
    };
  })
}

function getOneValueSet(username, password) {
  const oneCodeVSOID = '2.16.840.1.113762.1.4.1034.65';
  const options = {
    method: 'GET',
    url: `${VSAC_FHIR_ENDPOINT}/ValueSet/${oneCodeVSOID}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`
    }
  };
  return rpn(options).then((res) => {
    return res;
  });
}

module.exports = {
  getValueSet,
  searchForValueSets,
  getCode,
  getOneValueSet
}
