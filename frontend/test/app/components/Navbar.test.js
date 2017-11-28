import Navbar from '../../../src/components/Navbar';
import { shallowRenderComponent } from '../../test_helpers';

test('Navbar renders without crashing', () => {
  const props = {
    isAuthenticated: false,
    loginUser() {},
    logoutUser() {}
  };
  const component = shallowRenderComponent(Navbar, props);
  expect(component).toBeDefined();
});
