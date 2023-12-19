import React from 'react';
import { render, userEvent, screen, waitFor } from 'utils/test-utils';
import BooleanEditor from '../BooleanEditor';

describe('<BooleanEditor />', () => {
  const renderComponent = (props = {}) =>
    render(<BooleanEditor handleUpdateEditor={jest.fn()} value={null} {...props} />);

  it('calls handleUpdateEditor with True', async () => {
    const handleUpdateEditor = jest.fn();
    renderComponent({ handleUpdateEditor });

    await waitFor(() => userEvent.click(screen.getByRole('combobox')));
    await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'True' })));

    expect(handleUpdateEditor).toBeCalledWith('true');
  });

  it('calls handleUpdateEditor with False', async () => {
    const handleUpdateEditor = jest.fn();
    renderComponent({ handleUpdateEditor });

    await waitFor(() => userEvent.click(screen.getByRole('combobox')));
    await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'False' })));

    expect(handleUpdateEditor).toBeCalledWith('false');
  });
});
