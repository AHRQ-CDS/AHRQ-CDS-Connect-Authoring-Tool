import Select from 'react-select';

import PatientTable from '../../../components/testing/PatientTable';
import mockPatientDstu2 from '../../../mocks/mockPatientDstu2';
import mockPatientStu3 from '../../../mocks/mockPatientStu3';
import { shallowRenderComponent, fullRenderComponent, fullRenderComponentOnBody, ReactWrapper } from '../../../utils/test_helpers';

const artifactsMock = [{
  _id: 'blah',
  name: 'My CDS Patient',
  version: 'Alpha',
  updatedAt: '2012-10-15T21:26:17Z',
  value: {
    parameters: [{
      value: 'true',
      comment: null,
      type: 'boolean',
      uniqueId: 'parameter-72',
      name: 'BoolParam',
      usedBy: []
    }]
  }
}, {
  _id: 'blah2',
  name: 'My Second CDS Patient',
  version: 'Alpha',
  updatedAt: '2012-11-15T21:26:17Z'
}];

const patientsMock = [mockPatientDstu2, mockPatientStu3];

test('PatientTable renders without crashing', () => {
  const component = shallowRenderComponent(PatientTable, {
    patients: patientsMock,
    artifacts: artifactsMock,
    deletePatient: jest.fn(),
    executeCQLArtifact: jest.fn(),
    vsacFHIRCredentials: { username: 'user', password: 'pw' },
    loginVSACUser: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    vsacIsAuthenticating: false,
    isValidatingCode: false,
    validateCode: jest.fn(),
    resetCodeValidation: jest.fn()
  });

  expect(component).toBeDefined();
});

test('PatientTable renders patients', () => {
  const component = shallowRenderComponent(PatientTable, {
    patients: patientsMock,
    artifacts: artifactsMock,
    deletePatient: jest.fn(),
    executeCQLArtifact: jest.fn(),
    vsacFHIRCredentials: { username: 'user', password: 'pw' },
    loginVSACUser: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    vsacIsAuthenticating: false,
    isValidatingCode: false,
    validateCode: jest.fn(),
    resetCodeValidation: jest.fn()
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
    vsacFHIRCredentials: { username: 'user', password: 'pw' },
    loginVSACUser: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    vsacIsAuthenticating: false,
    isValidatingCode: false,
    validateCode: jest.fn(),
    resetCodeValidation: jest.fn()
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
    vsacFHIRCredentials: { username: 'user', password: 'pw' },
    loginVSACUser: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    vsacIsAuthenticating: false,
    isValidatingCode: false,
    validateCode: jest.fn(),
    resetCodeValidation: jest.fn()
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
  const component = fullRenderComponentOnBody(PatientTable, {
    patients: patientsMock,
    artifacts: artifactsMock,
    deletePatient: jest.fn(),
    executeCQLArtifact: executeCQLMock,
    vsacFHIRCredentials: { username: 'user', password: 'pw' },
    loginVSACUser: jest.fn(),
    setVSACAuthStatus: jest.fn(),
    vsacIsAuthenticating: false,
    isValidatingCode: false,
    validateCode: jest.fn(),
    resetCodeValidation: jest.fn()
  });

  const executeCQLModal = component.children().findWhere(n => (
    n.node.props && n.node.props.id === 'execute-cql-modal'
  ));
  const executeButton = component.find('button.execute-button').first();
  const selectButton = component.find('button.invisible-button').first();

  expect(executeCQLModal.prop('isOpen')).toEqual(false);
  expect(component.state('showExecuteCQLModal')).toEqual(false);
  expect(component.state('patientsToExecute')).toEqual([]);
  selectButton.simulate('click');
  executeButton.simulate('click');
  expect(executeCQLModal.prop('isOpen')).toEqual(true);
  expect(component.state('showExecuteCQLModal')).toEqual(true);
  expect(component.state('patientsToExecute')).not.toEqual([]);

  const modalContent = new ReactWrapper(executeCQLModal.node.portal, true);
  expect(modalContent.text()).toContain('Execute CQL');

  expect(component.state('artifactToExecute')).toEqual(null);
  expect(component.state('paramsToExecute')).toEqual([]);
  const selectInput = modalContent.find(Select);
  selectInput.props().onChange(artifactsMock[0]);
  expect(component.state('artifactToExecute')).toEqual(artifactsMock[0]);
  expect(component.state('paramsToExecute')).toEqual([{ name: 'BoolParam', type: 'boolean', value: 'true' }]);
  // Simulate changing the parameter value
  const paramSelectInput = modalContent.find('.boolean-editor').find(Select);
  paramSelectInput.props().onChange({ label: 'False', value: 'false' });
  expect(component.state('paramsToExecute')).toEqual([{ name: 'BoolParam', type: 'boolean', value: 'false' }]);

  modalContent.find('form').simulate('submit');
  expect(executeCQLMock).toHaveBeenCalled();
});
