import React from 'react';
import PatientTable from '../PatientTable';
import mockPatientDstu2 from '../../../mocks/mockPatientDstu2';
import mockPatientStu3 from '../../../mocks/mockPatientStu3';
import mockPatientR4 from '../../../mocks/mockPatientR4';
import { render, fireEvent, openSelect } from '../../../utils/test-utils';

describe('<PatientTable />', () => {
  const artifactsMock = [
    {
      _id: 'blah',
      name: 'My CDS Patient',
      version: 'Alpha',
      updatedAt: '2012-10-15T21:26:17Z',
      parameters: [{
        value: 'true',
        comment: null,
        type: 'boolean',
        uniqueId: 'parameter-72',
        name: 'BoolParam',
        usedBy: []
      }],
      fhirVersion: ''
    },
    {
      _id: 'blah2',
      name: 'My Second CDS Patient',
      version: 'Alpha',
      updatedAt: '2012-11-15T21:26:17Z'
    }
  ];
  const patientsMock = [mockPatientDstu2, mockPatientStu3, mockPatientR4];

  const renderComponent = (props = {}) =>
    render(
      <PatientTable
        patients={patientsMock}
        artifacts={artifactsMock}
        deletePatient={jest.fn()}
        executeCQLArtifact={jest.fn()}
        vsacApiKey={'key'}
        loginVSACUser={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        vsacIsAuthenticating={false}
        isValidatingCode={false}
        validateCode={jest.fn()}
        resetCodeValidation={jest.fn()}
        {...props}
      />
    );

  it('renders patients', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('tbody tr')).toHaveLength(patientsMock.length);
  });

  it('can open confirmation modal and deletes from modal', () => {
    const deletePatientMock = jest.fn();
    const { container } = renderComponent({ deletePatient: deletePatientMock });

    fireEvent.click(container.querySelector('button.danger-button'));

    const modal = document.body.querySelector('.confirm-delete-modal-modal');
    expect(modal.querySelector('.modal__header')).toHaveTextContent('Delete Patient Confirmation');

    fireEvent.click(modal.querySelector('button[type="submit"]'));
    expect(deletePatientMock).toBeCalledWith(patientsMock[0]);
  });

  it('opens the details modal when view is clicked', () => {
    const { container } = renderComponent();

    fireEvent.click(container.querySelector('button.details-button'));

    const modal = document.body.querySelector('.view-details-modal-modal');
    expect(modal.querySelector('.modal__header')).toHaveTextContent('View Patient Details');
  });

  it('executes opens confirmation modal and executes from modal', () => {
    const executeCQLMock = jest.fn();
    const { container, getByText } = renderComponent({ executeCQLArtifact: executeCQLMock });

    fireEvent.click(container.querySelector('button.invisible-button'));
    fireEvent.click(container.querySelector('button.execute-button'));

    const modal = document.body.querySelector('.execute-cql-modal-modal');
    expect(modal.querySelector('.modal__header')).toHaveTextContent('Execute CQL on Selected Patients');

    openSelect(getByText('Select...'));
    fireEvent.click(getByText(artifactsMock[0].name, modal));

    const booleanEditor = modal.querySelector('.boolean-editor');
    openSelect(getByText('True', booleanEditor));
    fireEvent.click(getByText('False', booleanEditor));

    fireEvent.click(modal.querySelector('button[type="submit"]'));

    expect(executeCQLMock).toHaveBeenCalled();
  });
});
