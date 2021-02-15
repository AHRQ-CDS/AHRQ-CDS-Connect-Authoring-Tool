import React from 'react';
import nock from 'nock';
import { render, userEvent, screen } from 'utils/test-utils';
import SelectModifier from '../SelectModifier';

describe('<SelectModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <SelectModifier
        handleUpdateModifier={jest.fn()}
        name="select-modifier-test"
        value=""
        {...props}
      />
    );

  it('calls handleUpdateModifier on selection change', async () => {
    nock('http://localhost')
      .get('/authoring/api/config/conversions')
      .reply(200, [{ name: 'Convert.to_mg_per_dL', description: 'mmol/L to mg/dL' }]);

    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    userEvent.click(await screen.findByRole('button', { name: /select-modifier-test/ }));
    userEvent.click(screen.getByText('mmol/L to mg/dL'));

    expect(handleUpdateModifier).toBeCalledWith({
      value: 'Convert.to_mg_per_dL',
      templateName: 'Convert.to_mg_per_dL',
      description: 'mmol/L to mg/dL'
    });
  });
});
