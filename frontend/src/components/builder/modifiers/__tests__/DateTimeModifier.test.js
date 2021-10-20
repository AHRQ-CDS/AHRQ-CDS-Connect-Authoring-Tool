import React from 'react';
import { changeDate, changeTime, render, userEvent, screen, waitFor } from 'utils/test-utils';
import DateTimeModifier from '../DateTimeModifier';

describe('<DateTimeModifier />', () => {
  const renderComponent = (props = {}) =>
    render(<DateTimeModifier name="date-time-modifier-test" handleUpdateModifier={jest.fn()} values={{}} {...props} />);

  it('calls handleUpdateModifier on input change for date time modifier with no precision', async () => {
    const handleUpdateModifier = jest.fn();
    const values = { date: '', time: '' };
    renderComponent({ handleUpdateModifier, values });

    changeDate('01/01/2020');
    expect(handleUpdateModifier).toBeCalledWith({
      date: '@2020-01-01',
      time: null
    });

    await waitFor(() => expect(screen.queryByRole('button', { name: /ok/i })).toBeNull(), {
      timeout: 5000,
      interval: 200
    });

    changeTime('10:00:00');
    expect(handleUpdateModifier).toBeCalledWith({
      date: null,
      time: '@T10:00:00'
    });
  }, 30000);

  it('calls handleUpdateModifier on input change for date time modifier with precision', async () => {
    const handleUpdateModifier = jest.fn();
    const values = { date: '', time: '', precision: '' };
    renderComponent({ handleUpdateModifier, values });

    changeDate('01/01/2020');
    await waitFor(() => expect(screen.queryByRole('button', { name: /ok/i })).toBeNull(), {
      timeout: 5000,
      interval: 200
    });
    expect(handleUpdateModifier).toBeCalledWith({
      date: '@2020-01-01',
      time: null
    });

    changeTime('10:00:00');
    await waitFor(() => expect(screen.queryByRole('button', { name: /ok/i })).toBeNull(), {
      timeout: 5000,
      interval: 200
    });
    expect(handleUpdateModifier).toBeCalledWith({
      date: null,
      time: '@T10:00:00'
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

    changeTime('10:00:00');
    await waitFor(() => expect(screen.queryByRole('button', { name: /ok/i })).toBeNull(), {
      timeout: 5000,
      interval: 200
    });
    expect(handleUpdateModifier).toBeCalledWith({
      date: null,
      time: '@T10:00:00'
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
