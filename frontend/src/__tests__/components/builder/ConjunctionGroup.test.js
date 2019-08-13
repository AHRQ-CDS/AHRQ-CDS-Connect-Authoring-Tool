import _ from 'lodash';
import ConjunctionGroup from '../../../components/builder/ConjunctionGroup';
import TemplateInstance from '../../../components/builder/TemplateInstance';
import StringField from '../../../components/builder/fields/StringField';
import { fullRenderComponent, shallowRenderComponent, createTemplateInstance, fullRenderComponentOnBody }
  from '../../../utils/test_helpers';
import { instanceTree, elementGroups } from '../../../utils/test_fixtures';

let rootConjunction;
let childConjunction;
let shallowConjunction;
let deeperConjunction;
let childConjunctionPath;
let disabledConjunction;
let disabledChildConjunction;

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
  addInstance,
  artifact: { [treeName]: { id: 'Or' } },
  deleteInstance,
  editInstance,
  externalCqlList: [],
  getAllInstances,
  getAllInstancesInAllTrees: jest.fn(),
  getVSDetails: jest.fn(),
  instance: instanceTree,
  instanceNames: [],
  isRetrievingDetails: false,
  isSearchingVSAC: false,
  loadExternalCqlList: jest.fn(),
  loadValueSets: jest.fn(),
  loginVSACUser: jest.fn(),
  parameters: [],
  baseElements: [],
  root: true,
  searchVSACByKeyword: jest.fn(),
  setVSACAuthStatus: jest.fn(),
  templates: elementGroups,
  treeName,
  updateInstanceModifiers: jest.fn(),
  vsacDetailsCodes: [],
  vsacSearchCount: 0,
  vsacSearchResults: [],
  vsacStatus: '',
  vsacStatusText: '',
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
  rootConjunction.hasClass('card-group');
});

test('root level returns empty path', () => {
  expect(rootConjunction.node.getPath()).toEqual('');
});

test('child level returns correct path', () => {
  expect(childConjunctionPath).toEqual('.childInstances.2');
});

test('applies correct nesting class', () => {
  expect(rootConjunction.node.getNestingClassName()).toEqual('card-group__top');
  expect(childConjunction.node.getNestingClassName()).toEqual('card-group__odd');
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
  childConjunction.find('.card-group__buttons button').first().simulate('click');

  expect(deleteInstance).toHaveBeenCalledWith(treeName, childConjunctionPath, []);
});

test('edits own type', () => {
  const orType = rootConjunction.node.types.find(type => type.id === 'Or');
  const typeSelect = rootConjunction.find('.card-group__conjunction-select').at(0);
  typeSelect.find('.Select-control').at(0).simulate('mouseDown', { button: 0 });
  typeSelect.find('.Select-option').at(1).simulate('mouseDown', { button: 0 }); // Change to 'Or' type

  expect(editInstance).toHaveBeenCalled();
  expect(editInstance).lastCalledWith(rootConjunction.props().treeName, orType, '', true);
});

test('edits own name', () => {
  const newName = 'new name';
  const nameField = childConjunction.find(StringField);

  nameField.find('input').simulate('change', { target: { name: 'element_name', value: newName } });

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

test('has an expression phrase', () => {
  const childGroupProps = _.cloneDeep(props);
  const childGroupInstanceTree = _.cloneDeep(instanceTree);
  childGroupInstanceTree.childInstances.push(_.cloneDeep(instanceTree));
  childGroupProps.instance = childGroupInstanceTree;
  const childGroupConjunction = fullRenderComponentOnBody(ConjunctionGroup, childGroupProps);
  expect(childGroupConjunction.find('.expression__group')).toHaveLength(1);
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
    deeperConjunction = fullRenderComponentOnBody(ConjunctionGroup, deeperProps);
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

describe('conjunctions that are in base elements in use', () => {
  beforeEach(() => {
    const disableElementProps = _.cloneDeep(props);
    disableElementProps.disableElement = true;
    disabledConjunction = fullRenderComponentOnBody(ConjunctionGroup, disableElementProps);
    disabledChildConjunction = disabledConjunction.find(ConjunctionGroup).at(1);
  });

  test('cannot delete main or nested conjunctions', () => {
    expect(disabledConjunction.props().disableElement).toBeTruthy();

    const deleteSpy = jest.spyOn(disabledConjunction.instance(), 'deleteInstance');
    const propsDeleteSpy = jest.spyOn(disabledChildConjunction.props(), 'deleteInstance');
    disabledConjunction.update();
    const deleteButton = disabledConjunction.find('.card-group__buttons .element__deletebutton');

    // Deleting calls the CG's delete function, but not the function passed on props to actually delete it
    disabledConjunction.instance().deleteInstance();
    expect(deleteSpy).toBeCalled();
    expect(propsDeleteSpy).not.toBeCalled();
    expect(deleteButton.hasClass('disabled')).toBeTruthy();

    deleteSpy.mockClear();
    propsDeleteSpy.mockClear();
  });

  test('cannot indent or outdent nested conjunctions', () => {
    const indentButton = disabledChildConjunction.find('button[aria-label="indent"]');
    const outdentButton = disabledChildConjunction.find('button[aria-label="outdent"]');

    indentButton.simulate('click');
    expect(deleteInstance).not.toBeCalled();
    outdentButton.simulate('click');
    expect(deleteInstance).not.toBeCalled();
  });
});
