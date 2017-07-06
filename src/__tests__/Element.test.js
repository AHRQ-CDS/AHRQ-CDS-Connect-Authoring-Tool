import Element from '../components/builder/Element';
import { fullRenderComponent } from '../helpers/test_helpers';
import { templateInstances } from '../helpers/test_fixtures';

let component;
const updateTemplateInstances = jest.fn();

const thisElementsTemplate = {
  id: 'gender',
  name: 'Gender',
  category: 'Demographics',
  parameters: [
    {
      id: 'element_name',
      type: 'string',
      name: 'Element Name',
      value: 'name1'
    }
  ]
};


beforeEach(() => {
  component = fullRenderComponent(Element,
    {
      name: 'Gender',
      template: thisElementsTemplate,
      templateInstances,
      updateTemplateInstances
    }
  );
});

test('renders Element with name and initial state', () => {
  expect(component.text()).toContain('Gender');
  expect(component.hasClass('element')).toBe(true);
});

test('updates template instances with correct template when clicked', () => {
  component.simulate('click');

  const argument = updateTemplateInstances.mock.calls[0][0][2];
  delete argument.uniqueId; // uniqueId tested by updateTemplateInstances unit test

  // Mock out what the new collection of template instances would be
  templateInstances.push(thisElementsTemplate);

  expect(updateTemplateInstances).toBeCalledWith(templateInstances);
});
