import React from 'react';
import PatientView from '../PatientView';
import { render } from '../../../utils/test-utils';
import mockPatientDstu2 from '../../../mocks/mockPatientDstu2';
import mockPatientStu3 from '../../../mocks/mockPatientStu3';

describe('<PatientView />', () => {
  it('renders DSTU2 without crashing', () => {
    const { container } = render(
      <PatientView patient={mockPatientDstu2} />
    );

    expect(container).not.toBeEmpty();
  });

  it('header renders DSTU2 correctly', () => {
    const { container } = render(
      <PatientView patient={mockPatientDstu2} />
    );

    expect(container.querySelectorAll('.patient-view__patient')).toHaveLength(1);
    expect(container.querySelector('.patient-data-name')).toHaveTextContent('Robin67 Baumbach677');
    expect(container.querySelector('.patient-data-details-gender')).toHaveTextContent('female');
    expect(container.querySelector('.patient-data-details-age')).toHaveTextContent('34 yrs');
  });

  it('renders the DSTU2 resources', () => {
    const { container } = render(
      <PatientView patient={mockPatientDstu2} />
    );

    expect(container.querySelectorAll('.patient-view__resources')).toHaveLength(1);
  });

  it('renders STU3 without crashing', () => {
    const { container } = render(
      <PatientView patient={mockPatientStu3} />
    );

    expect(container).not.toBeEmpty();
  });

  it('header renders STU3 correctly', () => {
    const { container } = render(
      <PatientView patient={mockPatientStu3} />
    );

    expect(container.querySelectorAll('.patient-view__patient')).toHaveLength(1);
    expect(container.querySelector('.patient-data-name')).toHaveTextContent('Arnulfo253 McClure239');
    expect(container.querySelector('.patient-data-details-gender')).toHaveTextContent('male');
    expect(container.querySelector('.patient-data-details-age')).toHaveTextContent('33 yrs');
  });

  it('renders the STU3 resources', () => {
    const { container } = render(
      <PatientView patient={mockPatientStu3} />
    );

    expect(container.querySelectorAll('.patient-view__resources')).toHaveLength(1);
  });
});
