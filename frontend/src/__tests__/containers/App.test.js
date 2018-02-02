import { createMockStore } from 'redux-test-utils';
import App from '../../containers/App';
import { shallowRenderContainer } from '../../utils/test_helpers';

test('App renders without crashing', () => {
  const state = {
    auth: { isAuthenticated: false, username: '' },
    errors: { errorMessage: '' }
  };
  const component = shallowRenderContainer(App, {}, createMockStore(state));
  expect(component).toBeDefined();
});
