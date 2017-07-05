import ConjunctionGroup from '../components/builder/ConjunctionGroup';
import TemplateInstance, { createTemplateInstance } from '../components/builder/TemplateInstance';
import StringParameter from '../components/builder/parameters/StringParameter';
import { fullRenderComponent, deepState } from '../helpers/test_helpers';
import { instanceTree, elementGroups } from '../helpers/test_fixtures';

let rootConjunction, childConjunction;

const operations = elementGroups.find(g => g.name === 'Operations');
const orTemplate = operations.entries.find(e => e.id === 'Or');
const orInstance = createTemplateInstance(orTemplate);

instanceTree.path = '';
instanceTree.childInstances.push(orInstance);

const getAllInstances = jest.fn();
getAllInstances.mockReturnValue(instanceTree.childInstances);

const addInstance = jest.fn();
const editInstance = jest.fn();

beforeEach(() => {
  rootConjunction = fullRenderComponent(ConjunctionGroup, {
    root: true,
    instance: instanceTree,
    addInstance: addInstance,
    editInstance: editInstance,
    deleteInstance: jest.fn(),
    saveInstance: jest.fn(),
    getAllInstances: getAllInstances,
    showPresets: jest.fn(),
    categories: elementGroups
  });

  childConjunction = rootConjunction.find(ConjunctionGroup).at(1); // The 'Or' instance pushed into tree above
});

test('has correct base class', () => {
  rootConjunction.hasClass('conjunction-group');
});

test('root level returns empty path', () => {
  expect(rootConjunction.node.getPath()).toEqual('');
});

test('child level returns correct path', () => {
  expect(childConjunction.node.getPath()).toEqual('.childInstances.2');
});

test('applies correct nesting class', () => {
  expect(rootConjunction.node.getNestingClassName()).toEqual('');
  expect(childConjunction.node.getNestingClassName()).toEqual('conjunction-group--odd');
});

test('adds children at correct tree position', () => {
  rootConjunction.node.addChild(orTemplate);

  let argument = addInstance.mock.calls[0];
  delete argument[0]['uniqueId']; // Unique ID generation tested in TemplateInstance.test.js
  delete orInstance['uniqueId'];

  expect(addInstance).lastCalledWith(orInstance, '');

  childConjunction.node.addChild(orTemplate);
  argument = addInstance.mock.calls[1];
  delete argument[0]['uniqueId'];

  expect(addInstance).lastCalledWith(orInstance, '.childInstances.2');
});

test('edits own type', () => {
  const orType = rootConjunction.node.types.find(type => type.id === 'Or');
  const typeSelect = rootConjunction.find('.conjunction-group__conjunction-select').at(0);
  typeSelect.find('.Select-control').at(0).simulate('mouseDown', {button: 0});
  typeSelect.find('.Select-option').at(1).simulate('mouseDown', {button: 0}); // Change to 'Or' type

  expect(editInstance).toHaveBeenCalled();
  expect(editInstance).lastCalledWith(orType, '', true);
});

test('edits own name', () => {
  const newName = 'new name';
  const nameParamater = childConjunction.find(StringParameter);

  nameParamater.find('input').simulate('change', { target: { name: 'element_name', value: newName } });

  expect(editInstance).lastCalledWith({ element_name: newName }, '.childInstances.2');
});
