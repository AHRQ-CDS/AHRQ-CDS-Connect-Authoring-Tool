import ListGroup from '../../../components/builder/ListGroup';
import { shallowRenderComponent, createTemplateInstance } from '../../../utils/test_helpers';
import { elementGroups, genericBaseElementListInstance } from '../../../utils/test_fixtures';

const genericBaseElementListTemplateInstance = createTemplateInstance(genericBaseElementListInstance);

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
  editInstance: jest.fn(),
  updateInstanceModifiers: jest.fn(),
  updateBaseElementLists,
  deleteInstance: jest.fn(),
  instanceNames: [],
  parameters: [],
  baseElements: [],
  loginVSACUser: jest.fn(),
  setVSACAuthStatus: jest.fn(),
  timeLastAuthenticated: new Date(),
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
  const noUseProps = { ...props };
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
