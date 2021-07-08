import React from 'react';
import { render, screen, userEvent, waitFor, within } from 'utils/test-utils';
import nock from 'nock';

import { mockPatientDstu2, mockPatientStu3, mockPatientR4 } from 'mocks/patients';
import PatientsTable from '../PatientsTable';

describe('<PatientsTable />', () => {
  const patientsMock = [mockPatientDstu2, mockPatientStu3, mockPatientR4];

  const renderComponent = (props = {}) =>
    render(<PatientsTable patients={patientsMock} handleExecuteCQL={jest.fn()} {...props} />);

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
    userEvent.click(stu3PatientCheckboxes[0]);

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

  it('opens the patient details modal when the view button is clicked', () => {
    renderComponent();

    userEvent.click(screen.getAllByRole('button', { name: 'View' })[0]);
    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText('View Patient Details')).toBeInTheDocument();
  });

  it('opens the delete confirmation modal and deletes the patient when the delete button is clicked', async () => {
    renderComponent();

    const scope = nock('http://localhost').delete(`/authoring/api/testing/${mockPatientDstu2._id}`).reply(200);

    const row = within(screen.getByRole('row', { name: /DSTU2/ }));
    userEvent.click(row.getByRole('button', { name: 'Delete' }));

    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText('Delete Patient Confirmation')).toBeInTheDocument();

    userEvent.click(dialog.getByRole('button', { name: 'Delete' }));

    await waitFor(() => scope.done());
  });
});
