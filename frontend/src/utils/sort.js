import { getPatientLastName } from 'utils/patients';

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
  const aName = getPatientLastName(a);
  const bName = getPatientLastName(b);

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
