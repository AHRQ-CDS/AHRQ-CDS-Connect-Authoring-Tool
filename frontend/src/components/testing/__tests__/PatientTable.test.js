import React from 'react';
import { render, userEvent, screen, waitFor, within } from 'utils/test-utils';
import mockPatientDstu2 from 'mocks/mockPatientDstu2';
import mockPatientStu3 from 'mocks/mockPatientStu3';
import mockPatientR4 from 'mocks/mockPatientR4';
import PatientTable from '../PatientTable';

describe('<PatientTable />', () => {
  const artifactsMock = [
    {
      _id: 'blah',
      name: 'My CDS Patient',
      version: 'Alpha',
      updatedAt: '2012-10-15T21:26:17Z',
      parameters: [
        {
          value: 'true',
          comment: null,
          type: 'boolean',
          uniqueId: 'parameter-72',
          name: 'BoolParam',
          usedBy: []
        }
      ],
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

  it('can open confirmation modal and deletes from modal', async () => {
    const deletePatientMock = jest.fn();
    renderComponent({ deletePatient: deletePatientMock });

    userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText('Delete Patient Confirmation')).toBeInTheDocument();

    userEvent.click(dialog.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(deletePatientMock).toBeCalledWith(patientsMock[0]);
    });
  });

  it('opens the details modal when view is clicked', () => {
    renderComponent();

    userEvent.click(screen.getAllByRole('button', { name: 'View' })[1]);

    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText('View Patient Details')).toBeInTheDocument();
  });

  it('executes opens confirmation modal and executes from modal', () => {
    const executeCQLMock = jest.fn();
    renderComponent({ executeCQLArtifact: executeCQLMock });

    userEvent.click(screen.getAllByRole('button', { name: 'view' })[0]); // select first patient
    userEvent.click(screen.getByRole('button', { name: 'Execute CQL on Selected Patients' })); // open modal

    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText('Execute CQL on Selected Patients')).toBeInTheDocument();

    userEvent.click(dialog.getByLabelText('Select...'));
    userEvent.click(screen.getByRole('option', { name: artifactsMock[0].name })); // select option

    userEvent.click(dialog.getByRole('button', { name: 'True' }));
    userEvent.click(screen.getByRole('option', { name: 'False' })); // choose param

    userEvent.click(dialog.getByText('Execute CQL'));

    expect(executeCQLMock).toHaveBeenCalledWith(
      artifactsMock[0],
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      { name: 'FHIR', version: '3.0.0' }
    );
  });
});
