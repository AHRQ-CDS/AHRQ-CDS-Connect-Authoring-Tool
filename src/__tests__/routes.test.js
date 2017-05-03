import { Route } from 'react-router-dom';
import App from '../App';
import BuilderPage from '../components/builder/BuilderPage';
import NoMatch from '../components/NotFoundPage';
import Routes from '../routes';
import { shallowRenderComponent } from '../helpers/test_helpers';

test('Routes renders correct routes', () => {
  const component = shallowRenderComponent(Routes);
  const pathMap = component.find(Route).reduce((paths, route) => {
    Object.assign(paths, { [route.props().path]: route.props().component });
    return paths;
  }, {});

  expect(pathMap['/']).toBe(App);
  expect(pathMap['/build']).toBe(BuilderPage);
  expect(pathMap['/build/:group']).toBe(BuilderPage);
  expect(pathMap[undefined]).toBe(NoMatch);
});
