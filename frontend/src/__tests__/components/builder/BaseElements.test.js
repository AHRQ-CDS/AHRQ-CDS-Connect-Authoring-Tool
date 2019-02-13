import BaseElements from '../../../components/builder/BaseElements';
import TemplateInstance from '../../../components/builder/TemplateInstance';
import ConjunctionGroup from '../../../components/builder/ConjunctionGroup';
import ElementSelect from '../../../components/builder/ElementSelect';
import ListGroup from '../../../components/builder/ListGroup';
import { shallowRenderComponent, fullRenderComponentOnBody } from '../../../utils/test_helpers';
import { elementGroups, genericBaseElementInstance, genericBaseElementListInstance }
  from '../../../utils/test_fixtures';

let component;
let listBaseElementComponent;

const getAllInstances = jest.fn();
getAllInstances.mockReturnValue(genericBaseElementListInstance.childInstances);

beforeEach(() => {
  component = shallowRenderComponent(BaseElements, {
    treeName: 'baseElements',
    loadValueSets: jest.fn(),
    templates: [],
    instance: { baseElements: [genericBaseElementInstance, genericBaseElementInstance] },
    addBaseElement: jest.fn(),
    editInstance: jest.fn(),
    updateInstanceModifiers: jest.fn(),
    deleteInstance: jest.fn(),
    instanceNames: [],
    getAllInstancesInAllTrees: jest.fn(() => []),
    parameters: [],
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
  });

  listBaseElementComponent = fullRenderComponentOnBody(BaseElements, {
    treeName: 'baseElements',
    loadValueSets: jest.fn(),
    templates: elementGroups,
    instance: { baseElements: [genericBaseElementListInstance] },
    addBaseElement: jest.fn(),
    getAllInstances,
    getAllInstancesInAllTrees: jest.fn(() => []),
    editInstance: jest.fn(),
    updateInstanceModifiers: jest.fn(),
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
  });
});

test('Base Elements renders separate template instances', () => {
  expect(component.find(TemplateInstance)).toHaveLength(2);
  expect(component.find(ConjunctionGroup)).toHaveLength(0);
});

test('Base Elements can render a list group with conjunction and a template instance inside', () => {
  const listGroupComponent = listBaseElementComponent.find(ListGroup);
  expect(listGroupComponent).toHaveLength(1);

  // ListGroup renders a ConjunctionGroup
  const conjunctionInListComponent = listGroupComponent.find(ConjunctionGroup);
  expect(conjunctionInListComponent).toHaveLength(1);

  // ConjunctionGroup renders a TemplateInstance and an ElementSelect
  const templateInstanceComponent = conjunctionInListComponent.find(TemplateInstance);
  expect(templateInstanceComponent).toHaveLength(1);

  const elementSelect = conjunctionInListComponent.find(ElementSelect);
  expect(elementSelect).toHaveLength(1);

  // The Type options in the Conjunction group match the List options, not the usual operations
  const conjunctionSelection = conjunctionInListComponent.find('.card-group__conjunction-select');
  conjunctionSelection.find('.Select-control').simulate('mouseDown', { button: 0 });
  const typeOptions = conjunctionSelection.find('.Select-option');
  const listOperations = elementGroups[3].entries;
  expect(typeOptions).toHaveLength(2);
  expect(typeOptions.at(0).text()).toEqual(listOperations[0].name);
  expect(typeOptions.at(1).text()).toEqual(listOperations[1].name);
});
