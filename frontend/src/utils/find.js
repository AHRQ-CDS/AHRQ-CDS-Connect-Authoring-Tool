/**
 * Finds the closest element that matches the given tag, walking the parent tree until one is found
 * @param {Node} element - The element to start at
 * @param {String} tagName - The tag name of the element to find
 * @return {Node} - The matched element, or null if none is found
 */
export function findClosest(element, tagName) {
  const expectedTagName = tagName.toUpperCase();
  let el = element;
  while (el) {
    if (el.tagName === expectedTagName) {
      return el;
    }

    el = el.parentNode;
  }
  return null;
}

/**
 * Finds the value in the given object at the given path
 * @param {Node} object - The object to search in
 * @param {String} path - The name of the path to find
 */
export function findValueAtPath(object, path) {
  if (typeof path === 'string') {
    path = path.split('.'); // eslint-disable-line no-param-reassign
  }

  if (path.length > 1) {
    if (!path[0].length) {
      path.shift();

      return findValueAtPath(object, path);
    }

    const e = path.shift();
    if (Object.prototype.toString.call(object[e]) === '[object Object]'
      || Object.prototype.toString.call(object[e]) === '[object Array]') {
      return findValueAtPath(object[e], path);
    }

    return findValueAtPath({}, path);
  }

  // Probably at the root
  if (object[path[0]] === undefined || object[path[0]].length === 0) {
    return object;
  }

  return object[path[0]];
}
