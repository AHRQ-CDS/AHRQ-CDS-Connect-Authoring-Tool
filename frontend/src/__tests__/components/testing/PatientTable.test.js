import PatientTable from '../../../components/testing/PatientTable';
import mockPatient from '../../../mocks/mockPatient';
import { shallowRenderComponent, fullRenderComponent, ReactWrapper } from '../../../utils/test_helpers';

const artifactsMock = [{
  _id: 'blah',
  name: 'My CDS Patient',
  version: 'Alpha',
  updatedAt: '2012-10-15T21:26:17Z'
}, {
  _id: 'blah2',
  name: 'My Second CDS Patient',
  version: 'Alpha',
  updatedAt: '2012-11-15T21:26:17Z'
}];

const patientsMock = [mockPatient];

test('PatientTable renders without crashing', () => {
  const component = shallowRenderComponent(PatientTable, {
    patients: patientsMock,
    artifacts: artifactsMock,
    deletePatient: jest.fn(),
    executeCQLArtifact: jest.fn(),
    vsacFHIRCredentials: {username: 'user', password: 'pw'},
    loginVSACUser: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    vsacIsAuthenticating: false
  });

  expect(component).toBeDefined();
});

test('PatientTable renders patients', () => {
  const component = shallowRenderComponent(PatientTable, {
    patients: patientsMock,
    artifacts: artifactsMock,
    deletePatient: jest.fn(),
    executeCQLArtifact: jest.fn(),
    vsacFHIRCredentials: {username: 'user', password: 'pw'},
    loginVSACUser: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    vsacIsAuthenticating: false
  });

  expect(component.find('tbody tr')).toHaveLength(patientsMock.length);
});

test('PatientTable delete opens confirmation modal and deletes from modal', () => {
  const deletePatientMock = jest.fn();
  const component = fullRenderComponent(PatientTable, {
    patients: patientsMock,
    artifacts: artifactsMock,
    deletePatient: deletePatientMock,
    executeCQLArtifact: jest.fn(),
    vsacFHIRCredentials: {username: 'user', password: 'pw'},
    loginVSACUser: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    vsacIsAuthenticating: false
  });

  const confirmDeleteModal = component.children().findWhere(n => (
    n.node.props && n.node.props.id === 'confirm-delete-modal'
  ));
  const button = component.find('button.danger-button').first();

  expect(confirmDeleteModal.prop('isOpen')).toEqual(false);
  expect(component.state('showConfirmDeleteModal')).toEqual(false);
  expect(component.state('patientToDelete')).toEqual(null);
  button.simulate('click');
  expect(confirmDeleteModal.prop('isOpen')).toEqual(true);
  expect(component.state('showConfirmDeleteModal')).toEqual(true);
  expect(component.state('patientToDelete')).not.toEqual(null);

  const modalContent = new ReactWrapper(confirmDeleteModal.node.portal, true);
  expect(modalContent.text()).toContain('Delete Patient Confirmation');

  modalContent.find('form').simulate('submit');
  expect(deletePatientMock).toHaveBeenCalled();
});

test('PatientTable view opens details modal', () => {
  const component = fullRenderComponent(PatientTable, {
    patients: patientsMock,
    artifacts: artifactsMock,
    deletePatient: jest.fn(),
    executeCQLArtifact: jest.fn(),
    vsacFHIRCredentials: {username: 'user', password: 'pw'},
    loginVSACUser: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    vsacIsAuthenticating: false
  });

  const viewDetailsModal = component.children().findWhere(n => (
    n.node.props && n.node.props.id === 'view-details-modal'
  ));
  const button = component.find('button.details-button').first();

  expect(viewDetailsModal.prop('isOpen')).toEqual(false);
  expect(component.state('showViewDetailsModal')).toEqual(false);
  expect(component.state('patientToView')).toEqual(null);
  button.simulate('click');
  expect(viewDetailsModal.prop('isOpen')).toEqual(true);
  expect(component.state('showViewDetailsModal')).toEqual(true);
  expect(component.state('patientToView')).not.toEqual(null);

  const modalContent = new ReactWrapper(viewDetailsModal.node.portal, true);
  expect(modalContent.text()).toContain('View Patient Details');
});

test('PatientTable execute opens confirmation modal and executes from modal', () => {
  const executeCQLMock = jest.fn();
  const component = fullRenderComponent(PatientTable, {
    patients: patientsMock,
    artifacts: artifactsMock,
    deletePatient: jest.fn(),
    executeCQLArtifact: executeCQLMock,
    vsacFHIRCredentials: {username: 'user', password: 'pw'},
    loginVSACUser: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    vsacIsAuthenticating: false
  });

  const executeCQLModal = component.children().findWhere(n => (
    n.node.props && n.node.props.id === 'execute-cql-modal'
  ));
  const button = component.find('button.execute-button').first();

  expect(executeCQLModal.prop('isOpen')).toEqual(false);
  expect(component.state('showExecuteCQLModal')).toEqual(false);
  expect(component.state('patientToExecute')).toEqual(null);
  button.simulate('click');
  expect(executeCQLModal.prop('isOpen')).toEqual(true);
  expect(component.state('showExecuteCQLModal')).toEqual(true);
  expect(component.state('patientToExecute')).not.toEqual(null);

  const modalContent = new ReactWrapper(executeCQLModal.node.portal, true);
  expect(modalContent.text()).toContain('Execute CQL');
});