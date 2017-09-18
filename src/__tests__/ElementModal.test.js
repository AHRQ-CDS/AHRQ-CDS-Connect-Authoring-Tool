import _ from 'lodash';
import Modal from 'react-modal';
import ElementModal from '../components/builder/ElementModal';
import { filterUnsuppressed } from '../helpers/utils';
import { fullRenderComponent, ReactWrapper } from '../helpers/test_helpers';
import { elementGroups } from '../helpers/test_fixtures';

let component;
let input;
let getInput;
let setInputValue;
let internalModal;
const setSelectedCategory = jest.fn();
const onElementSelected = jest.fn();

const getAllElements = categories => _.flatten(filterUnsuppressed(categories).map(cat => (
  filterUnsuppressed(cat.entries).map(e => Object.assign({ category: cat.name.replace(/s\s*$/, '') }, e))
)));

const generateCategories = () => {
  const categoriesCopy = Object.assign([], elementGroups);

  categoriesCopy.unshift({
    icon: 'bars',
    name: 'All',
    entries: getAllElements(categoriesCopy)
  });

  return categoriesCopy;
};
const categories = generateCategories();

beforeEach(() => {
  component = fullRenderComponent(ElementModal,
    {
      categories,
      selectedCategory: categories.find(g => g.name === 'All'),
      setSelectedCategory,
      onElementSelected
    }
  );

  internalModal = new ReactWrapper(
    component.find(Modal).node.portal, true
  );

  getInput = () => internalModal.find('.element-modal__search input');
});

test('renders the component with proper elements', () => {
  expect(component.hasClass('element-modal')).toBeTruthy();
  expect(component.find(Modal)).toHaveLength(1);
  expect(component.find('button').first().text()).toEqual('Browse');
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
  expect(internalModal.find('.element-modal__sidebar')).toHaveLength(1);
  expect(internalModal.find('.element-modal__list')).toHaveLength(1);
});

test('can open modal with "Browse" button', () => {
  expect(component.state().isOpen).toEqual(false);
  component.find('button').first().simulate('click');
  expect(component.state().isOpen).toEqual(true);
});

describe('with modal open', () => {
  beforeEach(() => {
    component.instance().openModal();

    input = getInput();

    setInputValue = (value) => {
      input.simulate('focus');
      input.node.value = value;  // eslint-disable-line no-param-reassign
      input.simulate('change');
    };
  });

  test('can close modal with "Close" button', () => {
    internalModal.find('.modal__footer button').first().simulate('click');
    expect(component.state().isOpen).toEqual(false);
  });

  test('can change selected category', () => {
    const index = 1;
    internalModal.find('.element-modal__sidebar button').at(index).simulate('click');

    expect(setSelectedCategory).toBeCalledWith(categories[index]);
  });

  test('can select an element', () => {
    const element = component.state().elementList[0];
    internalModal.find('.element-modal__list button').first().simulate('click');

    expect(onElementSelected).toBeCalledWith(element);
    expect(component.state().isOpen).toEqual(false);
  });

  test('updates list when searching', () => {
    expect(component.state().elementList).toHaveLength(7);

    setInputValue('cholest');

    expect(component.state().searchValue).toEqual('cholest');
    expect(component.state().elementList).toHaveLength(2);

    setInputValue('age');

    expect(component.state().searchValue).toEqual('age');
    expect(component.state().elementList).toHaveLength(1);
  });

  test('resets search term when reopening modal', () => {
    const searchTerm = 'derp';
    setInputValue(searchTerm);

    expect(input.node.value).toEqual(searchTerm);

    component.instance().closeModal();
    component.instance().openModal();

    input = getInput();

    expect(input.node.value).toEqual('');
  });
});
