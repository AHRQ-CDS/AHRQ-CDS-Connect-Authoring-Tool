import { createMockStore } from 'redux-test-utils';
import Builder from '../../containers/Builder';
import { shallowRenderContainer } from '../../utils/test_helpers';
import { elementGroups } from '../../utils/test_fixtures';

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
