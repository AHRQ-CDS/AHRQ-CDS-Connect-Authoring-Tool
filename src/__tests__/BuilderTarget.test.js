import BuilderTarget from '../components/builder/BuilderTarget';
import TemplateInstance from '../components/builder/TemplateInstance';
import { wrapInTestContext, fullRenderComponent } from '../helpers/test_helpers';
import templateInstances from '../helpers/test_fixtures';

let component;
let componentWithElements;

beforeEach(() => {
  // mock the actual droppable components
  component = fullRenderComponent(
    wrapInTestContext(BuilderTarget),
    {
      templateInstances: [],
      updateSingleElement: jest.fn(),
      updateTemplateInstances: jest.fn()
    }
  );

  componentWithElements = fullRenderComponent(
    wrapInTestContext(BuilderTarget),
    {
      templateInstances,
      updateSingleElement: jest.fn(),
      updateTemplateInstances: jest.fn()
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
  expect(componentWithElements.props().templateInstances).toEqual(templateInstances);
  expect(componentWithElements.children()).toHaveLength(templateInstances.length);
  expect(componentWithElements.find(TemplateInstance)).toHaveLength(templateInstances.length);
});

test('can delete an element', () => {
  const initialElementsLength = templateInstances.length;
  expect(componentWithElements.props().templateInstances).toEqual(templateInstances);
  expect(componentWithElements.props().templateInstances).toHaveLength(initialElementsLength);
  expect(componentWithElements.find(TemplateInstance)).toHaveLength(initialElementsLength);

  const deleteButton = componentWithElements.find(TemplateInstance).first().find('.element__deletebutton');
  deleteButton.simulate('click');
  componentWithElements.update();

  expect(componentWithElements.props().templateInstances).toHaveLength(initialElementsLength - 1);
  expect(componentWithElements.find(TemplateInstance)).toHaveLength(initialElementsLength - 1);
});
