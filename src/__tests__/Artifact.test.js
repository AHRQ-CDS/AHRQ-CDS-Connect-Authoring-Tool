import ReactModal from 'react-modal';
import Artifact from '../components/artifact/Artifact';
import ArtifactTable from '../components/artifact/ArtifactTable';
import ArtifactForm from '../components/artifact/ArtifactForm';
import { shallowRenderComponent, fullRenderComponent, ReactWrapper } from '../helpers/test_helpers';

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
  const component = shallowRenderComponent(Artifact, { match });
  expect(component).toBeDefined();
  expect(component.find(ArtifactForm)).toBeDefined();
});

test('Artifact shows form and no table when there is no data', () => {
  const component = shallowRenderComponent(Artifact, { match });

  component.setState({ data: [] });
  expect(component.text()).toContain('No artifacts to show');
  expect(component.find(ArtifactForm)).toBeDefined();
  expect(component.find(ArtifactTable)).toHaveLength(0);
});

test('Artifact shows a table when there is data', () => {
  const component = shallowRenderComponent(Artifact, { match });

  component.setState({ data: artifactsMock }, () => {
    component.update();
    expect(component.text()).not.toContain('No artifacts to show');
  });
  expect(component.find(ArtifactTable)).toHaveLength(1);
});

test('ArtifactTable renders without crashing', () => {
  const afterAddArtifactMock = jest.fn();
  const component = shallowRenderComponent(ArtifactTable, {
    match,
    afterAddArtifact: afterAddArtifactMock,
    artifacts: artifactsMock
  });

  expect(component).toBeDefined();
});

test('ArtifactTable renders artifacts', () => {
  const afterAddArtifactMock = jest.fn();
  const component = shallowRenderComponent(ArtifactTable, {
    match,
    afterAddArtifact: afterAddArtifactMock,
    artifacts: artifactsMock
  });

  expect(component.find('tbody tr')).toHaveLength(artifactsMock.length);
});

test('ArtifactTable allows editing of artifacts', () => {
  const afterAddArtifactMock = jest.fn();
  const component = fullRenderComponent(ArtifactTable, {
    match,
    afterAddArtifact: afterAddArtifactMock,
    artifacts: artifactsMock
  });

  const button = component.find('button.edit-artifact-button').first();

  expect(component.state('showModal')).toEqual(false);
  expect(component.state('artifactEditing')).toEqual(null);
  expect(component.find(ReactModal).prop('isOpen')).toEqual(false);
  button.simulate('click');
  component.update();
  expect(component.state('showModal')).toEqual(true);
  expect(component.state('artifactEditing')).not.toEqual(null);
  expect(component.find(ReactModal).prop('isOpen')).toEqual(true);

  // this allows you to continue using the enzyme wrapper API
  const modalContent = new ReactWrapper(
    component.find(ReactModal).node.portal, true
  );

  expect(modalContent.text()).toContain('Edit Artifact');
  expect(modalContent.find(ArtifactForm)).toHaveLength(1);

  modalContent.find('.modal__deletebutton').simulate('click');
  component.update();
  expect(component.state('showModal')).toEqual(false);
  // expect(component.state('artifactEditing')).toEqual(null);
  expect(component.find(ReactModal).prop('isOpen')).toEqual(false);
});

test('ArtifactTable allows deleting of artifacts', () => {
  const afterAddArtifactMock = jest.fn();
  const component = shallowRenderComponent(ArtifactTable, {
    match,
    afterAddArtifact: afterAddArtifactMock,
    artifacts: artifactsMock
  });

  const button = component.find('button.danger-button').first();
  component.instance().deleteArtifact = jest.fn();
  button.simulate('click');
  expect(component.instance().deleteArtifact).toHaveBeenCalled();
});

test('ArtifactForm renders without crashing', () => {
  const afterAddArtifactMock = jest.fn();
  const onSubmitMock = jest.fn();
  const component = shallowRenderComponent(ArtifactForm, {
    afterAddArtifact: afterAddArtifactMock,
    onSubmitFunction: onSubmitMock,
    buttonLabel: 'Submit'
  });

  expect(component).toBeDefined();
});

test('ArtifactForm allows submission without an onSubmitFunction', () => {
  const afterAddArtifactMock = jest.fn();
  const component = fullRenderComponent(ArtifactForm, {
    afterAddArtifact: afterAddArtifactMock,
    buttonLabel: 'Submit'
  });

  const form = component.find('form');
  const nameInput = form.find('input[name="name"]');
  const versionInput = form.find('input[name="version"]');
  const button = form.find('button');

  expect(component.state('name')).toEqual('');
  expect(component.state('version')).toEqual('');
  nameInput.simulate('change', { target: { name: 'name', value: 'NewArtifactName' } });
  versionInput.simulate('change', { target: { name: 'version', value: 'NewArtifactVersion' } });

  expect(component.state('name')).toEqual('NewArtifactName');
  expect(component.state('version')).toEqual('NewArtifactVersion');

  component.instance().addArtifact = jest.fn();
  component.update();
  form.simulate('submit', { preventDefault: jest.fn() });
  expect(component.instance().addArtifact).toHaveBeenCalled();
});

test('ArtifactForm allows submission with an onSubmitFunction', () => {
  const afterAddArtifactMock = jest.fn();
  const onSubmitMock = jest.fn();
  const component = fullRenderComponent(ArtifactForm, {
    afterAddArtifact: afterAddArtifactMock,
    onSubmitFunction: onSubmitMock,
    buttonLabel: 'Submit'
  });

  const form = component.find('form');
  const nameInput = form.find('input[name="name"]');
  const versionInput = form.find('input[name="version"]');
  const button = form.find('button');

  expect(component.state('name')).toEqual('');
  expect(component.state('version')).toEqual('');
  nameInput.simulate('change', { target: { name: 'name', value: 'NewArtifactName' } });
  versionInput.simulate('change', { target: { name: 'version', value: 'NewArtifactVersion' } });

  expect(component.state('name')).toEqual('NewArtifactName');
  expect(component.state('version')).toEqual('NewArtifactVersion');

  form.simulate('submit', { preventDefault: jest.fn() });
  expect(onSubmitMock).toHaveBeenCalled();
});
