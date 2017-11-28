import _ from 'lodash';

export default function createTemplateInstance(template, children) {
  // create an instance (copy) of the given template (ex. AND template)
  const instance = _.cloneDeep(template);

  // add a unique id to the instance
  instance.uniqueId = _.uniqueId(`${instance.id}-`);

  // if the template has a conjunction, add the given children or an empty array
  if (template.conjunction) {
    instance.childInstances = children || [];
  }

  return instance;
}
