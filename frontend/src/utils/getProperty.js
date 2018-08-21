export default function getProperty(object, propertyName) {
  const parts = propertyName.split('.');

  let property = object;
  for (let i = 0; property && i < parts.length; ++i) {
    property = parts[i] === 'firstObject' ? property[0] : property[parts[i]];
  }

  return property;
}
