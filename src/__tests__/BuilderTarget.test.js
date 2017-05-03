import BuilderTarget from '../components/builder/BuilderTarget';
import TemplateInstance from '../components/TemplateInstance';
import { wrapInTestContext, fullRenderComponent } from '../helpers/test_helpers';
import { droppedElements } from '../helpers/test_fixtures';

let component;
let componentWithElements;

beforeEach(() => {
  // mock the actual droppable components
  component = fullRenderComponent(
    wrapInTestContext(BuilderTarget),
    {
      droppedElements: [],
      updateSingleElement: jest.fn(),
      updateDroppedElements: jest.fn()
    }
  );

  componentWithElements = fullRenderComponent(
    wrapInTestContext(BuilderTarget),
    {
      droppedElements,
      updateSingleElement: jest.fn(),
      updateDroppedElements: jest.fn()
    }
  );
});

test('indicates absence of content', () => {
  expect(component.hasClass('builder__canvas')).toBe(true);
  expect(component.text()).toContain('Drop content here.');
});

test('indicates presence of content', () => {
  expect(componentWithElements.hasClass('builder__canvas')).toBe(true);
  expect(componentWithElements.text()).not.toContain('Drop content here.');
  expect(componentWithElements.props().droppedElements).toEqual(droppedElements);
  expect(componentWithElements.children()).toHaveLength(droppedElements.length);
  expect(componentWithElements.find(TemplateInstance)).toHaveLength(droppedElements.length);
});

test('can delete an element', () => {
  const initialElementsLength = droppedElements.length;
  expect(componentWithElements.props().droppedElements).toEqual(droppedElements);
  expect(componentWithElements.props().droppedElements).toHaveLength(initialElementsLength);
  expect(componentWithElements.find(TemplateInstance)).toHaveLength(initialElementsLength);

  const deleteButton = componentWithElements.find(TemplateInstance).first().find('.element__deletebutton');
  deleteButton.simulate('click');
  componentWithElements.update();

  expect(componentWithElements.props().droppedElements).toHaveLength(initialElementsLength - 1);
  expect(componentWithElements.find(TemplateInstance)).toHaveLength(initialElementsLength - 1);
});
