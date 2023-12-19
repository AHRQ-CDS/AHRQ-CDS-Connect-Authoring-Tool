import React from 'react';
import { render, screen, userEvent, waitFor } from 'utils/test-utils';

import { mockPatientDstu2, mockPatientStu3, mockPatientR4 } from 'mocks/patients';
import { getPatientAge } from 'utils/patients';
import PatientDetailsModal from '../PatientDetailsModal';

describe('<PatientDetailsModal />', () => {
  const renderComponent = (props = {}) => render(<PatientDetailsModal handleCloseModal={jest.fn()} {...props} />);

  it('calls handleCloseModal when closing the modal', async () => {
    const handleCloseModal = jest.fn();
    renderComponent({ handleCloseModal, patient: mockPatientDstu2 });

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Close' })));

    expect(handleCloseModal).toHaveBeenCalled();
  });

  describe('DSTU2 patients', () => {
    const patient = mockPatientDstu2;

    it('renders the patient card', () => {
      renderComponent({ patient });

      expect(screen.getByText(/Robin67 Baumbach677/)).toBeInTheDocument();
      expect(screen.getByText(/female/)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(getPatientAge(patient)))).toBeInTheDocument();
    });

    it('renders the patient details sections', () => {
      renderComponent({ patient });

      [
        'Organizations (2)',
        'Conditions (19)',
        'Allergies (2)',
        'Medications (14)',
        'Careplans (8)',
        'Encounters (112)',
        'Observations (143)',
        'Immunizations (39)',
        'Procedures (186)',
        'Imaging (2)',
        'Diagnostics (1)',
        'Claims (126)',
        'Other (2)'
      ].forEach(name => {
        expect(screen.getByRole('button', { name })).toBeInTheDocument();
      });
    });
  });

  describe('STU3 patients', () => {
    const patient = mockPatientStu3;

    it('renders the patient card', () => {
      renderComponent({ patient });

      expect(screen.getByText(/Arnulfo253 McClure239/)).toBeInTheDocument();
      expect(screen.getByText(/male/)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(getPatientAge(patient)))).toBeInTheDocument();
    });

    it('renders the patient details sections', () => {
      renderComponent({ patient });

      [
        'Organizations (2)',
        'Conditions (11)',
        'Medications (8)',
        'Careplans (5)',
        'Encounters (45)',
        'Observations (130)',
        'Immunizations (41)',
        'Procedures (19)',
        'Imaging (1)',
        'Diagnostics (1)',
        'Claims (53)'
      ].forEach(name => {
        expect(screen.getByRole('button', { name })).toBeInTheDocument();
      });
    });
  });

  describe('R4 patients', () => {
    const patient = mockPatientR4;

    it('renders the patient card', () => {
      renderComponent({ patient });

      expect(screen.getByText(/Geneva168 Reynolds644/)).toBeInTheDocument();
      expect(screen.getByText(/female/)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(getPatientAge(patient)))).toBeInTheDocument();
    });

    it('renders the patient details sections', () => {
      renderComponent({ patient });

      ['Organizations (2)', 'Conditions (1)', 'Encounters (2)', 'Immunizations (1)', 'Claims (2)', 'Other (2)'].forEach(
        name => {
          expect(screen.getByRole('button', { name })).toBeInTheDocument();
        }
      );
    });
  });
});
