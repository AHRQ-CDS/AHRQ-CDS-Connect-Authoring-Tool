import _ from 'lodash';

export function createTemplateInstance(template, children = undefined) {
  const instance = _.cloneDeep(template);
  instance.uniqueId = _.uniqueId(instance.id);

  if (template.conjunction) {
    instance.childInstances = children || [];
  }

  return instance;
}
