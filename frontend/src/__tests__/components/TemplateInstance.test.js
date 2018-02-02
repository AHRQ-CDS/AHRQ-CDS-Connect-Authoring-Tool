import { createTemplateInstance } from '../../utils/test_helpers';
import { instanceTree } from '../../utils/test_fixtures';

const originalInstance = instanceTree.childInstances[0];

test('creating a new template instance clones the correct instance', () => {
  const newInstance = createTemplateInstance(originalInstance);
  delete originalInstance.uniqueId;
  delete newInstance.uniqueId;

  expect(newInstance).toEqual(originalInstance);
});

test('creating a new template instance generates unique ID from instance ID name', () => {
  const newInstance = createTemplateInstance(originalInstance);

  expect(newInstance.uniqueId).toMatch(originalInstance.id); // a.k.a. it includes the id prop
});

test('creating a new template instance adds a unique ID', () => {
  const newInstance1 = createTemplateInstance(originalInstance);
  const newInstance2 = createTemplateInstance(originalInstance);

  expect(newInstance1.uniqueId).not.toEqual(newInstance2.uniqueId);
});
