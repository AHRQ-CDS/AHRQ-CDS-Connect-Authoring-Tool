const parseString = require('xml2js').parseString;

function parseVsacDetails(vsacXML) {
  return new Promise((resolve, reject) => {
    parseString(vsacXML, (err, res) => {
      if (err) { reject(err); }
      resolve(res);
    });
  })
  .then(parsedXML => {
    // Pull out the OID, version, and display name for the valueset.
    const vsOID = parsedXML['ns0:RetrieveValueSetResponse']['ns0:ValueSet'][0]['$']['ID'];
    const vsVersion = parsedXML['ns0:RetrieveValueSetResponse']['ns0:ValueSet'][0]['$']['version'];
    const vsDisplayName = parsedXML['ns0:RetrieveValueSetResponse']['ns0:ValueSet'][0]['$']['displayName'];

    // Grab the list of codes.
    const conceptList = parsedXML['ns0:RetrieveValueSetResponse']['ns0:ValueSet'][0]['ns0:ConceptList'][0]['ns0:Concept'];

    // Loop over the codes and build the JSON.
    const codeList = [];
    for (let i = 0; i < conceptList.length; i++) {
      codeList.push(conceptList[i]['$'])
    }

    const parsedVS = {
      oid: vsOID,
      version: vsVersion,
      displayName: vsDisplayName,
      codes: codeList
    }
    return parsedVS;
  })
  .catch(err => {
    return err;
  });
}

module.exports = {
  parseVsacDetails
};
