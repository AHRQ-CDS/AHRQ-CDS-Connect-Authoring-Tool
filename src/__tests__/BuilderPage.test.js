import BuilderPage from '../components/builder/BuilderPage';
import ConjunctionGroup from '../components/builder/ConjunctionGroup';
import TemplateInstance, { createTemplateInstance } from '../components/builder/TemplateInstance';
import { fullRenderComponent, deepState } from '../helpers/test_helpers';
import { instanceTree, elementGroups } from '../helpers/test_fixtures';

let component;
let componentWithMatch;
let initializedComponent;
const operations = elementGroups.find(g => g.name === 'Operations');
const observations = elementGroups.find(g => g.name === 'Observations');
const andTemplate = operations.entries.find(e => e.id === 'And');
const orTemplate = operations.entries.find(e => e.id === 'Or');
const cholesterolTemplate = observations.entries.find(e => e.id === 'TotalCholesterol');

const match = {
  params: {
    group: 1
  }
};

beforeEach(() => {
  component = fullRenderComponent(BuilderPage);
  componentWithMatch = fullRenderComponent(BuilderPage, { match });
  initializedComponent = fullRenderComponent(BuilderPage);

  component.setState({
    categories: elementGroups
  });
  initializedComponent.setState({
    categories: elementGroups
  });
  initializedComponent.node.initializeInstanceTree(andTemplate);
});

test('children have correct classes', () => {
  const classNames = ['builder__header', 'builder__canvas'];
  component.children().forEach((node, i) => {
    expect(node.hasClass(classNames[i])).toBeTruthy();
  });
});

test('renders with children with or without a route match', () => {
  expect(component.children()).toHaveLength(2);
  expect(componentWithMatch.children()).toHaveLength(2);
});

test('indicates absence of content', () => {
  expect(component.hasClass('builder')).toBe(true);
  expect(component.text()).toContain('Loading...');
});

test('initializes with root instance', () => {
  expect(initializedComponent.state().instanceTree.id).toEqual('And');
  expect(initializedComponent.find(ConjunctionGroup)).toHaveLength(1);
});

test('renders a single level tree', () => {
  initializedComponent.setState({
    instanceTree: instanceTree
  });

  expect(initializedComponent.state().instanceTree.name).toEqual('And');
  expect(initializedComponent.find(ConjunctionGroup)).toHaveLength(1);
  expect(initializedComponent.state().instanceTree.childInstances).toHaveLength(2);
  expect(initializedComponent.find(TemplateInstance)).toHaveLength(2);
});

test('adds a template instance', () => {
  const instance = createTemplateInstance(cholesterolTemplate);

  expect(initializedComponent.state().instanceTree.childInstances).toHaveLength(0);
  expect(initializedComponent.find(TemplateInstance)).toHaveLength(0);

  initializedComponent.node.addInstance(instance, 'childInstances');

  const children = initializedComponent.state().instanceTree.childInstances;

  expect(children).toHaveLength(1);
  expect(initializedComponent.find(TemplateInstance)).toHaveLength(1);
  expect(children[0].id).toEqual('TotalCholesterol');
});

test('adds a conjunction instance', () => {
  const instance = createTemplateInstance(orTemplate);

  expect(initializedComponent.state().instanceTree.childInstances).toHaveLength(0);
  expect(initializedComponent.find(ConjunctionGroup)).toHaveLength(1);

  initializedComponent.node.addInstance(instance, 'childInstances');

  expect(initializedComponent.state().instanceTree.childInstances).toHaveLength(1);
  expect(initializedComponent.find(ConjunctionGroup)).toHaveLength(2);
});

test('adds instance at correct tree position', () => {
  const conjunctionInstance = createTemplateInstance(orTemplate);
  const observationInstance = createTemplateInstance(cholesterolTemplate);

  initializedComponent.node.addInstance(conjunctionInstance, 'childInstances');
  initializedComponent.node.addInstance(observationInstance, 'childInstances.0');

  const secondLevelChildren = initializedComponent.state().instanceTree.childInstances[0].childInstances;

  expect(initializedComponent.find(TemplateInstance)).toHaveLength(1);
  expect(secondLevelChildren).toHaveLength(1);
  expect(secondLevelChildren[0].id).toEqual('TotalCholesterol');
});

test('edits a template instance', () => {
  initializedComponent.setState({
    instanceTree: instanceTree
  });

  initializedComponent.node.editInstance({ element_name: 'test' }, 'childInstances.0');

  expect(initializedComponent.state().instanceTree.childInstances[0].parameters[0].value).toEqual('test');
});

test('edits a conjunction instance', () => {
  const instance = createTemplateInstance(orTemplate);
  initializedComponent.node.addInstance(instance, 'childInstances');
  let addedInstance = initializedComponent.state().instanceTree.childInstances[0];

  expect(addedInstance.id).toEqual('Or');
  expect(addedInstance.name).toEqual('Or');

  initializedComponent.node.editInstance({ id: 'And', name: 'And' }, 'childInstances.0', true);
  addedInstance = initializedComponent.state().instanceTree.childInstances[0];

  expect(addedInstance.id).toEqual('And');
  expect(addedInstance.name).toEqual('And');
});

test('deletes instance at correct tree position', () => {
  initializedComponent.setState({
    instanceTree: instanceTree
  });
  const initialInstancesLength = instanceTree.childInstances.length;

  const deleteButton = initializedComponent.find(TemplateInstance).first().find('.element__deletebutton');
  deleteButton.simulate('click');
  initializedComponent.update();

  const children = initializedComponent.state().instanceTree.childInstances;

  expect(children).toHaveLength(initialInstancesLength - 1);
  expect(initializedComponent.find(TemplateInstance)).toHaveLength(initialInstancesLength - 1);
  expect(children.find(c => c.id === 'age_range')).toEqual(undefined);
  expect(children[0].id).toEqual('most_recent_observation');
});

test('gets a list of all instances', () => {
  expect(initializedComponent.node.getAllInstances()).toHaveLength(0);

  const conjunctionInstance = createTemplateInstance(orTemplate);
  const observationInstance = createTemplateInstance(cholesterolTemplate);
  initializedComponent.node.addInstance(conjunctionInstance, 'childInstances');
  initializedComponent.node.addInstance(observationInstance, 'childInstances.0');

  expect(initializedComponent.node.getAllInstances()).toHaveLength(2);
});
