import ArtifactTable from '../../../../src/components/artifact/ArtifactTable';
import { shallowRenderComponent, fullRenderComponent, ReactWrapper } from '../../../test_helpers';

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
  const editModal = component.children().findWhere(n => n.node.props && n.node.props.id === 'edit-modal');

  expect(component.state('showEditArtifactModal')).toEqual(false);
  expect(component.state('artifactEditing')).toEqual(null);
  expect(editModal.prop('isOpen')).toEqual(false);
  button.simulate('click');
  component.update();
  expect(component.state('showEditArtifactModal')).toEqual(true);
  expect(component.state('artifactEditing')).not.toEqual(null);
  expect(editModal.prop('isOpen')).toEqual(true);

  // this allows you to continue using the enzyme wrapper API
  const modalContent = new ReactWrapper(
    editModal.node.portal, true
  );

  expect(modalContent.text()).toContain('Edit Artifact');
  modalContent.find('.modal__deletebutton').simulate('click');
  component.update();
  expect(component.state('showEditArtifactModal')).toEqual(false);
  // expect(component.state('artifactEditing')).toEqual(null);
  expect(editModal.prop('isOpen')).toEqual(false);
});

test('ArtifactTable delete opens confirmation modal and deletes from modal', () => {
  const afterAddArtifactMock = jest.fn();
  const deleteArtifactMock = jest.fn();
  const component = fullRenderComponent(ArtifactTable, {
    match,
    afterAddArtifact: afterAddArtifactMock,
    artifacts: artifactsMock,
    editArtifact: jest.fn(),
    deleteArtifact: deleteArtifactMock
  });

  const confirmDeleteModal = component.children().findWhere(n => (
    n.node.props && n.node.props.id === 'confirm-delete-modal'
  ));
  const button = component.find('button.danger-button').first();

  expect(confirmDeleteModal.prop('isOpen')).toEqual(false);
  expect(component.state('showConfirmDeleteModal')).toEqual(false);
  expect(component.state('artifactToDelete')).toEqual(null);
  button.simulate('click');
  expect(confirmDeleteModal.prop('isOpen')).toEqual(true);
  expect(component.state('showConfirmDeleteModal')).toEqual(true);
  expect(component.state('artifactToDelete')).not.toEqual(null);

  const modalContent = new ReactWrapper(
    confirmDeleteModal.node.portal, true
  );
  expect(modalContent.text()).toContain('Delete Artifact Confirmation');

  modalContent.find('form').simulate('submit');
  expect(deleteArtifactMock).toHaveBeenCalled();
});
