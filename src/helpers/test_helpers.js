import React from 'react';
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';
import { mount, shallow } from 'enzyme';
import createRouterContext from 'react-router-test-context';


/**
 * Wraps a component into a DragDropContext that uses the TestBackend.
 */
function wrapInTestContext(DecoratedComponent) {
  return DragDropContext(TestBackend)(
    React.createClass({
      render() {
        return <DecoratedComponent {...this.props} />;
      }
    })
  );
}

/**
 * Render a component with props, mocking the router context
 */
function fullRenderComponent(ComponentClass, props = {}) {
  const context = createRouterContext();
  ComponentClass.contextTypes = { // eslint-disable-line no-param-reassign
    router: React.PropTypes.object
  };
  return mount(
    <ComponentClass {...props} />,
    { context }
  );
}

function shallowRenderComponent(ComponentClass, props = {}) {
  const context = createRouterContext();
  return shallow(
    <ComponentClass {...props} />,
    { context }
  );
}

/**
 * Helper methods for fetching the state of an Enzyme-mounted component that may
 or may not be wrapped in a decorator (such as with React DnD, or Redux if we ever use
 it). Regular enzyme methods will not work. It's hacky and stupid but it does the thing.
 */
function deepState(renderedComponent) {
  return renderedComponent.at(0).node.child.state;
}

function decoratedDeepState(renderedComponent, realComponent) {
  return renderedComponent.find(realComponent).at(0).node.decoratedComponentInstance.state;
}

export {
  wrapInTestContext,
  fullRenderComponent,
  shallowRenderComponent,
  deepState,
  decoratedDeepState
};
