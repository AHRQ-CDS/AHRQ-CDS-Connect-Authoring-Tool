import Modal from 'react-modal';
import ElementModal from '../../components/builder/ElementModal';
import { fullRenderComponent, ReactWrapper } from '../../utils/test_helpers';

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
      vsacDetailsCodes: testVsacDetails
    }
  );

  internalModal = new ReactWrapper(component.find(Modal).node.portal, true);

  getInput = () => internalModal.find('.element-modal__search input');
});

test('renders the component with proper elements', () => {
  expect(component.hasClass('element-modal')).toBeTruthy();
  expect(component.find(Modal)).toHaveLength(1);
  expect(component.find('button').first().text()).toEqual(' Choose Value Sets');
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

test('can open modal with "Choose Value Sets" button', () => {
  expect(component.state().isOpen).toEqual(false);
  component.find('button').first().simulate('click');
  expect(component.state().isOpen).toEqual(true);
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

  test('can close modal with "Close" button', () => {
    internalModal.find('.modal__footer button').first().simulate('click');
    expect(component.state().isOpen).toEqual(false);
  });

  test('can select a valueset', () => {
    const vsacSearchResult = component.props().vsacSearchResults[0];
    const element = { name: vsacSearchResult.name, oid: vsacSearchResult.oid };
    // Click on a VS returned by the search.
    internalModal.find('.search__table tbody tr').first().simulate('click');

    // Clicking an individual VS gets the details and displays them in the table and input field.
    expect(component.state().selectedElement).toEqual(element);
    expect(component.props().getVSDetails).toBeCalledWith(component.state().selectedElement.oid);
    expect(internalModal.find('.search__table')).toHaveLength(1);
    expect(internalModal.find('.search__table thead th')).toHaveLength(3);

    const code = component.props().vsacDetailsCodes[0];
    const codeToString = code.code + code.displayName + code.codeSystemName;

    expect(internalModal.find('.search__table tbody tr').first().text()).toEqual(codeToString);
    expect(input.node.value).toEqual(`${element.name} (${element.oid})`);

    // Clicking the select button class the onElementSelected function
    const selectButton = internalModal.find('.element-modal__search button');
    selectButton.simulate('click');
    expect(component.props().onElementSelected).toBeCalledWith(component.props().template);
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
    expect(internalModal.find('.search__table thead th')).toHaveLength(5);
    expect(internalModal.find('.search__table thead').text())
      .toEqual('TypeNameCode SystemStewardCodes'); // Search table headings
    expect(component.state().selectedElement).toEqual(null);
  });

  test('resets search term when closing modal', () => {
    const searchTerm = 'derp';
    setInputValue(searchTerm);

    expect(input.node.value).toEqual(searchTerm);

    component.instance().closeModal();

    expect(input.node.value).toEqual('');
  });
});
