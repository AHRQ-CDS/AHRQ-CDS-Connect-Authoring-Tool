/**
 * Extracts just the oid from a urn, url, or oid. If it is not a valid urn or VSAC URL,
 * it is assumed to be an oid and returned as-is.
 * @param {string} id - the urn, url, or oid
 * @returns {string} the oid
 */
function extractOid(id) {
  if (id == null) return [];

  // first check for VSAC FHIR URL (ideally https is preferred but support http just in case)
  // if there is a | at the end, it indicates that a version string follows
  let m = id.match(/^https?:\/\/cts\.nlm\.nih\.gov\/fhir\/ValueSet\/([^|]+)(\|(.+))?$/);
  if (m) return m[3] == null ? [m[1]] : [m[1], m[3]];

  // then check for urn:oid
  m = id.match(/^urn:oid:(.+)$/);
  if (m) return [m[1]];

  // finally just return as-is
  return [id];
}

export default extractOid;
