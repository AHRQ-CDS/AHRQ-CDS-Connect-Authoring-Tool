import ElementTypeahead from '../components/builder/ElementTypeahead';
import { fullRenderComponent } from '../helpers/test_helpers';
import { elementGroups } from '../helpers/test_fixtures';

let component,
    input,
    dropdown,
    setInputValue;
const updateTemplateInstances = jest.fn();

beforeEach(() => {
  component = fullRenderComponent(ElementTypeahead,
    {
      groups: elementGroups,
      selectedGroup: null,
      templateInstances: [],
      updateTemplateInstances: updateTemplateInstances
    }
  );

  input = component.find('input');
  dropdown = component.find('.react-autosuggest__suggestions-container');

  setInputValue = (value) => {
    input.simulate('focus');
    input.node.value = value;
    input.simulate('change', input);
  };
});

test('renders the component with proper elements and placeholder text', () => {
  expect(component.hasClass('react-autosuggest__container')).toBeTruthy();
  expect(input).toHaveLength(1);
  expect(input.get(0).placeholder).toEqual('Search all elements');
  expect(dropdown.hasClass('react-autosuggest__suggestions-container--open')).toBeFalsy();
});

test('shows dropdown of suggestions when starting to type', () => {
  setInputValue('a');

  expect(dropdown.hasClass('react-autosuggest__suggestions-container--open')).toBeTruthy();
  expect(dropdown.find('li')).toHaveLength(2);
});

test('sorts suggestions properly', () => {
  const sortedCholesterols = ['Cholesterol', 'HDL Cholesterol', 'Total Cholesterol'];

  setInputValue('cholesterol');

  expect(dropdown.find('li')).toHaveLength(3);
  dropdown.find('li').forEach((item, i) => {
    expect(item.text()).toEqual(sortedCholesterols[i]);
  });
});

test('retrieves all elements when no group selected', () => {
  setInputValue('e');

  expect(dropdown.find('li')).toHaveLength(5);
});

test('updates placeholder text when a group is selected', () => {
  component.setProps({ selectedGroup: elementGroups[0] });

  expect(input.get(0).placeholder).toEqual('Search demographic elements');
});

test('retrieves only group specific elements when a group is selected', () => {
  component.setProps({ selectedGroup: elementGroups[0] });

  setInputValue('e');

  expect(dropdown.find('li')).toHaveLength(2);
});

test('adds an element and clears search when selected', () => {
  const selectedGroup = elementGroups[0];
  const entry = selectedGroup.entries[0];

  component.setProps({ selectedGroup: selectedGroup });

  setInputValue(entry.name);
  dropdown.find('li').first().simulate('click');

  const argument = updateTemplateInstances.mock.calls[0][0][0];
  delete argument['uniqueId']; // uniqueId tested by updateTemplateInstances unit test

  expect(input.get(0).value).toEqual('');
  expect(updateTemplateInstances).toBeCalledWith([entry]);
});
