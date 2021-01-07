import React from 'react';
import { render, userEvent, screen, waitFor } from 'utils/test-utils';
import TimePrecisionModifier from '../TimePrecisionModifier';

describe('<TimePrecisionModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <TimePrecisionModifier
        index={6}
        name="time-precision-modifier-test"
        precision=""
        time=""
        updateAppliedModifier={jest.fn()}
        {...props}
      />
    );

  it('calls updateAppliedModifier on input change', async () => {
    const updateAppliedModifier = jest.fn();
    renderComponent({ updateAppliedModifier });

    userEvent.click(screen.getByRole('button', { name: 'change time' }));
    userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'OK' })).toBeNull();
    });

    expect(updateAppliedModifier).toBeCalledWith(6, {
      time: expect.stringMatching(/^@T\d{2}:\d{2}:\d{2}$/),
      precision: ''
    });

    userEvent.click(screen.getByRole('button', {name: /Precision/}));
    userEvent.click(screen.getByRole('option', {name: 'hour'}));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      time: null,
      precision: 'hour'
    });
  }, 30000);
});
