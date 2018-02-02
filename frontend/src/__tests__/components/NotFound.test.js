import NotFoundPage from '../../components/NotFoundPage';
import { shallowRenderComponent } from '../../utils/test_helpers';

test('App renders without crashing', () => {
  const component = shallowRenderComponent(NotFoundPage, {
    location: '/fake-path'
  });
  expect(component).toBeDefined();
});
