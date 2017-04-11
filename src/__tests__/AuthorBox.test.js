import AuthorBox from '../components/AuthorBox';
import AuthorList from '../components/AuthorList';
import { fullRenderComponent } from '../helpers/test_helpers';

let component;

const props = {
  url: 'http://localhost:3001/api/authors',
  pollInterval: 2000
};

beforeEach(() => {
  component = fullRenderComponent(AuthorBox, props);
});

afterEach(() => {
  // mock.reset();
});

test('AuthorBox renders without crashing', () => {
  expect(component.children()).toHaveLength(3);
  component.unmount();
});

test('AuthorBox fetch', () => {
  setInterval(() => {
    component.update();
    expect(component.state('data')).toHaveLength(2);
    expect(component.find(AuthorList).props('data')).toHaveLength(2);
  }, props.pollInterval); // wait for loading authors to happen
});

test('AuthorBox handleAuthorUpdate', () => {
  component.instance().handleAuthorUpdate(1, { name: 'new author name', text: 'new author text' });  // no errors
  // simulate it catching an error
});

test('AuthorBox handleAuthorDelete', () => {
  component.instance().handleAuthorDelete(1);  // no errors
  // simulate it catching an error
});

test('AuthorBox handleAuthorSubmit', () => {
  setInterval(() => {
    component.update();
    component.instance().handleAuthorSubmit({ name: 'new author name', text: 'new author text' });  // no errors
    // simulate it catching an error
    expect(component.state('data')).toHaveLength(3);
    expect(component.find(AuthorList).props('data')).toHaveLength(3);
  }, props.pollInterval); // wait for loading authors to happen
});
