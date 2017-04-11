import Navbar from '../components/Navbar';
import { shallowRenderComponent } from '../helpers/test_helpers';

test('Navbar renders without crashing', () => {
  const component = shallowRenderComponent(Navbar);
  expect(component).toBeDefined();
});
