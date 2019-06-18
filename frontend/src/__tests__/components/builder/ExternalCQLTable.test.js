import ExternalCQLTable from '../../../components/builder/ExternalCqlTable';
import mockExternalLib from '../../../mocks/mockExternalCQLLibrary.json';
import mockExternalLibDependency from '../../../mocks/mockExternalCQLLibraryDependency.json';
import { shallowRenderComponent, ReactWrapper, fullRenderComponentOnBody } from '../../../utils/test_helpers';

const externalLibrariesMock = [mockExternalLib, mockExternalLibDependency];

test('ExternalCQLTable renders without crashing', () => {
  const component = shallowRenderComponent(ExternalCQLTable, {
    artifact: {},
    loadExternalCqlList: jest.fn(),
    isLoadingExternalCqlDetails: false,
    externalCqlList: [],
    externalCQLLibraryParents: {},
    loadExternalCqlLibraryDetails: jest.fn(),
    deleteExternalCqlLibrary: jest.fn()
  });

  expect(component).toBeDefined();
});

test('ExternalCQLTable renders external libraries', () => {
  const component = shallowRenderComponent(ExternalCQLTable, {
    artifact: {},
    loadExternalCqlList: jest.fn(),
    isLoadingExternalCqlDetails: false,
    externalCqlList: externalLibrariesMock,
    externalCQLLibraryParents: {},
    loadExternalCqlLibraryDetails: jest.fn(),
    deleteExternalCqlLibrary: jest.fn()
  });

  expect(component.find('tbody tr')).toHaveLength(externalLibrariesMock.length);
});

test('ExternalCQLTable delete opens confirmation modal and deletes from modal', () => {
  const deleteExternalCqlLibraryMock = jest.fn();
  const component = fullRenderComponentOnBody(ExternalCQLTable, {
    artifact: {},
    loadExternalCqlList: jest.fn(),
    isLoadingExternalCqlDetails: false,
    externalCqlList: externalLibrariesMock,
    externalCQLLibraryParents: {},
    loadExternalCqlLibraryDetails: jest.fn(),
    deleteExternalCqlLibrary: deleteExternalCqlLibraryMock
  });

  const confirmDeleteModal = component.children().findWhere(n => (
    n.node.props && n.node.props.id === 'confirm-delete-modal'
  ));
  const button = component.find('button.danger-button').first();

  expect(confirmDeleteModal.prop('isOpen')).toEqual(false);
  expect(component.state('showConfirmDeleteModal')).toEqual(false);
  expect(component.state('externalCqlLibraryToDelete')).toEqual(null);
  button.simulate('click');
  expect(confirmDeleteModal.prop('isOpen')).toEqual(true);
  expect(component.state('showConfirmDeleteModal')).toEqual(true);
  expect(component.state('externalCqlLibraryToDelete')).not.toEqual(null);
  expect(component.state('externalCqlLibraryToDelete')).toEqual(mockExternalLib);

  const modalContent = new ReactWrapper(confirmDeleteModal.node.portal, true);
  expect(modalContent.text()).toContain('Delete External CQL Library Confirmation');

  modalContent.find('form').simulate('submit');
  expect(deleteExternalCqlLibraryMock).toHaveBeenCalled();
});

test('ExternalCQLTable view opens details modal', () => {
  const component = fullRenderComponentOnBody(ExternalCQLTable, {
    artifact: {},
    loadExternalCqlList: jest.fn(),
    isLoadingExternalCqlDetails: false,
    externalCqlList: externalLibrariesMock,
    externalCQLLibraryParents: {},
    deleteExternalCqlLibrary: jest.fn(),
    loadExternalCqlLibraryDetails: jest.fn(),
    externalCqlLibraryDetails: mockExternalLib
  });

  const button = component.find('button.details-button').first();

  expect(component.state('showViewDetailsModal')).toEqual(false);
  expect(component.state('externalCqlLibraryToView')).toEqual(null);
  button.simulate('click');
  const viewDetailsModal = component.children().findWhere(n => (
    n.node.props && n.node.props.id === 'view-details-modal'
  ));
  expect(viewDetailsModal.prop('isOpen')).toEqual(true);
  expect(component.state('showViewDetailsModal')).toEqual(true);
  expect(component.state('externalCqlLibraryToView')).not.toEqual(null);
  expect(component.state('externalCqlLibraryToView')).toEqual(mockExternalLib);

  const modalContent = new ReactWrapper(viewDetailsModal.node.portal, true);
  expect(modalContent.text()).toContain('View External CQL Details');
});

test('ExternalCQLTable doesn\'t allow delete on libraries that are depended on by others', () => {
  const deleteExternalCqlLibraryMock = jest.fn();
  const libParents = {
    'cql-upload-1.0.0': [],
    'cds-connect-conversions-new-2': ['cql-upload-1.0.0']
  };

  const component = fullRenderComponentOnBody(ExternalCQLTable, {
    artifact: {},
    loadExternalCqlList: jest.fn(),
    isLoadingExternalCqlDetails: false,
    externalCqlList: externalLibrariesMock,
    externalCQLLibraryParents: libParents,
    deleteExternalCqlLibrary: deleteExternalCqlLibraryMock,
    loadExternalCqlLibraryDetails: jest.fn(),
    externalCqlLibraryDetails: mockExternalLib
  });

  const confirmDeleteModal = component.children().findWhere(n => (
    n.node.props && n.node.props.id === 'confirm-delete-modal'
  ));

  // Two libraries, one depends on the other. Dependency delete is disabled.
  let deleteButtons = component.find('button.danger-button');
  let disabledButton = component.find('button.danger-button.disabled');
  expect(deleteButtons).toHaveLength(externalLibrariesMock.length);
  expect(disabledButton).toHaveLength(1);

  // Clicking disabled delete button does nothing
  disabledButton.simulate('click');
  expect(confirmDeleteModal.prop('isOpen')).toEqual(false);
  expect(component.state('showConfirmDeleteModal')).toEqual(false);

  // Delete a library that has no parents
  deleteButtons.not('.disabled').first().simulate('click');
  expect(confirmDeleteModal.prop('isOpen')).toEqual(true);
  expect(component.state('showConfirmDeleteModal')).toEqual(true);
  const modalContent = new ReactWrapper(confirmDeleteModal.node.portal, true);
  modalContent.find('form').simulate('submit');
  expect(deleteExternalCqlLibraryMock).toHaveBeenCalled();

  // Reset props to reflect deleting the parent library
  component.setProps({
    externalCqlList: [mockExternalLibDependency],
    externalCQLLibraryParents: { 'cds-connect-conversions-new-2': [] }
  });
  deleteButtons = component.find('button.danger-button');
  disabledButton = component.find('button.danger-button.disabled');

  // Once no parents, disabled button is active again
  expect(deleteButtons).toHaveLength(externalLibrariesMock.length - 1);
  expect(disabledButton).toHaveLength(0);
});
