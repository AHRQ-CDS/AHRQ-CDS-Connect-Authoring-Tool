import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
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

  it('calls updateAppliedModifier on input change', () => {
    const updateAppliedModifier = jest.fn();
    renderComponent({ updateAppliedModifier });

    userEvent.click(screen.getAllByRole('textbox')[0]);
    userEvent.click(document.querySelector('.react-datepicker__day--today'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: expect.stringMatching(/^@\d{4}-\d{2}-\d{2}$/),
      time: '',
      precision: ''
    });

    userEvent.click(screen.getAllByRole('textbox')[1]);
    userEvent.click(document.querySelector('.rc-time-picker-panel-select-option-selected'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: '',
      time: expect.stringMatching(/^T\d{2}:\d{2}:\d{2}$/),
      precision: ''
    });

    userEvent.click(screen.getByLabelText('Precision'));
    userEvent.click(screen.getByText('year'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: '',
      time: '',
      precision: 'year'
    });
  });
});
