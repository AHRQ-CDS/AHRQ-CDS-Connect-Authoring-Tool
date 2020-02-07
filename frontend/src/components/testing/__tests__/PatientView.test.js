import React from 'react';
import moment from 'moment';
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
    const expectedAge = moment().diff(moment('1985-02-04'), 'years');
    expect(container.querySelector('.patient-data-details-age')).toHaveTextContent(`${expectedAge} yrs`);
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
    const expectedAge = moment().diff(moment('1986-01-12'), 'years');
    expect(container.querySelector('.patient-data-details-age')).toHaveTextContent(`${expectedAge} yrs`);
  });

  it('renders the STU3 resources', () => {
    const { container } = render(
      <PatientView patient={mockPatientStu3} />
    );

    expect(container.querySelectorAll('.patient-view__resources')).toHaveLength(1);
  });
});
