import NumberParameter from '../components/builder/parameters/NumberParameter';
import { shallowRenderComponent } from '../helpers/test_helpers';

test('NumberParameter renders without crashing', () => {
  const component = shallowRenderComponent(NumberParameter);
  expect(component).toBeDefined();
});
