import App from '../App';
import { shallowRenderComponent } from '../helpers/test_helpers';

test('App renders without crashing', () => {
  const component = shallowRenderComponent(App);
  expect(component).toBeDefined();
});
