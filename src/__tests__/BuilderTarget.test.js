import BuilderTarget from '../components/BuilderTarget';
import Element from '../components/Element';
import { wrapInTestContext, fullRenderComponent } from '../helpers/test_helpers';

let component;
let componentWithElements;
const droppedElements = ['Age Range', 'Diabetes', 'Smoker Status'];

beforeEach(() => {
  // mock the actual droppable components
  component = fullRenderComponent(
    wrapInTestContext(BuilderTarget),
    {
      droppedElements: []
    }
  );

  componentWithElements = fullRenderComponent(
    wrapInTestContext(BuilderTarget),
    {
      droppedElements
    }
  );
});

test('indicates absence of content', () => {
  expect(component.hasClass('builder__canvas')).toBe(true);
  expect(component.text()).toContain('Drop content here.');
});

test('indicates presence of content', () => {
  expect(componentWithElements.hasClass('builder__canvas')).toBe(true);
  expect(component.text()).not.toContain('Drop content here.'); // FIXME: broken because state not being properly set because the updateDroppedElements function needs to be suppplied
  expect(componentWithElements.props().droppedElements).toEqual(droppedElements);
  expect(componentWithElements.children()).toHaveLength(droppedElements.length);
  expect(componentWithElements.find(Element)).toHaveLength(droppedElements.length);
});
