import React from 'react';
import SelectModifier from '../SelectModifier';
import { render, fireEvent, openSelect } from '../../../../utils/test-utils';

describe('<SelectModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <SelectModifier
        index={6}
        name="select-modifier-test"
        options={[{ name: 'Convert.to_mg_per_dL', description: 'mmol/L to mg/dL' }]}
        updateAppliedModifier={jest.fn()}
        value=""
        {...props}
      />
    );

  it('calls updateAppliedModifier on selection change', () => {
    const updateAppliedModifier = jest.fn();
    const { container, getByText } = renderComponent({ updateAppliedModifier });

    openSelect(container.querySelector('.select-modifier-select__control'));
    fireEvent.click(getByText('mmol/L to mg/dL'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      value: 'Convert.to_mg_per_dL',
      templateName: 'Convert.to_mg_per_dL',
      description: 'mmol/L to mg/dL'
    });
  });
});
