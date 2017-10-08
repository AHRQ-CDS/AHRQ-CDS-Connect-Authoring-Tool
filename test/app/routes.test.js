import { Route } from 'react-router-dom';
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

  expect(pathMap['/']).toBe(Landing);
  expect(pathMap['/build']).toBe(BuilderPage);
  expect(pathMap['/build/:id']).toBe(BuilderPage);
  expect(pathMap['/artifacts']).toBe(Artifact);
  expect(pathMap[undefined]).toBe(NoMatch);
});
