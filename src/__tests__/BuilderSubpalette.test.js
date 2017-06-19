import BuilderSubPalette from '../components/builder/BuilderSubPalette';
import Element from '../components/builder/Element';
import { shallowRenderComponent } from '../helpers/test_helpers';

let component;
const selectedGroup = {
  id: 1,
  icon: 'user',
  name: 'Demographics',
  entries: [{ name: 'Age Range' }, { name: 'Gender' }, { name: 'Ethnicity' }, { name: 'Race' }]
};

beforeEach(() => {
  component = shallowRenderComponent(
    BuilderSubPalette,
    {
      selectedGroup,
      // Even though this is a shallow render it still wants the following
      // required props to be available for the child component, Element
      templateInstances: [],
      updateTemplateInstances: () => {}
    }
  );
});

test('indicates presence of Elements', () => {
  expect(component.hasClass('builder__subpalette')).toBe(true);
  expect(component.children()).toHaveLength(selectedGroup.entries.length);
  expect(component.find(Element)).toHaveLength(selectedGroup.entries.length);
});
