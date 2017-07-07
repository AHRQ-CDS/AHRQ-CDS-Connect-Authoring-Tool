import BuilderPage from '../components/builder/BuilderPage';
import { fullRenderComponent } from '../helpers/test_helpers';

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

test('children have correct classes', () => {
  const classNames = ['builder__header', 'builder__panel', 'builder__canvas'];
  component.children().forEach((node, i) => {
    expect(node.hasClass(classNames[i])).toBeTruthy();

    if (classNames[i] === 'builder__panel') {
      expect(node.find('.builder__sidebar')).toHaveLength(1);
    }
  });
});

test('renders with children with or without a route match', () => {
  expect(component.children()).toHaveLength(2);
  expect(componentWithMatch.children()).toHaveLength(2);
});
