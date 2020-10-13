import pick from 'lodash/pick';

export function stripContextFields(contextFields) {
  return contextFields.map(contextField => {
    const { contextType } = contextField;

    switch (contextType) {
      case 'gender':
        return pick(contextField, ['contextType', 'gender']);
      case 'ageRange':
        return pick(contextField, ['contextType', 'ageRangeMin', 'ageRangeMax', 'ageRangeUnitOfTime']);
      case 'clinicalFocus':
      case 'species':
        return pick(contextField, ['contextType', 'code', 'system']);
      case 'userType':
        return pick(contextField, ['contextType', 'userType']);
      case 'workflowSetting':
        return pick(contextField, ['contextType', 'workflowSetting']);
      case 'workflowTask':
        return pick(contextField, ['contextType', 'workflowTask']);
      case 'clinicalVenue':
        return pick(contextField, ['contextType', 'clinicalVenue']);
      case 'program':
        return pick(contextField, ['contextType', 'program']);
      default:
        return null;
    }
  }).filter(Boolean);
}

export function isCpgComplete(name, values) {
  switch (name) {
    case 'description':
      return Boolean(values.description);
    case 'url':
      return Boolean(values.url);
    case 'status':
      return Boolean(values.status);
    case 'experimental':
      return Boolean(values.experimental);
    case 'publisher':
      return Boolean(values.publisher);
    case 'context':
      if (values.context.length === 0) return false;
      const contextCpgCompletedFields = values.context.map(value => contextCpgComplete(value));
      return contextCpgCompletedFields.every(fieldComplete => fieldComplete);
    case 'purpose':
      return Boolean(values.purpose);
    case 'usage':
      return Boolean(values.usage);
    case 'copyright':
      return Boolean(values.copyright);
    case 'approvalDate':
      return Boolean(values.approvalDate);
    case 'lastReviewDate':
      return Boolean(values.lastReviewDate);
    case 'effectivePeriod':
      return Boolean(values.effectivePeriod.start || values.effectivePeriod.end);
    case 'topic':
      if (values.topic.length === 0) return false;
      return values.topic.every(value => Boolean(value.code && value.system));
    case 'author':
      if (values.author.length === 0) return false;
      return values.author.every(value => Boolean(value.author));
    case 'reviewer':
      if (values.reviewer.length === 0) return false;
      return values.reviewer.every(value => Boolean(value.reviewer));
    case 'endorser':
      if (values.endorser.length === 0) return false;
      return values.endorser.every(value => Boolean(value.endorser));
    case 'relatedArtifact':
      if (values.relatedArtifact.length === 0) return false;
      const relatedArtifactCpgCompletedFields = values.relatedArtifact.map(value => relatedArtifactCpgComplete(value));
      return relatedArtifactCpgCompletedFields.every(fieldComplete => fieldComplete);
    default:
      return false;
  }
}

export function getCpgCompleteCount(values) {
  let cpgTotalCount = 0;
  let cpgCompleteCount = 0;

  Object.keys(values).forEach(valueKey => {
    if (valueKey !== 'name' && valueKey !== 'version') cpgTotalCount += 1;
    if (isCpgComplete(valueKey, values)) cpgCompleteCount += 1;
  });

  return { cpgTotalCount, cpgCompleteCount };
}

function contextCpgComplete(values) {
  switch (values.contextType) {
    case 'gender':
      return Boolean(values.gender);
    case 'ageRange':
      return Boolean((values.ageRangeMin || values.ageRangeMax) && values.ageRangeUnitOfTime);
    case 'clinicalFocus':
    case 'species':
      return Boolean(values.code && values.system);
    case 'userType':
      return Boolean(values.userType);
    case 'workflowSetting':
      return Boolean(values.workflowSetting);
    case 'workflowTask':
      return Boolean(values.workflowTask);
    case 'clinicalVenue':
      return Boolean(values.clinicalVenue);
    case 'program':
      return Boolean(values.program);
    default:
      return false;
  }
}

function relatedArtifactCpgComplete(values) {
  switch (values.relatedArtifactType) {
    case 'citation':
      return Boolean(values.description && values.url && values.citation);
    default:
      return false;
  }
}
