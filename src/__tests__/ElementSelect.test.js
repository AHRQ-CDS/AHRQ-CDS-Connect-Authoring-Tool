import ElementSelect from '../components/builder/ElementSelect';
import { fullRenderComponent } from '../helpers/test_helpers';
import { elementGroups } from '../helpers/test_fixtures';

let component,
  elementField,
  categoryField,
  setInputValue;
const updateTemplateInstances = jest.fn();

beforeEach(() => {
  component = fullRenderComponent(ElementSelect,
    {
      categories: elementGroups,
      templateInstances: [],
      updateTemplateInstances
    }
  );

  elementField = component.find('.element-select__element-field');
  categoryField = component.find('.element-select__category-field');

  setInputValue = (input, value) => {
    input.simulate('focus');
    input.node.value = value;
    input.simulate('change');
  };
});

test('renders the component with proper elements', () => {
  expect(component.hasClass('form__group')).toBeTruthy();
  expect(component.hasClass('element-select')).toBeTruthy();
  expect(component.find('.Select')).toHaveLength(2);
  expect(component.find('.is-open')).toHaveLength(0);
});

describe('the select element field', () => {
  it('starts with correct placeholder text', () => {
    expect(elementField.find('.Select-placeholder').text()).toEqual('Add element');
    expect(elementField.find('input').at(0).prop('aria-label')).toEqual('Add element');
  });

  it('starts with a list of all elements', () => {
    elementField.find('input').simulate('change');
    expect(elementField.hasClass('is-open')).toBeTruthy();
    expect(elementField.find('.element-select__option')).toHaveLength(5);
  });

  it('options display correct values', () => {
    elementField.find('input').simulate('change');
    const firstOptionValue = elementField.find('.element-select__option').at(0).find('.element-select__option-value');

    expect(firstOptionValue).toHaveLength(1);
    expect(firstOptionValue.text()).toEqual('Age Range');
  });

  it('options of category "all" show their true category in the dropdown', () => {
    elementField.find('input').simulate('change');
    const firstOptionCategory = elementField.find('.element-select__option').at(0).find('.element-select__option-category');

    expect(firstOptionCategory).toHaveLength(1);
    expect(firstOptionCategory.text()).toEqual('(Demographic)');
  });

  it('filters correct options when typing', () => {
    setInputValue(elementField.find('input'), 'Gen');
    const options = elementField.find('.element-select__option');

    expect(options).toHaveLength(1);
    expect(options.at(0).text().includes('Gender')).toBeTruthy();
  });

  it('adds element to builder when selected', () => {
    const element = elementGroups[0].entries[0];
    setInputValue(elementField.at(0).find('input'), element.name);

    const firstOption = elementField.find('.element-select__option').at(0);
    firstOption.simulate('mouseDown', { button: 0 });

    const argument = updateTemplateInstances.mock.calls[0][0][0];
    delete argument.uniqueId; // uniqueId tested by updateTemplateInstances unit test

    expect(updateTemplateInstances).toBeCalledWith([element]);
  });
});

describe('the select category field', () => {
  it('has the correct aria label', () => {
    expect(categoryField.find('.Select-input').at(0).prop('aria-label')).toEqual('Narrow elements by category');
  });

  it('contains every original category plus "all" category in alphabetical order', () => {
    const categoryNames = ['All', 'Demographics', 'Observations'];
    categoryField.find('.Select-control').simulate('mouseDown', { button: 0 });
    const options = categoryField.find('.Select-option');

    expect(options).toHaveLength(3);
    options.map((option, i) => {
      expect(option.text()).toEqual(categoryNames[i]);
    });
  });

  it('starts with "All" group selected', () => {
    expect(categoryField.find('.Select-value').text()).toEqual('All');
  });

  it('when selecting new category, updates value and element field options', () => {
    categoryField.find('.Select-control').simulate('mouseDown', { button: 0 });
    categoryField.find('.Select-option').at(1).simulate('mouseDown', { button: 0 });
    elementField.find('input').simulate('change');

    expect(categoryField.find('.Select-value').text()).toEqual('Demographics');
    expect(elementField.find('.element-select__option')).toHaveLength(2);
  });
});
