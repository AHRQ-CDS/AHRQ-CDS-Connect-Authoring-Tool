import React from 'react';
import nock from 'nock';
import { render, userEvent, screen, waitFor } from 'utils/test-utils';
import SelectModifier from '../SelectModifier';

describe('<SelectModifier />', () => {
  const renderComponent = (props = {}) =>
    render(<SelectModifier handleUpdateModifier={jest.fn()} name="select-modifier-test" value="" {...props} />);

  afterAll(() => nock.restore());

  it('calls handleUpdateModifier on selection change', async () => {
    nock('http://localhost')
      .get('/authoring/api/config/conversions')
      .reply(200, [{ name: 'Convert.to_mg_per_dL', description: 'mmol/L to mg/dL' }]);

    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: /select-modifier-test/ })));
    await waitFor(() => userEvent.click(screen.getByText('mmol/L to mg/dL')));

    expect(handleUpdateModifier).toBeCalledWith({
      value: 'Convert.to_mg_per_dL',
      templateName: 'Convert.to_mg_per_dL',
      description: 'mmol/L to mg/dL'
    });
  });
});
