import BuilderPage from '../components/builder/BuilderPage';
import { fullRenderComponent, deepState } from '../helpers/test_helpers';

let component;
let componentWithMatch;
const match = {
  params: {
    group: 1
  }
};

beforeEach(() => {
  component = fullRenderComponent(BuilderPage);
  componentWithMatch = fullRenderComponent(BuilderPage, { match });
});

test('no match results in no selected group', () => {
  expect(deepState(component).selectedGroup).toBeFalsy();
});

test('match results in selected group', () => {
  expect(deepState(componentWithMatch).selectedGroup).toBeTruthy();
});

test('children have correct classes', () => {
  const classNames = ['builder__header', 'builder__sidebar', 'builder__canvas'];
  component.children().forEach((node, i) => {
    expect(node.hasClass(classNames[i])).toBeTruthy();
  });
});

test('renders with children with or without a route match', () => {
  expect(component.children()).toHaveLength(3);
  expect(componentWithMatch.children()).toHaveLength(3);
});
