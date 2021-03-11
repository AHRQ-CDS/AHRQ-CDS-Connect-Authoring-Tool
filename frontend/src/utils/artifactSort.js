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
  
  export function sortByVersion(a, b) {
    const digits_a = a.version.split(".").map((strNumeral) => parseInt(strNumeral));
    const digits_b = b.version.split(".").map((strNumeral) => parseInt(strNumeral));
    if (digits_a.length !== 3 && digits_b.length === 3)
      return 1;
    else if (digits_a.length === 3 && digits_b.length !== 3)
      return -1;
  
    for (let digitIndex = 0; digitIndex < 3; digitIndex++) {
      if (digits_a[digitIndex] > digits_b[digitIndex])
        return -1;
      else if (digits_a[digitIndex] === digits_b[digitIndex])
        continue;
      else
        return 1;
    }
    return 0;
  }
  
  export function sortByName(a, b) {
    return a.name.localeCompare(b.name);
  }