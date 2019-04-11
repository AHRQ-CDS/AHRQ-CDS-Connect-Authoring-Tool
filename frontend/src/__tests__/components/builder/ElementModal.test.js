import Modal from 'react-modal';
import _ from 'lodash';
import ElementModal from '../../../components/builder/ElementModal';
import { fullRenderComponent, ReactWrapper } from '../../../utils/test_helpers';

let component;
let input;
let getInput;
let setInputValue;
let internalModal;
const onElementSelected = jest.fn();
const searchVSACByKeyword = jest.fn();
const getVSDetails = jest.fn();

const testVsacSearchResults = [
  { name: 'Test VS', type: 'Grouping', steward: 'Test Steward', oid: '1.2.3', codeCount: 4, codeSystem: ['Test CS'] },
  { name: 'New VS', type: 'Extentional', steward: 'New Steward', oid: '3.4.5', codeCount: 8, codeSystem: ['New CS'] }
];

const testVsacDetails = [
  { code: '123-4', codeSystem: '1.2.3', codeSystemName: 'CodeSysName', codeSystemVersion: '1.2', displayName: 'Name' }
];

const testTemplate = {
  id: 'GenericObservation',
  name: 'Observation',
  returnType: 'list_of_observations',
  suppress: true,
  extends: 'Base',
  parameters: [
    { id: 'element_name', type: 'string', name: 'Element Name' },
    { id: 'observation', type: 'observation', name: 'Observation' }
  ],
};

beforeEach(() => {
  component = fullRenderComponent(
    ElementModal,
    {
      onElementSelected,
      searchVSACByKeyword,
      isSearchingVSAC: false,
      vsacSearchResults: testVsacSearchResults,
      vsacSearchCount: 0,
      template: testTemplate,
      getVSDetails,
      isRetrievingDetails: false,
      vsacDetailsCodes: testVsacDetails,
      vsacFHIRCredentials: { username: '', password: '' }
    }
  );

  internalModal = new ReactWrapper(component.find(Modal).node.portal, true);

  getInput = () => internalModal.find('.element-modal__search input');
});

test('renders the component with proper elements', () => {
  expect(component.hasClass('element-modal')).toBeTruthy();
  expect(component.find(Modal)).toHaveLength(1);
  expect(component.find('button').first().text()).toEqual(' Add Value Set');
});

test('can set open and close state', () => {
  expect(component.state().isOpen).toEqual(false);
  component.instance().openModal();
  expect(component.state().isOpen).toEqual(true);
  component.instance().closeModal();
  expect(component.state().isOpen).toEqual(false);
});

test('renders the proper children', () => {
  component.instance().openModal();

  expect(internalModal.find('.element-modal__container')).toHaveLength(1);
  expect(internalModal.find('.element-modal__search')).toHaveLength(1);
  expect(internalModal.find('.element-modal__content')).toHaveLength(1);
});

test('can open modal with "Add Value Set" button', () => {
  expect(component.state().isOpen).toEqual(false);
  component.find('button').first().simulate('click');
  expect(component.state().isOpen).toEqual(true);
});

test('can open a modal using an icon instead of a button', () => {
  // Default is to have a button open the modal.
  expect(component.find('#open-modal-button > span > FontAwesome')).toHaveLength(0);
  expect(component.find('#open-modal-button > button')).toHaveLength(1);

  // Can set prop to use an icon in a span instead of the button default.
  component.setProps({ useIconButton: true, iconForButton: 'eye' });
  // Close and reopen modal to set state correctly.
  component.instance().closeModal();
  component.instance().openModal();
  expect(component.find('#open-modal-button > span > FontAwesome')).toHaveLength(1);
  expect(component.find('#open-modal-button > button')).toHaveLength(0);
});

