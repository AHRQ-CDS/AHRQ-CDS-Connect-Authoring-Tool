import BuilderSubPalette from '../components/BuilderSubPalette';
import Element from '../components/Element';
import { wrapInTestContext, shallowRenderComponent, fullRenderComponent } from '../helpers/test_helpers';

let component;
let droppableComponent;
const selectedGroup = {
  id: 1,
  icon: 'user',
  name: 'Demographics',
  entries: ['Age Range', 'Gender', 'Ethnicity', 'Race']
};

beforeEach(() => {
  // Obtain the reference to the component before React DnD wrapping
  // Stub the React DnD connector functions with an identity function
  component = shallowRenderComponent(
    BuilderSubPalette.DecoratedComponent,
    {
      connectDropTarget: el => el,
      selectedGroup
    }
  );

  // mock the actual draggable component
  droppableComponent = fullRenderComponent(
    wrapInTestContext(BuilderSubPalette),
    { selectedGroup }
  );
});

test('indicates presence of Elements', () => {
  expect(component.hasClass('builder__subpalette')).toBe(true);
  expect(component.children()).toHaveLength(selectedGroup.entries.length);
  expect(component.find(Element)).toHaveLength(selectedGroup.entries.length);
});

test('can have Elements dropped', () => {
  expect(droppableComponent).toBeDefined();
});
