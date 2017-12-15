import _ from 'lodash';

let uniqueIdCounter = 1;

/**
 * Returns an instance with the given template and children and a unique id.
 * @param {Node} template - The event template to clone
 * @param {Node} children - Child instances to add to template instance
 */
export default function createTemplateInstance(template, children) {
  // create an instance (copy) of the given template (ex. AND template)
  const instance = _.cloneDeep(template);

  // add a unique id to the instance
  instance.uniqueId = _.uniqueId(`${instance.id}-${++uniqueIdCounter}`); // eslint-disable-line no-plusplus

  // if the template has a conjunction, add the given children or an empty array
  if (template.conjunction) {
    instance.childInstances = children || [];
  }

  return instance;
}
