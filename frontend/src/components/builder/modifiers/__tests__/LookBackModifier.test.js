import React from 'react';
import { render, fireEvent, userEvent, screen, waitFor } from 'utils/test-utils';
import LookBackModifier from '../LookBackModifier';

describe('<LookBackModifier />', () => {
  const renderComponent = (props = {}) =>
    render(<LookBackModifier handleUpdateModifier={jest.fn()} unit="days" value={0} {...props} />);

  it('calls handleUpdateModifier on input and unit change', async () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '13' } });

    expect(handleUpdateModifier).toBeCalledWith({ value: 13 });

    await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: 'Unit' })));
    await waitFor(() => userEvent.click(screen.getByText('Year(s)')));

    expect(handleUpdateModifier).toBeCalledWith({ unit: 'years' });
  });
});
