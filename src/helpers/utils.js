const sortDifference = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export function filterUnsuppressed(items) {
  return items.filter(item => !item.suppress);
}

export function sortAlphabeticallyByKey(key, key2 = undefined) {
  return function (a, b) {
    if (a[key] === b[key]) {
      if (key2) {
        return sortDifference(a[key2], b[key2]);
      }
      return 0;
    }
    return sortDifference(a[key], b[key]);
  };
}
