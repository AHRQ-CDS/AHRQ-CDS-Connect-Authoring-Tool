import React from 'react';
import DateTimePrecisionModifier from '../DateTimePrecisionModifier';
import { render, fireEvent, openSelect } from '../../../../utils/test-utils';

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
    const { container, getByText, getByLabelText } = renderComponent({ updateAppliedModifier });

    fireEvent.focus(container.querySelector('.react-datepicker-wrapper input'));
    fireEvent.click(container.querySelector('.react-datepicker__day--today'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: expect.stringMatching(/^@\d{4}-\d{2}-\d{2}$/),
      time: '',
      precision: ''
    });

    fireEvent.click(container.querySelector('.rc-time-picker-input'));
    fireEvent.click(document.querySelector('.rc-time-picker-panel-select-option-selected'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: '',
      time: expect.stringMatching(/^T\d{2}:\d{2}:\d{2}$/),
      precision: ''
    });

    openSelect(getByLabelText('Precision'));
    fireEvent.click(getByText('year'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: '',
      time: '',
      precision: 'year'
    });
  });
});
