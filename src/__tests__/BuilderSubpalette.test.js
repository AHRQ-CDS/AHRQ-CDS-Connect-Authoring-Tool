import BuilderSubPalette from '../components/builder/BuilderSubPalette';
import Element from '../components/builder/Element';
import { wrapInTestContext, shallowRenderComponent, fullRenderComponent } from '../helpers/test_helpers';

let component;
const selectedGroup = {
  id: 1,
  icon: 'user',
  name: 'Demographics',
  entries: ['Age Range', 'Gender', 'Ethnicity', 'Race']
};

beforeEach(() => {
  component = shallowRenderComponent(
    BuilderSubPalette,
    {
      selectedGroup
    }
  );
});

test('indicates presence of Elements', () => {
  expect(component.hasClass('builder__subpalette')).toBe(true);
  expect(component.children()).toHaveLength(selectedGroup.entries.length);
  expect(component.find(Element)).toHaveLength(selectedGroup.entries.length);
});

