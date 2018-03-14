import _ from 'lodash';
import ConjunctionGroup from '../../components/builder/ConjunctionGroup';
import TemplateInstance from '../../components/builder/TemplateInstance';
import StringParameter from '../../components/builder/parameters/StringParameter';
import { fullRenderComponent, shallowRenderComponent, createTemplateInstance } from '../../utils/test_helpers';
import { instanceTree, elementGroups } from '../../utils/test_fixtures';

let rootConjunction;
let childConjunction;
let shallowConjunction;
let deeperConjunction;
let childConjunctionPath;

const operations = elementGroups.find(g => g.name === 'Operations');
const orTemplate = operations.entries.find(e => e.id === 'Or');
const andTemplate = operations.entries.find(e => e.id === 'And');
const orInstance = createTemplateInstance(orTemplate);

instanceTree.path = '';
instanceTree.childInstances.push(orInstance);

const getAllInstances = jest.fn();
getAllInstances.mockReturnValue(instanceTree.childInstances);

const addInstance = jest.fn();
const editInstance = jest.fn();
const deleteInstance = jest.fn();

const treeName = 'MeetsInclusionCriteria';

const props = {
  root: true,
  treeName,
  instance: instanceTree,
  addInstance,
  editInstance,
  updateInstanceModifiers: jest.fn(),
  deleteInstance,
  getAllInstances,
  templates: elementGroups,
  artifact: {
    [treeName]: { id: 'Or' }
  },
  booleanParameters: [],
  resources: {},
  loadValueSets: jest.fn()
};

beforeEach(() => {
  shallowConjunction = shallowRenderComponent(ConjunctionGroup, props);
  rootConjunction = fullRenderComponent(ConjunctionGroup, props);
  childConjunction = rootConjunction.find(ConjunctionGroup).at(1); // The 'Or' instance pushed into tree above
  childConjunctionPath = childConjunction.node.getPath();
});

afterEach(() => {
  addInstance.mockClear();
  editInstance.mockClear();
  deleteInstance.mockClear();
});

test('has correct base class', () => {
  rootConjunction.hasClass('conjunction-group');
});

test('root level returns empty path', () => {
  expect(rootConjunction.node.getPath()).toEqual('');
});

test('child level returns correct path', () => {
  expect(childConjunctionPath).toEqual('.childInstances.2');
});

test('applies correct nesting class', () => {
  expect(rootConjunction.node.getNestingClassName()).toEqual('');
  expect(childConjunction.node.getNestingClassName()).toEqual('conjunction-group--odd');
});

test('adds children at correct tree position', () => {
  rootConjunction.node.addChild(orTemplate);

  let argument = addInstance.mock.calls[0];

  // Unique ID generation tested in TemplateInstance.test.js
  // Make them the same to easily compare whilst avoiding React warning
  argument[1].uniqueId = orInstance.uniqueId;

  expect(addInstance).lastCalledWith(rootConjunction.props().treeName, orInstance, '');

  childConjunction.node.addChild(orTemplate);
  argument = addInstance.mock.calls[1];
  argument[1].uniqueId = orInstance.uniqueId;

  expect(addInstance).lastCalledWith(rootConjunction.props().treeName, orInstance, childConjunctionPath);
});

test('can delete group', () => {
  childConjunction.find('.conjunction-group__button-bar button').first().simulate('click');

  expect(deleteInstance).toHaveBeenCalledWith(treeName, childConjunctionPath, []);
});

test('edits own type', () => {
  const orType = rootConjunction.node.types.find(type => type.id === 'Or');
  const typeSelect = rootConjunction.find('.conjunction-group__conjunction-select').at(0);
  typeSelect.find('.Select-control').at(0).simulate('mouseDown', { button: 0 });
  typeSelect.find('.Select-option').at(1).simulate('mouseDown', { button: 0 }); // Change to 'Or' type

  expect(editInstance).toHaveBeenCalled();
  expect(editInstance).lastCalledWith(rootConjunction.props().treeName, orType, '', true);
});

test('edits own name', () => {
  const newName = 'new name';
  const nameParamater = childConjunction.find(StringParameter);

  nameParamater.find('input').simulate('change', { target: { name: 'element_name', value: newName } });

  expect(editInstance).lastCalledWith(
    rootConjunction.props().treeName,
    { element_name: newName },
    childConjunctionPath,
    false
  );
});

test('can\'t indent or outdent root group', () => {
  expect(shallowConjunction.find('.indent-outdent-container')).toHaveLength(0);
});

test('can indent a child group', () => {
  childConjunction.find('button[aria-label="indent"]').simulate('click');

  const instance = createTemplateInstance(andTemplate, [childConjunction.node.props.instance]);
  const path = childConjunctionPath.split('.').slice(0, -2).join('.');
  const index = Number(childConjunctionPath.split('.').pop());

  delete instance.uniqueId;
  delete deleteInstance.mock.calls[0][2][0].instance.uniqueId;

  expect(deleteInstance).toHaveBeenCalledWith(treeName, childConjunctionPath, [{ instance, path, index }]);
});

test('can outdent a child group', () => {
  childConjunction.find('button[aria-label="outdent"]').simulate('click');

  expect(deleteInstance).toHaveBeenCalledWith(treeName, childConjunctionPath, []);
});

describe('for deeper nested conjunction groups', () => {
  beforeEach(() => {
    const ageInstance = createTemplateInstance(elementGroups[0].entries[0]);
    const deeperOr = _.cloneDeep(orInstance);
    deeperOr.childInstances = [ageInstance];
    const deeperTree = _.cloneDeep(instanceTree);
    deeperTree.childInstances = [deeperOr];
    const deeperProps = _.cloneDeep(props);
    deeperProps.instance = deeperTree;
    deeperConjunction = fullRenderComponent(ConjunctionGroup, deeperProps);
    childConjunction = deeperConjunction.find(ConjunctionGroup).at(1);
  });

  // TODO: All the following should really verify what they were called with as well

  test('can indent a child group', () => {
    childConjunction.find('button[aria-label="indent"]').at(0).simulate('click');

    expect(deleteInstance).toHaveBeenCalled();
  });

  test('can outdent a child group', () => {
    childConjunction.find('button[aria-label="outdent"]').at(0).simulate('click');

    expect(deleteInstance).toHaveBeenCalled();
  });

  test('can indent a child TemplateInstance', () => {
    deeperConjunction
      .find(TemplateInstance)
      .first()
      .find('button[aria-label="indent"]')
      .first()
      .simulate('click');

    expect(deleteInstance).toHaveBeenCalled();
  });

  test('can outdent a child TemplateInstance', () => {
    deeperConjunction
      .find(TemplateInstance)
      .first()
      .find('button[aria-label="outdent"]')
      .first()
      .simulate('click');

    expect(deleteInstance).toHaveBeenCalled();
  });
});
