import React from 'react';
import PatientDataSection from '../PatientDataSection';
import { render } from '../../../utils/test-utils';

describe('<PatientDataSection />', () => {
  const renderComponent = () =>
    render(
      <PatientDataSection
        title="My Section"
        data={[
          {
            Substance: 'Allergy to mould',
            Category: 'food',
            Criticality: 'CRITL',
            'Date onset': '1985-12-10T13:51:10-05:00',
            Status: 'active'
          },
          {
            Substance: 'Allergy to peanuts',
            Category: 'food',
            Criticality: 'CRITL',
            'Date onset': '1985-12-10T13:51:10-05:00',
            Status: 'active'
          }
        ]}
      />
    );

  it('renders section header', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('.patient-data-section')).toHaveLength(1);
    expect(container.querySelectorAll('.patient-data-section__header')).toHaveLength(1);
    expect(container.querySelector('.header-title')).toHaveTextContent('My Section (2)');
  });

  it('renders section table', () => {
    const { container } = renderComponent();
    const table = container.querySelector('.patient-data-section__table');

    expect(table).not.toBeEmptyDOMElement();
    expect(table.querySelectorAll('thead > tr > th')).toHaveLength(5);
    expect(table.querySelector('thead > tr > th')).toHaveTextContent('Substance');
    expect(table.querySelectorAll('tbody > tr')).toHaveLength(2);
    expect(table.querySelectorAll('tbody > tr > td')).toHaveLength(10);
    expect(table.querySelector('tbody > tr > td')).toHaveTextContent('Allergy to mould');
  });
});
