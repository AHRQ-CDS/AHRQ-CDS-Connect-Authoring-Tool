import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const testMode = process.env.NODE_ENV === 'test';

/**
 * Returns an instance with the given template and children and a unique id.
 * @param {Node} template - The event template to clone
 * @param {Node} children - Child instances to add to template instance
 */
export default function createTemplateInstance(template, children) {
  // create an instance (copy) of the given template (ex. AND template)
  const instance = _.cloneDeep(template);

  // add a unique id to the instance
  if (testMode) {
    // TODO: find a better way to implement this
    instance.uniqueId = `${instance.id}-TEST-1`;
  } else {
    instance.uniqueId = `${instance.id}-${uuidv4()}`;
  }

  // if the template has a conjunction, add the given children or an empty array
  if (template.conjunction) {
    instance.childInstances = children || [];
  }

  return instance;
}
