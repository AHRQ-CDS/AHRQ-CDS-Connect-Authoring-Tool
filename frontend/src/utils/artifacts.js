/**
 * Determines if the artifact is blank (meaning there is no meaningful user-entered information).
 * This is used to determine if an artifact should be auto-saved.
 * WARNING: This function may be fragile to changes.  This should be revisited when Redux is used.
 * @param {Object} artifact - the artifact to check for blankness
 * @return {boolean} true if the artifact has no meaningful data, false otherwise
 */
export default function isBlankArtifact(artifact) {
  // If it has an ID, it is pre-existing and considered non-blank
  if (artifact._id) {
    return false;
  }
  // If it has a non-default name or version, it is NOT blank
  if (artifact.name !== 'Untitled Artifact' || artifact.version !== '1') {
    return false;
  }
  // If the counter is above 4, the user must have entered something somewhere.
  // This is probably the fastest detection of many changes, but is not complete.
  if (artifact.uniqueIdCounter > 4) {
    return false;
  }
  // If it has any inclusion elements, it is NOT blank
  if (artifact.expTreeInclude.childInstances && artifact.expTreeInclude.childInstances.length > 0) {
    return false;
  }
  // If it has any exclusion elements, it is NOT blank
  if (artifact.expTreeInclude.childInstances && artifact.expTreeExclude.childInstances.length > 0) {
    return false;
  }
  // If it has more than one recommendation, it is NOT blank
  if (artifact.recommendations.length > 1) {
    return false;
  }
  // If it has only one recommendation, check if it is a blank recommendation
  if (artifact.recommendations.length === 1) {
    const r = artifact.recommendations[0];
    if (r.grade !== 'A' || r.text !== '' || r.rationale !== '' || r.subpopulations.length > 1) {
      return false;
    }
  }
  // If it has more than three subpopulations, it is not blank
  if (artifact.subpopulations.length > 3) {
    return false;
  }
  // If it has exactly three populations, check if the third is a blank population
  // (The first two populations are always hard-coded and un-editable)
  if (artifact.subpopulations.length === 3) {
    const subpop = artifact.subpopulations[2];
    if (subpop.subpopulationName !== 'Subpopulation 1') {
      return false;
    }
    if (subpop.childInstances.length > 0) {
      return false;
    }
  }
  // If it has any parameters, it is NOT blank
  if (artifact.booleanParameters.length > 0) {
    return false;
  }
  // If the error statement has an else clause, it is NOT blank
  if (artifact.errorStatement.elseClause) {
    return false;
  }
  // If it has more than one error statement (else if), it is NOT blank
  if (artifact.errorStatement.statements.length > 1) {
    return false;
  }
  // If it has exactly one error statement, check if it is blank
  if (artifact.errorStatement.statements.length === 1) {
    const st = artifact.errorStatement.statements[0];
    if (st.child !== null || st.thenClause !== '') {
      return false;
    }
    const c = st.condition;
    if (c.label !== null || c.value !== null) {
      return false;
    }
  }
  // If we safely made it here, it is BLANK!
  return true;
}
