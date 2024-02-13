import React from 'react';
import { render, screen, userEvent, waitFor, within } from 'utils/test-utils';
import nock from 'nock';
import FileSaver from 'file-saver';

import { mockPatientDstu2, mockPatientStu3, mockPatientR4 } from 'mocks/patients';
import PatientsTable from '../PatientsTable';

jest.mock('file-saver');

describe('<PatientsTable />', () => {
  const patientsMock = [mockPatientDstu2, mockPatientStu3, mockPatientR4];

  const renderComponent = (props = {}) =>
    render(<PatientsTable patients={patientsMock} handleExecuteCQL={jest.fn()} {...props} />);

  afterAll(() => nock.restore());

  it('renders all patient rows', () => {
    renderComponent();

    expect(screen.getByRole('row', { name: /Arnulfo253 McClure239/ })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Geneva168 Reynolds644/ })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Robin67 Baumbach677/ })).toBeInTheDocument();
  });

  it('disables the checkbox and renders a tooltip if a patient cannot be selected', async () => {
    renderComponent({
      patients: [...patientsMock, { ...mockPatientStu3, _id: 'foo' }]
    });

    const stu3PatientCheckboxes = screen.getAllByRole('checkbox', { name: /Arnulfo253 McClure239/ });
    await waitFor(() => userEvent.click(stu3PatientCheckboxes[0]));

    expect(stu3PatientCheckboxes[0].closest('.MuiCheckbox-root')).toHaveClass('Mui-checked');
    expect(stu3PatientCheckboxes[1]).not.toBeDisabled();

    expect(screen.getByRole('checkbox', { name: /Geneva168 Reynolds644/ })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: /Robin67 Baumbach677/ })).toBeDisabled();

    expect(
      screen.getAllByRole('cell', {
        name: /To select this patient, first deselect all patients of other FHIR versions/
      })
    ).toHaveLength(2);
  });

  it('opens the patient details modal when the view button is clicked', async () => {
    renderComponent();

    await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: 'view patient details' })[0]));
    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText('View Patient Details')).toBeInTheDocument();
  });

  it('allows for patient data to be downloaded', async () => {
    const mockSaveAs = jest.fn();
    FileSaver.saveAs.mockImplementation(mockSaveAs);

    renderComponent();

    const row = within(screen.getByRole('row', { name: /R4/ }));
    await waitFor(() => userEvent.click(row.getByRole('button', { name: 'download patient details' })));
    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    expect(mockSaveAs).toHaveBeenCalledWith(
      new Blob([mockPatientR4], { type: 'application/json' }),
      'Bundle-Geneva168-Reynolds644.json'
    );
  });

  it('opens the delete confirmation modal and deletes the patient when the delete button is clicked', async () => {
    renderComponent();

    const scope = nock('http://localhost').delete(`/authoring/api/testing/${mockPatientDstu2._id}`).reply(200);

    const row = within(screen.getByRole('row', { name: /DSTU2/ }));
    await waitFor(() => userEvent.click(row.getByRole('button', { name: 'delete patient' })));

    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText('Delete Patient Confirmation')).toBeInTheDocument();

    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: 'Delete' })));

    await waitFor(() => scope.done());
  });

  it('disables delete button and renders a tooltip if the patient is selected', async () => {
    renderComponent();

    // select the patient
    const patientCheckbox = screen.getByRole('checkbox', { name: /Geneva168 Reynolds644/ });
    await waitFor(() => userEvent.click(patientCheckbox));
    expect(patientCheckbox.closest('.MuiCheckbox-root')).toHaveClass('Mui-checked');

    // delete is disabled with tooltip
    const row = within(screen.getByRole('row', { name: /R4/ }));
    const deleteButton = row.getByRole('button', { name: 'delete patient' });
    expect(deleteButton).toBeDisabled();
    expect(screen.getAllByRole('cell', { name: /To delete this patient, first deselect it./ })).toHaveLength(1);

    // deselecting patient enables button and removes tooltip
    await waitFor(() => userEvent.click(patientCheckbox));
    expect(patientCheckbox.closest('.MuiCheckbox-root')).not.toHaveClass('Mui-checked');
    expect(deleteButton).not.toBeDisabled();
    expect(screen.queryAllByRole('cell', { name: /To delete this patient, first deselect it./ })).toHaveLength(0);
  });
});
