import { createMockStore } from 'redux-test-utils';
import { Route } from 'react-router-dom';
import PrivateRoute from '../../../src/containers/PrivateRoute';
import NotLoggedInPage from '../../../src/components/NotLoggedInPage';
import Artifact from '../../../src/components/artifact/Artifact';
import { shallowRenderContainer } from '../../test_helpers';

test('Unauthenticated user is rendered a Not Logged In message', () => {
  const state = {
    auth: { isAuthenticated: false }
  };
  const props = {
    component: Artifact
  };
  const component = shallowRenderContainer(PrivateRoute, props, createMockStore(state));

  expect(component).toBeDefined();
  expect(component.dive().find(Route).prop('component')).toBe(NotLoggedInPage);
});

test('Authenticated user is rendered the correct component', () => {
  const state = {
    auth: { isAuthenticated: true }
  };
  const props = {
    component: Artifact
  };
  const component = shallowRenderContainer(PrivateRoute, props, createMockStore(state));

  expect(component).toBeDefined();
  expect(component.dive().find(Route).prop('component')).toBe(Artifact);
});
