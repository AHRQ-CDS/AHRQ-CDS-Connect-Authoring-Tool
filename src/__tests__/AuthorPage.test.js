import AuthorPage from '../components/AuthorPage';
import { shallowRenderComponent } from '../helpers/test_helpers';

test('App renders without crashing', () => {
  const component = shallowRenderComponent(AuthorPage);
  expect(component).toBeDefined();
});
