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
};

/**
 * In Summer 2022, the VSAC FHIR API started appending "|{version}" to the end
 * of resource ids in search results. This is not actually a valid FHIR id, and
 * it causes problems because other parts of the VSAC API don't accept it as an
 * id. Since we prefer non-version-specific value sets anyway, this function
 * strips the version suffix from the id.
 * @param {string} id - the value set id
 * @returns {string} the id with invalid suffix removed (if applicable)
 */
function stripBarFromId(id) {
  if (id && id.indexOf('|') !== -1) {
    return id.slice(0, id.indexOf('|'));
  } else {
    return id;
  }
}

/**
 * In Winter 2023, the VSAC FHIR API started appending "-{version}" to the end
 * of resource ids in search results. This is not actually valid behavior for a
 * FHIR RESTful service to respond to a search for a resource with an id with a
 * resource that has a different id. This was discussed on chat.fhir.org here:
 * https://chat.fhir.org/#narrow/stream/179202-terminology/topic/VSAC.20Appending.20Version.20to.20ID
 * Since we prefer non-version-specific value sets anyway, this function
 * strips the version suffix from the id.
 * @param {string} id - the value set id
 * @returns {string} the id with invalid suffix removed (if possible)
 */
function stripDashFromId(id, version) {
  if (id && version && id.endsWith(`-${version}`)) {
    return id.slice(0, id.lastIndexOf(`-${version}`));
  }
  return id;
}

function cleanId(id, version) {
  return stripDashFromId(stripBarFromId(id), version);
}

function getValueSet(oid, username, password) {
  const options = {
    method: 'GET',
    url: `${VSAC_FHIR_ENDPOINT}/ValueSet/${oid}/$expand`,
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`
    }
  };

  return rpn(options).then(res => {
    const response = JSON.parse(res);
    return {
      oid: cleanId(response.id, response.version),
      version: response.meta.versionId,
      displayName: response.name,
      codes: response.expansion.contains.map(c => {
        return {
          code: c.code,
          codeSystemURI: c.system,
          codeSystemName: codeLookups[c.system] || c.system,
          codeSystemVersion: c.version,
          displayName: c.display
        };
      })
    };
  });
}

function searchForValueSets(search, username, password) {
  const options = {
    method: 'GET',
    url: `${VSAC_FHIR_ENDPOINT}/ValueSet?name:contains=${search}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`
    }
  };

  return rpn(options).then(res => {
    const response = JSON.parse(res);

    const results = (response.entry || []).map((v, i) => {
      return {
        name: v.resource.name,
        steward: v.resource.publisher,
        oid: cleanId(v.resource.id),
        codeSystem: [],
        codeCount: (v.resource.expansion || {}).total || 0
      };
    });
    return {
      _total: response.total,
      count: results.length,
      page: 1,
      results
    };
  });
}

function getCode(code, system, username, password) {
  const options = {
    method: 'GET',
    url: `${VSAC_FHIR_ENDPOINT}/CodeSystem/$lookup?code=${code}&system=${system}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`
    }
  };
  return rpn(options).then(res => {
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
  });
}

function getOneValueSet(username, password) {
  const oneCodeVSOID = '2.16.840.1.113762.1.4.1034.65';
  const options = {
    method: 'GET',
    url: `${VSAC_FHIR_ENDPOINT}/ValueSet/${oneCodeVSOID}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`
    }
  };
  return rpn(options).then(res => {
    return res;
  });
}

module.exports = {
  getValueSet,
  searchForValueSets,
  getCode,
  getOneValueSet
};
