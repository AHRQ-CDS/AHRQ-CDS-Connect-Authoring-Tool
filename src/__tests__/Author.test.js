import Author from '../components/Author';
import { fullRenderComponent } from '../helpers/test_helpers';

// TODO: more clever way to mock data coming out of mongo?
// TODO: how to test functions that interact with axios?
const authorInfo = {
  uniqueID: '123',
  name: 'McMaster',
  text: 'Hello world'
};

let component;
const onAuthorSubmit = jest.fn();
const onAuthorDelete = jest.fn();
const onAuthorUpdate = jest.fn();
beforeEach(() => {
  component = fullRenderComponent(Author, {
    ...authorInfo,
    onAuthorSubmit,
    onAuthorDelete,
    onAuthorUpdate
  });
});

test('Author renders with initial values', () => {
  expect(component.state('name')).toBe('');
  expect(component.state('text')).toBe('');
  expect(component.state('toBeUpdated')).toBe(false);
  expect(component.text()).toContain('McMaster');
  expect(component.text()).toContain('Hello world');
});

test('Author renders as read only when not editing', () => {
  expect(component.find('form')).toHaveLength(0);
});

test('Author can start update', () => {
  component.find('button').at(0).simulate('click', { preventDefault: () => {} }); // mock events can't preventDefault on their own :(
  expect(component.state('toBeUpdated')).toBe(true);
  expect(component.find('form')).toHaveLength(1);
});

test('Author can finish update', () => {
  component.find('button').at(0).simulate('click', { preventDefault: () => {} });
  component.find('input[type="text"]').at(0).simulate('change', { target: { value: 'New Name' } });
  component.find('input[type="text"]').at(1).simulate('change', { target: { value: 'New Phrase' } });
  expect(component.state('name')).toBe('New Name');
  expect(component.state('text')).toBe('New Phrase');
  expect(component.find('input[type="text"]').at(0).props().value).toBe('New Name');
  expect(component.find('input[type="text"]').at(1).props().value).toBe('New Phrase');

  component.find('form').simulate('submit', { preventDefault: () => {} });
  expect(onAuthorUpdate).toBeCalled();
  expect(component.state('name')).toBe('');
  expect(component.state('text')).toBe('');
  expect(component.state('toBeUpdated')).toBe(false);
  expect(component.find('form')).toHaveLength(0);

  /* FIXME: these break because the name and text are
   rendered based on props rather than state. so updating
    here changes the state, but doesn't update the view. */
  expect(component.text()).not.toContain('McMaster');
  expect(component.text()).not.toContain('Hello world');
  expect(component.text()).toContain('New Name');
  expect(component.text()).toContain('New Phrase');
});

test('Author can delete', () => {
  component.find('button').at(1).simulate('click', { preventDefault: () => {} }); // mock events can't preventDefault on their own :(
  expect(onAuthorDelete).toBeCalled();
});
