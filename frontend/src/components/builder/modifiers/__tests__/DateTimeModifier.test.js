import React from 'react';
import { render, userEvent, screen, waitFor } from 'utils/test-utils';
import DateTimeModifier from '../DateTimeModifier';

describe('<DateTimeModifier />', () => {
  const renderComponent = (props = {}) =>
    render(<DateTimeModifier name="date-time-modifier-test" handleUpdateModifier={jest.fn()} values={{}} {...props} />);

  it('calls handleUpdateModifier on input change for date time modifier with no precision', async () => {
    const handleUpdateModifier = jest.fn();
    const values = { date: '', time: '' };
    renderComponent({ handleUpdateModifier, values });

    userEvent.click(screen.getByRole('button', { name: 'change date' }));
    userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => expect(screen.queryByRole('button', { name: 'OK' })).toBeNull(), {
      timeout: 5000,
      interval: 200
    });

    expect(handleUpdateModifier).toBeCalledWith({
      date: expect.stringMatching(/^@\d{4}-\d{2}-\d{2}$/),
      time: null
    });

    userEvent.click(screen.getByRole('button', { name: 'change time' }));
    userEvent.click(screen.getByRole('button', { name: 'OK' }));

    expect(handleUpdateModifier).toBeCalledWith({
      date: null,
      time: expect.stringMatching(/^@T\d{2}:\d{2}:\d{2}$/)
    });
  }, 30000);

  it('calls handleUpdateModifier on input change for date time modifier with precision', async () => {
    const handleUpdateModifier = jest.fn();
    const values = { date: '', time: '', precision: '' };
    renderComponent({ handleUpdateModifier, values });

    userEvent.click(screen.getByRole('button', { name: 'change date' }));
    userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => expect(screen.queryByRole('button', { name: 'OK' })).toBeNull(), {
      timeout: 5000,
      interval: 200
    });

    expect(handleUpdateModifier).toBeCalledWith({
      date: expect.stringMatching(/^@\d{4}-\d{2}-\d{2}$/),
      time: null
    });

    userEvent.click(screen.getByRole('button', { name: 'change time' }));
    userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => expect(screen.queryByRole('button', { name: 'OK' })).toBeNull(), {
      timeout: 5000,
      interval: 200
    });

    expect(handleUpdateModifier).toBeCalledWith({
      date: null,
      time: expect.stringMatching(/^@T\d{2}:\d{2}:\d{2}$/)
    });

    userEvent.click(screen.getByRole('button', { name: /Precision/ }));
    userEvent.click(screen.getByRole('option', { name: 'year' }));

    expect(handleUpdateModifier).toBeCalledWith({
      date: null,
      time: null,
      precision: 'year'
    });
  }, 60000);

  it('calls handleUpdateModifier on input change for date time modifier with time and precision', async () => {
    const handleUpdateModifier = jest.fn();
    const values = { time: '', precision: '' };
    renderComponent({ handleUpdateModifier, values });

    userEvent.click(screen.getByRole('button', { name: 'change time' }));
    userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => expect(screen.queryByRole('button', { name: 'OK' })).toBeNull(), {
      timeout: 5000,
      interval: 200
    });

    expect(handleUpdateModifier).toBeCalledWith({
      date: null,
      time: expect.stringMatching(/^@T\d{2}:\d{2}:\d{2}$/)
    });

    userEvent.click(screen.getByRole('button', { name: /Precision/ }));
    userEvent.click(screen.getByRole('option', { name: 'minute' }));

    expect(handleUpdateModifier).toBeCalledWith({
      date: null,
      time: null,
      precision: 'minute'
    });
  }, 60000);
});
