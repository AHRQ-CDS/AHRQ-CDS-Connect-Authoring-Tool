import NotFoundPage from '../../../src/components/NotFoundPage';
import { shallowRenderComponent } from '../../test_helpers';

test('App renders without crashing', () => {
  const component = shallowRenderComponent(NotFoundPage, {
    location: '/fake-path'
  });
  expect(component).toBeDefined();
});
