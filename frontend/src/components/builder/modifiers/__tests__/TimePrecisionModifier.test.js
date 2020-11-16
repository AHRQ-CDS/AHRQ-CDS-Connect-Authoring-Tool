import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
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

  it('calls updateAppliedModifier on input change', () => {
    const updateAppliedModifier = jest.fn();
    renderComponent({ updateAppliedModifier });

    userEvent.click(screen.getByRole('textbox'));
    userEvent.click(document.querySelector('.rc-time-picker-panel-select-option-selected'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      time: expect.stringMatching(/^@T\d{2}:\d{2}:\d{2}$/),
      precision: ''
    });

    userEvent.click(screen.getByLabelText('Precision'));
    userEvent.click(screen.getByText('hour'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      time: '',
      precision: 'hour'
    });
  });
});
