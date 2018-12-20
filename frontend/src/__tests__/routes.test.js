import { Route } from 'react-router-dom';
import PrivateRoute from '../containers/PrivateRoute';
import Landing from '../containers/Landing';
import BuilderContainer from '../containers/Builder';
import Artifact from '../containers/Artifact';
import NoMatch from '../components/NotFoundPage';
import Root from '../containers/Root';
import { shallowRenderComponent } from '../utils/test_helpers';

test('Routes renders correct routes', () => {
  const props = { store: { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn() } };
  const component = shallowRenderComponent(Root, props);
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

  expect(privatePathMap['/build']).toBe(BuilderContainer);
  expect(privatePathMap['/build/:id']).toBe(BuilderContainer);
  expect(privatePathMap['/artifacts']).toBe(Artifact);
});
