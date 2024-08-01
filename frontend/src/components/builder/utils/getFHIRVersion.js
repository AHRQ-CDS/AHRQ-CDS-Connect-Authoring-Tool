import { elementsInclude } from './getAllElements';
import getAllElements from './getAllElements';

// Get the FHIR version of the artifact. '' indicates any FHIR version is allowed.
// NOTE: when external CQL, custom modifiers, or suggestions are used, the FHIR version is already
// calculated and set on the artifact, so this function can just return what has been set.
export const getFHIRVersion = (artifact, externalCqlList, artifactId) => {
  const elements = getAllElements(artifact);
  const hasExternalCql = externalCqlList && externalCqlList.some(lib => lib.linkedArtifactId === artifactId);
  const hasServiceRequest = elementsInclude(elements, 'Service Request');
  const hasCustomModifier = elements.some(({ modifiers }) => modifiers?.some(({ where }) => where));
  const hasRecommendationSuggestion = artifact.recommendations.some(rec => rec.suggestions.length > 0);
  if (hasExternalCql || hasCustomModifier || hasRecommendationSuggestion) return artifact.fhirVersion;

  if (hasServiceRequest) {
    return '4.0.x';
  }
  return '';
};
