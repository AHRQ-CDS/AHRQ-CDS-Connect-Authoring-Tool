// import { Tab } from 'react-tabs';
import { createMockStore } from 'redux-test-utils';
// import _ from 'lodash';
import Builder from '../../containers/Builder';
// import ConjunctionGroup from '../../components/builder/ConjunctionGroup';
// import TemplateInstance from '../../components/builder/TemplateInstance';
import { shallowRenderContainer } from '../../utils/test_helpers';
// import { shallowRenderContainer, createTemplateInstance } from '../../utils/test_helpers';
// import { instanceTree, elementGroups } from '../../utils/test_fixtures';
import { elementGroups } from '../../utils/test_fixtures';

// const operations = elementGroups.find(g => g.name === 'Operations');
// const observations = elementGroups.find(g => g.name === 'Observations');
// const andTemplate = operations.entries.find(e => e.id === 'And');
// const orTemplate = operations.entries.find(e => e.id === 'Or');
// const cholesterolTemplate = observations.entries.find(e => e.id === 'TotalCholesterol');

// const match = {
//   params: {
//     group: 1
//   }
// };

const baseState = {
  artifacts: {
    artifact: {}
  },
  resources: {
    resources: []
  },
  valueSets: {
    valueSets: []
  },
  templates: {
    templates: elementGroups
  }
};

beforeEach(() => {
  // component = shallowRenderContainer(Builder, {}, createMockStore(state));

  // componentWithMatch = shallowRenderContainer(Builder, { match }, createMockStore(state));
  // initializedComponent = shallowRenderContainer(Builder, {}, createMockStore(state));
});

test('children have correct classes', () => {
  const component = shallowRenderContainer(Builder, {}, createMockStore(baseState));
  const classNames = ['upload__modal', 'edit__modal', 'builder__header', 'builder__canvas'];
  component.find('.builder-wrapper').children().forEach((node, i) => {
    expect(node.hasClass(classNames[i])).toBeTruthy();
  });
});

test('shows loading screen when artifact is not loaded', () => {
  const component = shallowRenderContainer(Builder, {}, createMockStore(Object.assign({}, baseState, {
    artifacts: { artifact: null }
  })));

  expect(component.dive().dive().hasClass('builder')).toBe(true);
  expect(component.dive().dive().text()).toContain('Loading...');
});

// test('renders a single level tree for Inclusions and Exclusions', () => {
//   const differentTree = _.cloneDeep(instanceTree);
//   differentTree.childInstances.pop();

//   const component = shallowRenderContainer(Builder, {}, createMockStore(Object.assign({}, baseState, {
//     artifacts: {
//       artifact: {
//         expTreeInclude: instanceTree,
//         expTreeExclude: differentTree
//       }
//     }
//   })));

//   expect(component.props().artifact.expTreeInclude.name).toEqual('And');
//   expect(component.props().artifact.expTreeInclude.childInstances).toHaveLength(2);

//   expect(component.dive().dive().find(ConjunctionGroup)).toHaveLength(1);
//   // expect(initializedComponent.find(TemplateInstance)).toHaveLength(2);

//   // switchToTab('Exclusions');

//   // expect(initializedComponent.state().expTreeExclude.name).toEqual('And');
//   // expect(initializedComponent.find(ConjunctionGroup)).toHaveLength(1);
//   // expect(initializedComponent.state().expTreeExclude.childInstances).toHaveLength(1);
//   // expect(initializedComponent.find(TemplateInstance)).toHaveLength(1);
// });

// test('adds a template instance', () => {
//   const instance = createTemplateInstance(cholesterolTemplate);

//   expect(initializedComponent.state().expTreeInclude.childInstances).toHaveLength(0);
//   expect(initializedComponent.find(TemplateInstance)).toHaveLength(0);

//   initializedComponent.node.addInstance('expTreeInclude', instance, 'childInstances');

//   const children = initializedComponent.state().expTreeInclude.childInstances;

//   expect(children).toHaveLength(1);
//   expect(initializedComponent.find(TemplateInstance)).toHaveLength(1);
//   expect(children[0].id).toEqual('TotalCholesterol');
// });

// test('adds a conjunction instance', () => {
//   const instance = createTemplateInstance(orTemplate);

//   expect(initializedComponent.state().expTreeInclude.childInstances).toHaveLength(0);
//   expect(initializedComponent.find(ConjunctionGroup)).toHaveLength(1);

