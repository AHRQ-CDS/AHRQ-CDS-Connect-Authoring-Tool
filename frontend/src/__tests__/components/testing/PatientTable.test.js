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

// test('PatientTable allows editing of patients', () => {
//   const component = shallowRenderComponent(PatientTable, {
//     patients: patientsMock,
//     artifacts: artifactsMock,
//     deletePatient: jest.fn(),
//     executeCQLArtifact: jest.fn(),
//     vsacFHIRCredentials: {username: 'user', password: 'pw'},
//     loginVSACUser: jest.fn(),
//     setVSACAuthStatus: jest.fn(),
//     vsacIsAuthenticating: false
//   });

//   const button = component.find('button.edit-patient-button').first();
//   const editModal = component.children().findWhere(n => n.node.props && n.node.props.id === 'edit-modal');

//   expect(component.state('showEditPatientModal')).toEqual(false);
//   expect(component.state('patientEditing')).toEqual(null);
//   expect(editModal.prop('isOpen')).toEqual(false);
//   button.simulate('click');
//   component.update();
//   expect(component.state('showEditPatientModal')).toEqual(true);
//   expect(component.state('patientEditing')).not.toEqual(null);
//   expect(editModal.prop('isOpen')).toEqual(true);

//   // this allows you to continue using the enzyme wrapper API
//   const modalContent = new ReactWrapper(editModal.node.portal, true);

//   expect(modalContent.text()).toContain('Edit Patient');
//   modalContent.find('.modal__deletebutton').simulate('click');
//   component.update();
//   expect(component.state('showEditPatientModal')).toEqual(false);
//   // expect(component.state('patientEditing')).toEqual(null);
// });

// test('PatientTable delete opens confirmation modal and deletes from modal', () => {
//   const component = shallowRenderComponent(PatientTable, {
//     patients: patientsMock,
//     artifacts: artifactsMock,
//     deletePatient: jest.fn(),
//     executeCQLArtifact: jest.fn(),
//     vsacFHIRCredentials: {username: 'user', password: 'pw'},
//     loginVSACUser: jest.fn(),
//     setVSACAuthStatus: jest.fn(),
//     vsacIsAuthenticating: false
//   });

//   const confirmDeleteModal = component.children().findWhere(n => (
//     n.node.props && n.node.props.id === 'confirm-delete-modal'
//   ));
//   const button = component.find('button.danger-button').first();

//   expect(confirmDeleteModal.prop('isOpen')).toEqual(false);
//   expect(component.state('showConfirmDeleteModal')).toEqual(false);
//   expect(component.state('patientToDelete')).toEqual(null);
//   button.simulate('click');
//   expect(confirmDeleteModal.prop('isOpen')).toEqual(true);
//   expect(component.state('showConfirmDeleteModal')).toEqual(true);
//   expect(component.state('patientToDelete')).not.toEqual(null);

//   const modalContent = new ReactWrapper(confirmDeleteModal.node.portal, true);
//   expect(modalContent.text()).toContain('Delete Patient Confirmation');

//   modalContent.find('form').simulate('submit');
//   expect(deletePatientMock).toHaveBeenCalled();
// });
