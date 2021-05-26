import { useMemo } from 'react';
import { parseISO } from 'date-fns';

function getInitialValue(artifactEditing, valueName, defaultValue, transformer = x => x) {
  if (!artifactEditing || artifactEditing[valueName] == null) return defaultValue;
  return transformer(artifactEditing[valueName]);
}

function stringToDateTransform(value) {
  if (value == null) return value;
  return parseISO(value);
}

const useInitialValues = artifactEditing =>
  useMemo(
    () => ({
      name: getInitialValue(artifactEditing, 'name', ''),
      version: getInitialValue(artifactEditing, 'version', ''),
      description: getInitialValue(artifactEditing, 'description', ''),
      url: getInitialValue(artifactEditing, 'url', ''),
      status: getInitialValue(artifactEditing, 'status', null),
      experimental: getInitialValue(artifactEditing, 'experimental', null, value => `${value}`),
      publisher: getInitialValue(artifactEditing, 'publisher', ''),
      context: getInitialValue(artifactEditing, 'context', []),
      purpose: getInitialValue(artifactEditing, 'purpose', ''),
      usage: getInitialValue(artifactEditing, 'usage', ''),
      strengthOfRecommendation: getInitialValue(artifactEditing, 'strengthOfRecommendation', {
        strengthOfRecommendation: null,
        code: '',
        system: '',
        other: ''
      }),
      qualityOfEvidence: getInitialValue(artifactEditing, 'qualityOfEvidence', {
        qualityOfEvidence: null,
        code: '',
        system: '',
        other: ''
      }),
      copyright: getInitialValue(artifactEditing, 'copyright', ''),
      approvalDate: getInitialValue(artifactEditing, 'approvalDate', null, stringToDateTransform),
      lastReviewDate: getInitialValue(artifactEditing, 'lastReviewDate', null, stringToDateTransform),
      effectivePeriod: getInitialValue(
        artifactEditing,
        'effectivePeriod',
        { start: null, end: null },
        ({ start, end }) => ({ start: stringToDateTransform(start), end: stringToDateTransform(end) })
      ),
      topic: getInitialValue(artifactEditing, 'topic', []),
      author: getInitialValue(artifactEditing, 'author', []),
      reviewer: getInitialValue(artifactEditing, 'reviewer', []),
      endorser: getInitialValue(artifactEditing, 'endorser', []),
      relatedArtifact: getInitialValue(artifactEditing, 'relatedArtifact', [])
    }),
    [artifactEditing]
  );

export default useInitialValues;
