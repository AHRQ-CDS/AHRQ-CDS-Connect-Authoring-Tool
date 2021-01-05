import React from 'react';
import { render, userEvent, screen, waitFor } from 'utils/test-utils';
import DateTimePrecisionModifier from '../DateTimePrecisionModifier';

describe('<DateTimePrecisionModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <DateTimePrecisionModifier
        date=""
        index={6}
        name="date-time-precision-modifier-test"
        precision=""
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

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'OK' })).toBeNull();
    });

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: expect.stringMatching(/^@\d{4}-\d{2}-\d{2}$/),
      time: null,
      precision: ''
    });

    userEvent.click(screen.getByRole('button', { name: 'change time' }));
    userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'OK' })).toBeNull();
    });

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: null,
      time: expect.stringMatching(/^T\d{2}:\d{2}:\d{2}$/),
      precision: ''
    });

    userEvent.click(screen.getByRole('button', { name: /Precision/ }));
    userEvent.click(screen.getByRole('option', { name: 'year' }));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: null,
      time: null,
      precision: 'year'
    });
  }, 40000);
});
