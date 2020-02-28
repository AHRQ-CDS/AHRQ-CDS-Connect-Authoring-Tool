import isEmpty from 'lodash/isEmpty';
import lowerFirst from 'lodash/lowerFirst';
import * as parsers from './propertyParsers';

function parseObject(object, propertyPath) {
  if (isEmpty(propertyPath)) {
    return object;
  }

  const parts = propertyPath.split('.');

  let property = object;
  for (let i = 0; property && i < parts.length; ++i) {
    property = parts[i] === 'firstObject' ? property[0] : property[parts[i]];
  }

  return property;
}

export default function getProperty(object, path) {
  const m = /^(([^:]+):)?([^:]+)$/.exec(path);
  if (!m) {
    return '';
  }
  let parser = m[2] || '';
  let property = m[3];

  if (property.endsWith('[x]')) {
    // It's a choice, so we need to find which one is used and then modify the
    // parcer and property appropriately.
    // Running example w/ foo.bar[x] and instance having barDateTime

    // First find the parent (e.g., parent of foo.bar[x] is foo)
    const parent = parseObject(object, property.substr(0, property.lastIndexOf('.')));
    if (!parent || typeof parent !== 'object') {
      return '';
    }
    // Then find the root of the property name (e.g., root of foo.bar[x] is bar)
    const root = property.slice(property.lastIndexOf('.') + 1, property.length - 3);
    // Then find the property in the parent object that starts w/ the root (e.g., barDateTime)
    property = Object.keys(parent).find(k => (new RegExp(`^${root}[A-Z][a-zA-Z]*$`)).test(k));
    if (property == null) {
      return '';
    }
    // The parser type is the part after the root (e.g., DateTime)
    parser = property.slice(root.length);
  }

  const target = parseObject(object, property);
  if (target == null) {
    return '';
  }

  // If there is an identified parser use it, otherwise just stringify the target
  const parserFn = parsers[lowerFirst(parser)];
  if (typeof parserFn === 'function') {
    return parserFn(target);
  }

  return `${target}`;
}
