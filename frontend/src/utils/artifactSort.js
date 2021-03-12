import { sortMostRecent } from './sort';

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
  const apr_regex = /\b\d{1}\.\d{1}\.\d{1}\b/;
  if (a.version.match(apr_regex) && b.version.match(apr_regex)) {
    const digits_a = a.version.split('.').map(strNumeral => parseInt(strNumeral));
    const digits_b = b.version.split('.').map(strNumeral => parseInt(strNumeral));

    for (let digitIndex = 0; digitIndex < 3; digitIndex++) {
      if (digits_a[digitIndex] > digits_b[digitIndex]) return -1;
      else if (digits_a[digitIndex] === digits_b[digitIndex]) continue;
      else return 1;
    }
    return 0;
  } else if (a.version.match(apr_regex) && !b.version.match(apr_regex)) {
    return -1;
  } else if (!a.version.match(apr_regex) && b.version.match(apr_regex)) {
    return 1;   
  } else if (a.version === "" && b.version !== "") {
      return 1;
  } else if (a.version !== "" && b.version === "") {
      return -1;
  } else {
    return -1 * a.name.localeCompare(b.name);
  }
}
