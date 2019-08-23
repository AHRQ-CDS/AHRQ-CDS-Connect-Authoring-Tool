import _ from 'lodash';

const sortDifference = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export function sortAlphabeticallyByKey(key, key2 = undefined) {
  return function sortFunc(a, b) {
    if (a[key] === b[key]) {
      if (key2) {
        return sortDifference(a[key2], b[key2]);
      }
      return 0;
    }
    return sortDifference(a[key], b[key]);
  };
}

export function sortAlphabeticallyByPatientName(a, b) {
  const aName = _.chain(a)
    .get('patient.entry')
    .find({ resource: { resourceType: 'Patient' } })
    .get('resource.name[0].given')
    .value() || 'family_placeholder';
  const bName = _.chain(b)
    .get('patient.entry')
    .find({ resource: { resourceType: 'Patient' } })
    .get('resource.name[0].given')
    .value() || 'family_placeholder';

  if (aName > bName || (aName && !bName)) {
    return 1;
  } else if (aName < bName || (!aName && bName)) {
    return -1;
  }
  return 0;
}

export function sortMostRecent(a, b) {
  if (a.updatedAt > b.updatedAt || (a.updatedAt && !b.updatedAt)) {
    return -1;
  } else if (a.updatedAt < b.updatedAt || (!a.updatedAt && b.updatedAt)) {
    return 1;
  }
  return 0;
}
