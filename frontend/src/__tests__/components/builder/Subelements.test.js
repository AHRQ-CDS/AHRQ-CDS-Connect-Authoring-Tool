import BaseElements from '../../../components/builder/Subelements';
import TemplateInstance from '../../../components/builder/TemplateInstance';
import ConjunctionGroup from '../../../components/builder/ConjunctionGroup';
import { shallowRenderComponent } from '../../../utils/test_helpers';
import { genericBaseElementInstance } from '../../../utils/test_fixtures';

let component;

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
    parameters: [],
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
  });
});

test('Base Elements renders separate template instances', () => {
  expect(component.find(TemplateInstance)).toHaveLength(2);
  expect(component.find(ConjunctionGroup)).toHaveLength(0);
});