//   initializedComponent.node.addInstance('expTreeInclude', instance, 'childInstances');

//   expect(initializedComponent.state().expTreeInclude.childInstances).toHaveLength(1);
//   expect(initializedComponent.find(ConjunctionGroup)).toHaveLength(2);
// });

// test('adds instance at correct tree position', () => {
//   const conjunctionInstance = createTemplateInstance(orTemplate);
//   const observationInstance = createTemplateInstance(cholesterolTemplate);

//   initializedComponent.node.addInstance('expTreeInclude', conjunctionInstance, 'childInstances');
//   initializedComponent.node.addInstance('expTreeInclude', observationInstance, 'childInstances.0');

//   const secondLevelChildren = initializedComponent.state().expTreeInclude.childInstances[0].childInstances;

//   expect(initializedComponent.find(TemplateInstance)).toHaveLength(1);
//   expect(secondLevelChildren).toHaveLength(1);
//   expect(secondLevelChildren[0].id).toEqual('TotalCholesterol');
// });

// test('edits a template instance', () => {
//   const name = 'test';
//   initializedComponent.setState({
//     expTreeInclude: instanceTree
//   });

//   initializedComponent.node.editInstance('expTreeInclude', { element_name: name }, 'childInstances.0');

//   expect(initializedComponent.state().expTreeInclude.childInstances[0].parameters[0].value).toEqual(name);
// });

// test('edits a conjunction instance', () => {
//   const instance = createTemplateInstance(orTemplate);
//   initializedComponent.node.addInstance('expTreeInclude', instance, 'childInstances');
//   let addedInstance = initializedComponent.state().expTreeInclude.childInstances[0];

//   expect(addedInstance.id).toEqual('Or');
//   expect(addedInstance.name).toEqual('Or');

//   initializedComponent.node.editInstance('expTreeInclude', { id: 'And', name: 'And' }, 'childInstances.0', true);
//   addedInstance = initializedComponent.state().expTreeInclude.childInstances[0];

//   expect(addedInstance.id).toEqual('And');
//   expect(addedInstance.name).toEqual('And');
// });

// test('updates an instance\'s modifiers', () => {
//   const modifiers = [
//     {
//       id: 'BooleanNot',
//       name: 'Not',
//       inputTypes: [
//         'boolean'
//       ],
//       returnType: 'boolean',
//       cqlTemplate: 'BaseModifier',
//       cqlLibraryFunction: 'not'
//     }
//   ];
//   initializedComponent.setState({
//     expTreeInclude: instanceTree
//   });

//   initializedComponent.node.updateInstanceModifiers('expTreeInclude', modifiers, 'childInstances.0');

//   expect(initializedComponent.state().expTreeInclude.childInstances[0].modifiers).toEqual(modifiers);
// });

// test('deletes instance at correct tree position', () => {
//   initializedComponent.setState({
//     expTreeInclude: instanceTree
//   });
//   const initialInstancesLength = instanceTree.childInstances.length;

//   const deleteButton = initializedComponent.find(TemplateInstance).first().find('.element__deletebutton');
//   deleteButton.simulate('click');

//   const children = initializedComponent.state().expTreeInclude.childInstances;

//   expect(children).toHaveLength(initialInstancesLength - 1);
//   expect(initializedComponent.find(TemplateInstance)).toHaveLength(initialInstancesLength - 1);
//   expect(children.find(c => c.id === 'age_range')).toEqual(undefined);
//   expect(children[0].id).toEqual('LDLTest');
// });

// test('gets a list of all instances', () => {
//   expect(initializedComponent.node.getAllInstances('expTreeExclude')).toHaveLength(0);

//   const conjunctionInstance = createTemplateInstance(orTemplate);
//   const observationInstance = createTemplateInstance(cholesterolTemplate);
//   initializedComponent.node.addInstance('expTreeExclude', conjunctionInstance, 'childInstances');
//   initializedComponent.node.addInstance('expTreeExclude', observationInstance, 'childInstances.0');

//   expect(initializedComponent.node.getAllInstances('expTreeExclude')).toHaveLength(2);
// });

// test('increments the uniqueId counter', () => {
//   const currentValue = initializedComponent.state().uniqueIdCounter;
//   initializedComponent.instance().incrementUniqueIdCounter();

//   expect(initializedComponent.state().uniqueIdCounter).toEqual(currentValue + 1);
// });