describe('with modal open', () => {
  beforeEach(() => {
    component.instance().openModal();

    input = getInput();
    const searchButton = internalModal.find('.element-modal__search button');

    setInputValue = (value) => {
      input.simulate('focus');
      input.node.value = value; // eslint-disable-line no-param-reassign
      input.simulate('change');
      searchButton.simulate('click');
    };
  });

  test('can close modal with "Cancel" button', () => {
    internalModal.find('.modal__footer button').first().simulate('click');
    expect(component.state().isOpen).toEqual(false);
  });

  test('can select a valueset', () => {
    const vsacSearchResult = component.props().vsacSearchResults[0];
    const element = { name: vsacSearchResult.name, oid: vsacSearchResult.oid };

    // Clicking the select button before choosing a value set does nothing
    const selectButton = internalModal.find('.modal__footer .element-modal__searchbutton');
    selectButton.simulate('click');
    expect(component.props().onElementSelected).not.toBeCalled();

    // Click on a VS returned by the search.
    internalModal.find('.search__table tbody tr').first().simulate('click');

    // Clicking an individual VS gets the details and displays them in the table and input field.
    expect(component.state().selectedElement).toEqual(element);
    expect(component.props().getVSDetails).toBeCalledWith(component.state().selectedElement.oid, '', '');
    expect(internalModal.find('.search__table')).toHaveLength(1);
    expect(internalModal.find('.search__table thead th')).toHaveLength(3);

    const code = component.props().vsacDetailsCodes[0];
    const codeToString = code.code + code.displayName + code.codeSystemName;

    expect(internalModal.find('.search__table tbody tr').first().text()).toEqual(codeToString);
    expect(input.node.value).toEqual(`${element.name} (${element.oid})`);

    // Set selected values on base template
    const templateWithSelectedValue = _.cloneDeep(component.props()).template;
    templateWithSelectedValue.parameters[0].value = element.name;
    templateWithSelectedValue.parameters[1].valueSets = [{ name: element.name, oid: element.oid }];
    templateWithSelectedValue.parameters[1].static = true;

    // Clicking the select button class the onElementSelected function
    selectButton.simulate('click');
    expect(component.props().onElementSelected).toBeCalledWith(templateWithSelectedValue);
  });

  test('calls vsac search action when searching', () => {
    expect(component.props().vsacSearchResults).toHaveLength(2);

    setInputValue('cholest');

    expect(component.state().searchValue).toEqual('cholest');
    expect(component.props().searchVSACByKeyword).toBeCalled();
  });

  test('using the back arrow returns to search results table', () => {
    const vsacSearchResult = component.props().vsacSearchResults[0];
    const element = { name: vsacSearchResult.name, oid: vsacSearchResult.oid };

    // Click on a VS returned by the search, changes to the details table.
    internalModal.find('.search__table tbody tr').first().simulate('click');
    expect(internalModal.find('.search__table thead th')).toHaveLength(3);
    expect(internalModal.find('.search__table thead').text()).toEqual('CodeNameCode System'); // Details table headings
    expect(component.state().selectedElement).toEqual(element);

    // Clicking the arrow button changes to search table and resets selectedElement.
    internalModal.find('.nav-icon').simulate('click');
    expect(internalModal.find('.search__table thead th')).toHaveLength(3);
    expect(internalModal.find('.search__table thead').text())
      .toEqual('Name/OIDStewardCodes'); // Search table headings
    expect(component.state().selectedElement).toEqual(null);
  });

  test('viewOnly flag does not allow for selecting value set or navigating back to search', () => {
    // Set new props to test, then close and reopen modal to set state correctly.
    component.setProps({ viewOnly: true, selectedElement: { name: 'Test VS', oid: '1.2.3' } });
    component.instance().closeModal();
    component.instance().openModal();

    expect(component.state().isOpen).toBeTruthy();
    expect(internalModal.find('.nav-icon')).toHaveLength(0); // No back arrow.
    expect(internalModal.find('.element-modal__searchbutton')).toHaveLength(0); // No search/select button.
  });

  test('resets search term when closing modal', () => {
    const searchTerm = 'derp';
    setInputValue(searchTerm);

    expect(input.node.value).toEqual(searchTerm);

    component.instance().closeModal();

    expect(input.node.value).toEqual('');
  });

  test('Modal for modifier call correct update function', () => {
    // Set up modal to be used on a modifier
    const modifierModal = fullRenderComponent(
      ElementModal,
      {
        updateModifier: jest.fn(),
        searchVSACByKeyword,
        isSearchingVSAC: false,
        vsacSearchResults: testVsacSearchResults,
        vsacSearchCount: 0,
        template: testTemplate,
        getVSDetails,
        isRetrievingDetails: false,
        vsacDetailsCodes: testVsacDetails,
        vsacFHIRCredentials: { username: '', password: '' }
      }
    );
    modifierModal.instance().openModal();
    internalModal = new ReactWrapper(modifierModal.find(Modal).node.portal, true);

    // Choose a value set
    const vsacSearchResult = modifierModal.props().vsacSearchResults[0];
    const element = { name: vsacSearchResult.name, oid: vsacSearchResult.oid };
    internalModal.find('.search__table tbody tr').first().simulate('click');

    // Clicking the select button calls the modifier update function with correct object and closes modal
    const selectButton = internalModal.find('.modal__footer .element-modal__searchbutton');
    selectButton.simulate('click');
    expect(modifierModal.props().updateModifier).toBeCalledWith({ name: element.name, oid: element.oid });
    expect(modifierModal.state().isOpen).toEqual(false);
  });
});
