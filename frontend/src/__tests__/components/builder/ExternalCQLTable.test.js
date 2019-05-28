import ExternalCQLTable from '../../../components/builder/ExternalCqlTable';
import mockExternalLib from '../../../mocks/mockExternalCQLLibrary.json';
import { shallowRenderComponent, fullRenderComponent, ReactWrapper } from '../../../utils/test_helpers';

const externalLibrariesMock = [mockExternalLib];

test('ExternalCQLTable renders without crashing', () => {
  const component = shallowRenderComponent(ExternalCQLTable, {
    artifact: {},
    loadExternalCqlList: jest.fn(),
    externalCqlList: []
  });

  expect(component).toBeDefined();
});

test('ExternalCQLTable renders external libraries', () => {
  const component = shallowRenderComponent(ExternalCQLTable, {
    artifact: {},
    loadExternalCqlList: jest.fn(),
    externalCqlList: externalLibrariesMock
  });

  expect(component.find('tbody tr')).toHaveLength(externalLibrariesMock.length);
});

test('ExternalCQLTable delete opens confirmation modal and deletes from modal', () => {
  const deleteExternalCqlLibraryMock = jest.fn();
  const component = fullRenderComponent(ExternalCQLTable, {
    artifact: {},
    loadExternalCqlList: jest.fn(),
    externalCqlList: externalLibrariesMock,
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
  const component = fullRenderComponent(ExternalCQLTable, {
    artifact: {},
    loadExternalCqlList: jest.fn(),
    externalCqlList: externalLibrariesMock,
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
