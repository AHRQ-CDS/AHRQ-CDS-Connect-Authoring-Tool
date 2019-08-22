import _ from 'lodash';
import ListGroup from '../../../components/builder/ListGroup';
import { shallowRenderComponent, createTemplateInstance } from '../../../utils/test_helpers';
import { elementGroups, genericBaseElementUseInstance, genericBaseElementListInstance }
  from '../../../utils/test_fixtures';
import { getFieldWithId } from '../../../utils/instances';

const genericBaseElementListTemplateInstance = createTemplateInstance(genericBaseElementListInstance);
const genericBaseElementUseTemplateInstance = createTemplateInstance(genericBaseElementUseInstance);

let component;

const getAllInstances = jest.fn();
getAllInstances.mockReturnValue(genericBaseElementListInstance.childInstances);

const updateBaseElementLists = jest.fn();

const props = {
  treeName: 'baseElements',
  loadValueSets: jest.fn(),
  templates: elementGroups,
  artifact: { baseElements: [genericBaseElementListTemplateInstance] },
  instance: genericBaseElementListTemplateInstance,
  index: 0,
  addBaseElement: jest.fn(),
  getAllInstances,
  getAllInstancesInAllTrees: jest.fn(() => []),
  editInstance: jest.fn(),
  updateInstanceModifiers: jest.fn(),
  updateBaseElementLists,
  deleteInstance: jest.fn(),
  instanceNames: [],
  parameters: [],
  baseElements: [],
  loginVSACUser: jest.fn(),
  setVSACAuthStatus: jest.fn(),
  searchVSACByKeyword: jest.fn(),
  isSearchingVSAC: false,
  vsacSearchResults: [],
  vsacSearchCount: 0,
  getVSDetails: jest.fn(),
  isRetrievingDetails: false,
  vsacDetailsCodes: [],
  vsacFHIRCredentials: { username: 'name', password: 'pass' },
  isValidatingCode: false,
  validateCode: jest.fn(),
  resetCodeValidation: jest.fn(),
  validateReturnType: false
};

test('List Groups cannot be deleted when in use', () => {
  component = shallowRenderComponent(ListGroup, { ...props });
  expect(component.instance().isBaseElementListUsed(genericBaseElementListInstance)).toBeTruthy();

  const deleteSpy = jest.spyOn(component.instance(), 'deleteBaseElementList');
  const updateFunc = updateBaseElementLists;

  const deleteButton = component.find(`#deletebutton-${genericBaseElementListTemplateInstance.uniqueId}`);
  deleteButton.simulate('click');
  expect(deleteSpy).toBeCalled();
  expect(updateFunc).not.toBeCalled();
});

test('List Groups can be deleted when not in use', () => {
  const noUseProps = _.cloneDeep(props);
  noUseProps.instance.usedBy = [];

  component = shallowRenderComponent(ListGroup, { ...noUseProps });

  const deleteSpy = jest.spyOn(component.instance(), 'deleteBaseElementList');
  const updateFunc = updateBaseElementLists;

  const deleteButton = component.find(`#deletebutton-${genericBaseElementListTemplateInstance.uniqueId}`);
  deleteButton.simulate('click');
  expect(deleteSpy).toBeCalled();
  expect(updateFunc).toBeCalled();
});

test('Return Types of Union and Intersect are correctly updated', () => {
  component = shallowRenderComponent(ListGroup, { ...props });
  const checkReturnTypeCompatibility = component.instance().checkReturnTypeCompatibility;

  const observations = checkReturnTypeCompatibility('list_of_observations', 'observation');
  expect(observations).toEqual('list_of_observations');

  const conditions = checkReturnTypeCompatibility('list_of_conditions', 'condition');
  expect(conditions).toEqual('list_of_conditions');

  const obsAndCond = checkReturnTypeCompatibility('list_of_observations', 'list_of_conditions');
  expect(obsAndCond).toEqual('list_of_any');

  const anyAndObs = checkReturnTypeCompatibility('list_of_any', 'list_of_observations');
  expect(anyAndObs).toEqual('list_of_any');

  const boolean = checkReturnTypeCompatibility('list_of_booleans', 'boolean');
  expect(boolean).toEqual('list_of_booleans');
});

test('Return Types of And and Or are correctly updated', () => {
  component = shallowRenderComponent(ListGroup, { ...props });
  const checkReturnTypeCompatibility = component.instance().checkAndOrReturnTypeCompatibility;

  const boolAndBool = checkReturnTypeCompatibility('boolean', 'boolean');
  expect(boolAndBool).toEqual('boolean');

  const observations = checkReturnTypeCompatibility('list_of_observations', 'observation');
  expect(observations).toEqual('invalid');

  const conditions = checkReturnTypeCompatibility('list_of_conditions', 'list_of_conditions');
  expect(conditions).toEqual('invalid');

  const conditionsAndBool = checkReturnTypeCompatibility('list_of_conditions', 'boolean');
  expect(conditionsAndBool).toEqual('invalid');

  const boolAndNone = checkReturnTypeCompatibility('boolean', 'none');
  expect(boolAndNone).toEqual('boolean');

  const noneAndBool = checkReturnTypeCompatibility('none', 'boolean');
  expect(noneAndBool).toEqual('boolean');

  const boolAndInvalid = checkReturnTypeCompatibility('boolean', 'invalid');
  expect(boolAndInvalid).toEqual('invalid');
});

test('No warnings on base element lists when in use and unmodified', () => {
  const inUseProps = _.cloneDeep(props);
  const nameField = getFieldWithId(inUseProps.instance.fields, 'element_name');
  inUseProps.instanceNames = [
    { id: 'testId1', name: 'UnionListName' },
    { id: inUseProps.instance.uniqueId, name: nameField.value }
  ];
  component = shallowRenderComponent(ListGroup, { ...inUseProps });
  const warningDiv = component.find('.warning');
  expect(warningDiv).toHaveLength(0);
});

test('Base Element specific warning on base element list when in use and modified', () => {
  const baseElementListProps = _.cloneDeep(props);
  const modifiedUse = _.cloneDeep(genericBaseElementUseTemplateInstance);
  const modifiedUseNameField = getFieldWithId(modifiedUse.fields, 'element_name');
  modifiedUse.modifiers = [
    {
      id: 'BooleanNot',
      name: 'Not',
      inputTypes: ['boolean'],
      returnType: 'boolean',
      cqlTemplate: 'BaseModifier',
      cqlLibraryFunction: 'not'
    }
  ];
  modifiedUseNameField.value = 'UnionListName';
  modifiedUse.uniqueId = 'testId1';
  baseElementListProps.instanceNames = [
    { id: baseElementListProps.instance.uniqueId, name: 'UnionListName' },
    { id: modifiedUse.uniqueId, name: 'UnionListName' }
  ];
  baseElementListProps.getAllInstancesInAllTrees = jest.fn(() => [
    genericBaseElementListTemplateInstance,
    modifiedUse
  ]);

  component = shallowRenderComponent(ListGroup, { ...baseElementListProps });
  const warningDiv = component.find('.warning');
  expect(warningDiv).toHaveLength(1);
  expect(warningDiv.text())
    .toEqual('Warning: One or more uses of this Base Element have changed. Choose another name.');
});
