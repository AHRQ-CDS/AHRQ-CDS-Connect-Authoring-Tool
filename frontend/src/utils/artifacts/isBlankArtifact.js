/**
 * Determines if the artifact is blank (meaning there is no meaningful user-entered information).
 * This is used to determine if an artifact should be auto-saved.
 * WARNING: This function may be fragile to changes.  This should be revisited when Redux is used.
 * @param {Object} artifact - the artifact to check for blankness
 * @return {boolean} true if the artifact has no meaningful data, false otherwise
 */
export default function isBlankArtifact(artifact) {
  if (artifact == null) {
    return true;
  }

  // If it has an ID, it is pre-existing and considered non-blank
  if (artifact._id) {
    return false;
  }
  // If it has a non-default name or version, it is NOT blank
  if (artifact.name !== 'Untitled Artifact' || artifact.version !== '1') {
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
    if (r.grade !== 'A' || r.text !== '' || r.rationale !== '' || r.comment !== '' || r.subpopulations.length > 1) {
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
  if (artifact.parameters.length > 0) {
    return false;
  }
  // If the error statement has an else clause, it is NOT blank
  if (artifact.errorStatement.elseClause) {
    return false;
  }
  // If it has more than one error statement (else if), it is NOT blank
  if (artifact.errorStatement.ifThenClauses.length > 1) {
    return false;
  }
  // If it has exactly one error statement, check if it is blank
  if (artifact.errorStatement.ifThenClauses.length === 1) {
    const firstIfThenClause = artifact.errorStatement.ifThenClauses[0];
    if (firstIfThenClause.statements.length > 0 || firstIfThenClause.thenClause !== '') {
      return false;
    }
    const firstIfCondition = firstIfThenClause.ifCondition;
    if (firstIfCondition.label !== null || firstIfCondition.value !== null) {
      return false;
    }
  }
  // If we safely made it here, it is BLANK!
  return true;
}
