import AuthorForm from '../components/AuthorForm';
import { shallowRenderComponent } from '../helpers/test_helpers';

let component;
const onAuthorSubmit = jest.fn();

beforeEach(() => {
  component = shallowRenderComponent(AuthorForm, {
    onAuthorSubmit
  });
});

test('AuthorForm renders with initial values', () => {
  expect(component.children()).toHaveLength(3);
  expect(component.state('name')).toBe('');
  expect(component.state('text')).toBe('');
});

test('AuthorForm updates state in response to input change', () => {
  const nameInput = component.find('input').at(0);
  const textInput = component.find('input').at(1);

  nameInput.simulate('change', { target: { value: 'Foo Name' } });
  textInput.simulate('change', { target: { value: 'Turn of phrase' } });
  expect(component.state('name')).toBe('Foo Name');
  expect(component.state('text')).toBe('Turn of phrase');
});

test('AuthorForm resets state in response to form submit', () => {
  const form = component.find('form');
  const nameInput = component.find('input').at(0);
  const textInput = component.find('input').at(1);
  nameInput.simulate('change', { target: { value: 'Foo Name' } });
  textInput.simulate('change', { target: { value: 'Turn of phrase' } });

  expect(component.state('name')).toBe('Foo Name');
  expect(component.state('text')).toBe('Turn of phrase');
  form.simulate('submit', { preventDefault: () => {} }); // mock events can't preventDefault on their own :(
  expect(component.state('name')).toBe('');
  expect(component.state('text')).toBe('');
});

test('AuthorForm handles submitting no input', () => {
  const form = component.find('form');
  const nameInput = component.find('input').at(0);
  const textInput = component.find('input').at(1);
  nameInput.simulate('change', { target: { value: '' } });
  textInput.simulate('change', { target: { value: '' } });
  form.simulate('submit', { preventDefault: () => {} }); // mock events can't preventDefault on their own :(
  expect(component.state('name')).toBe('');
  expect(component.state('text')).toBe('');
});
