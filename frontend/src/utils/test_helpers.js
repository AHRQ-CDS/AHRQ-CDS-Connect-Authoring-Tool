import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { mount, shallow, ReactWrapper } from 'enzyme';
import { shallowWithStore } from 'enzyme-redux';
import createRouterContext from 'react-router-test-context';

/**
 * Render a component with props, mocking the router context
 */
function fullRenderComponent(ComponentClass, props = {}) {
  const context = createRouterContext();
  ComponentClass.contextTypes = { // eslint-disable-line no-param-reassign
    router: PropTypes.object
  };
  return mount(
    <ComponentClass id="root" {...props} />,
    { context }
  );
}

/**
 * Render a component with props, mocking the router context
 */
function fullRenderComponentOnBody(ComponentClass, props = {}) {
  const context = createRouterContext();
  ComponentClass.contextTypes = { // eslint-disable-line no-param-reassign
    router: PropTypes.object
  };
  return mount(
    <ComponentClass id="root" {...props} />,
    { context, attachTo: document.body }
  );
}

function shallowRenderComponent(ComponentClass, props = {}) {
  const context = createRouterContext();
  return shallow(
    <ComponentClass id="root" {...props} />,
    { context }
  );
}

function fullRenderContainer(ComponentClass, props = {}, store) {
  const routerContext = createRouterContext();
  const context = { ...routerContext, store };

  ComponentClass.contextTypes = { // eslint-disable-line no-param-reassign
    router: PropTypes.object,
    store: PropTypes.object
  };

  return mount(
    <ComponentClass {...props} />,
    { context }
  );
}

function shallowRenderContainer(ComponentClass, props = {}, store) {
  return shallowWithStore(
    <ComponentClass id="root" {...props} />,
    store
  );
}

/**
 * Helper methods for fetching the state of an Enzyme-mounted component that may
 or may not be wrapped in a decorator (such as Redux if we ever use
 it). Regular enzyme methods will not work. It's hacky and stupid but it does the thing.
 */
function deepState(renderedComponent) {
  return renderedComponent.at(0).node.state;
}

function decoratedDeepState(renderedComponent, realComponent) {
  return renderedComponent.find(realComponent).at(0).node.decoratedComponentInstance.state;
}

function createTemplateInstance(template, children = undefined) {
  const instance = _.cloneDeep(template);
  instance.uniqueId = _.uniqueId(instance.id);

  if (template.conjunction) {
    instance.childInstances = children || [];
  }

  return instance;
}

export {
  fullRenderComponent,
  fullRenderComponentOnBody,
  fullRenderContainer,
  shallowRenderComponent,
  shallowRenderContainer,
  deepState,
  decoratedDeepState,
  createTemplateInstance,
  ReactWrapper
};
