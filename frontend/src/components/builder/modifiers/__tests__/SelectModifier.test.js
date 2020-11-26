import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import SelectModifier from '../SelectModifier';

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
    renderComponent({ updateAppliedModifier });

    userEvent.click(screen.getByRole('button', { name: /select-modifier-test/ }));
    userEvent.click(screen.getByText('mmol/L to mg/dL'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      value: 'Convert.to_mg_per_dL',
      templateName: 'Convert.to_mg_per_dL',
      description: 'mmol/L to mg/dL'
    });
  });
});
