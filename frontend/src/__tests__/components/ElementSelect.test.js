import ElementSelect from '../../components/builder/ElementSelect';
import { fullRenderComponent } from '../../utils/test_helpers';
import { genericElementTypes, genericElementGroups } from '../../utils/test_fixtures';

let component;
let elementField;
let setInputValue;
const addInstance = jest.fn();

const props = {
  categories: genericElementGroups,
  onSuggestionSelected: addInstance,
  booleanParameters: [],
  loginVSACUser: jest.fn(),
  setVSACAuthStatus: jest.fn(),
  vsacStatus: '',
  vsacStatusText: '',
  timeLastAuthenticated: new Date(),
  searchVSACByKeyword: jest.fn(),
  isSearchingVSAC: false,
  vsacSearchResults: [],
  vsacSearchCount: 0,
  getVSDetails: jest.fn(),
  isRetrievingDetails: false,
  vsacDetailsCodes: []
};

beforeEach(() => {
  component = fullRenderComponent(
    ElementSelect,
    { ...props }
  );

  elementField = component.find('.element-select__element-field');

  setInputValue = (input, value) => {
    input.simulate('focus');
    input.node.value = value; // eslint-disable-line no-param-reassign
    input.simulate('change');
  };
});

test('renders the component with proper elements', () => {
  expect(component.childAt(0).hasClass('form__group')).toBeTruthy();
  expect(component.childAt(0).hasClass('element-select')).toBeTruthy();
  expect(component.find('.Select')).toHaveLength(1);
  expect(component.find('.is-open')).toHaveLength(0);
});

describe('the select element field', () => {
  it('starts with correct placeholder text', () => {
    expect(elementField.find('.Select-placeholder').text()).toEqual('Choose element type');
    expect(elementField.find('input').at(0).prop('aria-label')).toEqual('Choose element type');
  });

  it('starts with a list of all elements', () => {
    elementField.find('input').simulate('change');
    expect(elementField.hasClass('is-open')).toBeTruthy();
    expect(elementField.find('.element-select__option')).toHaveLength(9);
  });

  it('options display correct values and have key icon if VSAC auth required', () => {
    elementField.find('input').simulate('change');
    const allOptions = elementField.find('.element-select__option');
    const numOptions = allOptions.length;
    for (let i = 0; i < numOptions; i++) {
      const option = allOptions.at(i);
      expect(option.find('.element-select__option-value')).toHaveLength(1);
      expect(option.find('.element-select__option-value').text()).toEqual(genericElementTypes[i].label);
      expect(option.find('.element-select__option-category').exists()).toBe(genericElementTypes[i].vsacAuthRequired);
    }
  });

  it('filters correct options when typing', () => {
    setInputValue(elementField.find('input'), 'Med');
    const options = elementField.find('.element-select__option');

    expect(options).toHaveLength(2);
    expect(options.at(0).text().includes('Medication Statement')).toBeTruthy();
  });

  it('selects a generic type without VSAC authentication and adds it to the workspace', () => {
    const demographics = genericElementGroups[0];
    setInputValue(elementField.find('input'), 'Demographics');

    const firstResult = elementField.find('.element-select__option').at(0);
    firstResult.simulate('mouseDown');

    // Choosing no VSAC auth element renders second select box.
    expect(component.state().selectedElement).toEqual(genericElementTypes[2]);
    expect(component.state().selectedElement.vsacAuthRequired).toBe(false);
    expect(component.find('.element-select__element-field').length).toEqual(2);

    // Get options in second select box for Demographics elements
    const demographicsOptions = component.find('.element-select__element-field').at(1);
    demographicsOptions.find('input').simulate('change');
    expect(demographicsOptions.hasClass('is-open')).toBeTruthy();
    expect(demographicsOptions.find('.Select-option')).toHaveLength(demographics.entries.length);

    // Choosing first option adds it to workspace
    const firstOption = demographicsOptions.find('.Select-option').at(0);
    firstOption.simulate('mouseDown');
    expect(addInstance).toBeCalledWith(genericElementGroups[0].entries[0]);
    expect(component.state().selectedElement).toBeNull();
  });

  it('selects a generic type with VSAC auth controls based on timeLastAuthenticated', () => {
    props.timeLastAuthenticated = new Date() - 30000000;
    const unauthenticatedComponent = fullRenderComponent(
      ElementSelect,
      { ...props }
    );
    const unauthElementField = unauthenticatedComponent.find('.element-select__element-field');

    setInputValue(elementField.find('input'), 'Observation');
    setInputValue(unauthElementField.find('input'), 'Observation');

    const obsResult = elementField.find('.element-select__option').at(0);
    const unauthObsResult = unauthElementField.find('.element-select__option').at(0);
    obsResult.simulate('mouseDown');
    unauthObsResult.simulate('mouseDown');

    // Choosing VSAC auth element with recent timeLastAuthenticated has 2 VSAC control buttons.
    expect(component.state().selectedElement).toEqual(genericElementTypes[6]);
    expect(component.state().selectedElement.vsacAuthRequired).toEqual(true);
    expect(component.find('.element-select__element-field').length).toEqual(1);
    expect(component.find('.vsac-authenticate').length).toEqual(1);
    expect(component.find('.vsac-authenticate button').length).toEqual(3);
    expect(component.find('.vsac-authenticate button').at(0).text()).toEqual(' VSAC Authenticated');
    expect(component.find('.vsac-authenticate button').at(1).text()).toEqual(' Add Value Set');

    // Choosing VSAC auth element with recent timeLastAuthenticated has 1 VSAC control buttons.
    expect(unauthenticatedComponent.state().selectedElement).toEqual(genericElementTypes[6]);
    expect(unauthenticatedComponent.state().selectedElement.vsacAuthRequired).toEqual(true);
    expect(unauthenticatedComponent.find('.element-select__element-field').length).toEqual(1);
    expect(unauthenticatedComponent.find('.vsac-authenticate').length).toEqual(1);
    expect(unauthenticatedComponent.find('.vsac-authenticate button').length).toEqual(1);
    expect(unauthenticatedComponent.find('.vsac-authenticate button').at(0).text()).toEqual(' Authenticate VSAC');
  });
});
