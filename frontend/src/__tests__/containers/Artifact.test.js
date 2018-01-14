import { createMockStore } from 'redux-test-utils';
import Artifact from '../../containers/Artifact';
import ArtifactTable from '../../components/artifact/ArtifactTable';
import NewArtifactForm from '../../components/artifact/NewArtifactForm';
import { shallowRenderContainer } from '../../utils/test_helpers';

const match = {
  path: ''
};

const artifactsMock = [{
  _id: 'blah',
  name: 'My CDS Artifact',
  version: 'Alpha',
  updatedAt: '2012-10-15T21:26:17Z'
}, {
  _id: 'blah2',
  name: 'My Second CDS Artifact',
  version: 'Alpha',
  updatedAt: '2012-11-15T21:26:17Z'
}];

test('Artifact renders without crashing', () => {
  const state = {
    artifacts: {
      artifacts: []
    }
  };
  const component = shallowRenderContainer(Artifact, { match }, createMockStore(state)).dive();
  expect(component).toBeDefined();
  expect(component.find(NewArtifactForm)).toBeDefined();
});

test('Artifact shows form and no table when there is no data', () => {
  const state = {
    artifacts: {
      artifacts: []
    }
  };
  const component = shallowRenderContainer(Artifact, { match }, createMockStore(state)).dive();

  expect(component.text()).toContain('No artifacts to show');
  expect(component.find(NewArtifactForm)).toBeDefined();
  expect(component.find(ArtifactTable)).toHaveLength(0);
});

test('Artifact shows a table when there is data', () => {
  const state = {
    artifacts: {
      artifacts: artifactsMock
    }
  };
  const component = shallowRenderContainer(Artifact, { match }, createMockStore(state)).dive();

  expect(component.text()).not.toContain('No artifacts to show');
  expect(component.find(ArtifactTable)).toHaveLength(1);
});
