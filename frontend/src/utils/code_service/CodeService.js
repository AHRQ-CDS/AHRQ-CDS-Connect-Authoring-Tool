import downloadFromVSAC from './download-vsac';
import extractOid from './extractOid';

/**
 * Constructs a code service with functions for downloading codes from the National Library of Medicine's
 * Value Set Authority Center.
 */
class CodeService {
  constructor() {
    this.valueSets = {}; // This will just be an object of objects.
  }

  /**
   * Given a list of value set references, will ensure that each has a local
   * definition.  If a local definition does not exist, the value set will
   * be downloaded using the VSAC API.
   * @param {Object} valueSetList - an array of objects, each containing "name"
   *   and "id" properties, with an optional "version" property
   * @returns {Promise.<undefined,Error>} A promise that returns nothing when
   *   resolved and returns an error when rejected.
   */
  ensureValueSets(valueSetList = [], vsacApiKey) {
    // First, filter out the value sets we already have
    const filteredVSList = valueSetList.filter(vs => {
      const result = this.findValueSet(vs.id, vs.version);
      return typeof result === 'undefined';
    });
    // Now download from VSAC if necessary
    if (filteredVSList.length === 0) {
      return Promise.resolve();
    } else if (!vsacApiKey) {
      return Error('Failed to download value sets since API Key is not provided.');
    }
    return downloadFromVSAC(vsacApiKey, filteredVSList, this.valueSets);
  }

  findValueSetsByOid(oid) {
    const result = [];
    const vs = this.valueSets[oid];
    let version;

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (version in vs) {
      result.push(vs[version]);
    }
    return result;
  }

  findValueSet(id, version) {
    const oid = extractOid(id);
    if (version != null) {
      const vsObj = this.valueSets[oid];
      if (typeof vsObj !== 'undefined') {
        return vsObj[version];
      }
    } else {
      const results = this.findValueSetsByOid(oid);
      if (results.length !== 0) {
        return results.reduce((a, b) => {
          if (a.version > b.version) {
            return a;
          }
          return b;
        });
      }
    }
    return undefined;
  }
}

export default CodeService;
