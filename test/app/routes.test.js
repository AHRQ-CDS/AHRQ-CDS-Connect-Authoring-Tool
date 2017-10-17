import { Route } from 'react-router-dom';
import PrivateRoute from '../../src/containers/PrivateRoute';
import Landing from '../../src/components/Landing';
import BuilderPage from '../../src/components/builder/BuilderPage';
import Artifact from '../../src/components/artifact/Artifact';
import NoMatch from '../../src/components/NotFoundPage';
import Root from '../../src/containers/Root';
import { shallowRenderComponent } from '../test_helpers';

test('Routes renders correct routes', () => {
  const component = shallowRenderComponent(Root);
  const pathMap = component.find(Route).reduce((paths, route) => {
    Object.assign(paths, { [route.props().path]: route.props().component });
    return paths;
  }, {});

  const privatePathMap = component.find(PrivateRoute).reduce((paths, route) => {
    Object.assign(paths, { [route.props().path]: route.props().component });
    return paths;
  }, {});

  expect(pathMap['/']).toBe(Landing);
  expect(pathMap[undefined]).toBe(NoMatch);

  expect(privatePathMap['/build']).toBe(BuilderPage);
  expect(privatePathMap['/build/:id']).toBe(BuilderPage);
  expect(privatePathMap['/artifacts']).toBe(Artifact);
});
