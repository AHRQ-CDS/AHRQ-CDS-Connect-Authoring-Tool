import React from 'react';
import { render, userEvent, screen, waitFor } from 'utils/test-utils';
import CheckExistenceModifier from '../CheckExistenceModifier';

describe('<CheckExistenceModifier />', () => {
  const renderComponent = (props = {}) =>
    render(<CheckExistenceModifier handleUpdateModifier={jest.fn()} value="" {...props} />);

  it('calls handleUpdateModifier on input change', async () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: /Check existence/ })));
    await waitFor(() => userEvent.click(screen.getByText('is null')));

    expect(handleUpdateModifier).toBeCalledWith({ value: 'is null' });
  });
});
