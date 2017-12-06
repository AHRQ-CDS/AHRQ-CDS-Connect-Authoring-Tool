const parseString = require('xml2js').parseString;

function parseVsacDetails(vsacXML) {
  let parsedXML;
  parseString(vsacXML, (err, res) => { parsedXML = res; });

  // Pull out the OID, version, and display name for the valueset.
  const vsOID = parsedXML['ns0:RetrieveValueSetResponse']['ns0:ValueSet'][0]['$']['ID'];
  const vsVersion = parsedXML['ns0:RetrieveValueSetResponse']['ns0:ValueSet'][0]['$']['version'];
  const vsDisplayName = parsedXML['ns0:RetrieveValueSetResponse']['ns0:ValueSet'][0]['$']['displayName'];

  // Grab the list of codes.
  const conceptList = parsedXML['ns0:RetrieveValueSetResponse']['ns0:ValueSet'][0]['ns0:ConceptList'][0]['ns0:Concept'];

  // Loop over the codes and build the JSON.
  const codeList = [];
  for (let concept in conceptList) {
    codeList.push(conceptList[concept]['$'])
  }

  const parsedVS = {
    oid: vsOID,
    version: vsVersion,
    displayName: vsDisplayName,
    codes: codeList
  }
  return parsedVS;
}

module.exports = {
  parseVsacDetails
};
