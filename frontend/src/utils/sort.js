import { getPatientFirstName } from 'utils/patients';

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
  const aName = getPatientFirstName(a);
  const bName = getPatientFirstName(b);

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

export function sortByDateEdited(a, b) {
  return sortMostRecent(a, b);
}

export function sortByDateCreated(a, b) {
  if (a.createdAt > b.createdAt || (a.createdAt && !b.createdAt)) {
    return -1;
  } else if (a.createdAt < b.createdAt || (!a.createdAt && b.createdAt)) {
    return 1;
  }
  return 0;
}

export function sortByName(a, b) {
  return a.name.localeCompare(b.name);
}

export function sortByVersion(a, b) {
  const aprRegex = /\b\d{1}\.\d{1}\.\d{1}\b/;
  if (a.version.match(aprRegex) && b.version.match(aprRegex)) {
    const digitsA = a.version.split('.').map(strNumeral => parseInt(strNumeral));
    const digitsB = b.version.split('.').map(strNumeral => parseInt(strNumeral));

    for (let digitIndex = 0; digitIndex < 3; digitIndex++) {
      if (digitsA[digitIndex] > digitsB[digitIndex]) return -1;
      else if (digitsA[digitIndex] === digitsB[digitIndex]) continue;
      else return 1;
    }
    return 0;
  } else if (a.version.match(aprRegex) && !b.version.match(aprRegex)) {
    return -1;
  } else if (!a.version.match(aprRegex) && b.version.match(aprRegex)) {
    return 1;
  } else if (a.version === '' && b.version !== '') {
    return 1;
  } else if (a.version !== '' && b.version === '') {
    return -1;
  } else {
    return Math.sign(a.version.localeCompare(b.version, 'en'));
  }
}
