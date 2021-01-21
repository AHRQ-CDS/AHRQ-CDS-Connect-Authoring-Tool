import React from 'react';
import { render, userEvent, screen, waitFor } from 'utils/test-utils';
import DateTimeModifier from '../DateTimeModifier';

describe('<DateTimeModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <DateTimeModifier
        date=""
        index={6}
        name="date-time-modifier-test"
        time=""
        updateAppliedModifier={jest.fn()}
        {...props}
      />
    );

  it('calls updateAppliedModifier on input change', async () => {
    const updateAppliedModifier = jest.fn();
    renderComponent({ updateAppliedModifier });

    userEvent.click(screen.getByRole('button', { name: 'change date' }));
    userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => expect(screen.queryByRole('button', { name: 'OK' })).toBeNull(), {
      timeout: 5000,
      interval: 200
    });

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: expect.stringMatching(/^@\d{4}-\d{2}-\d{2}$/),
      time: null
    });

    userEvent.click(screen.getByRole('button', { name: 'change time' }));
    userEvent.click(screen.getByRole('button', { name: 'OK' }));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: null,
      time: expect.stringMatching(/^T\d{2}:\d{2}:\d{2}$/)
    });
  }, 30000);
});
