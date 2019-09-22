import React from 'react';
import DateTimeModifier from '../DateTimeModifier';
import { render, fireEvent } from '../../../../utils/test-utils';

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

  it('calls updateAppliedModifier on input change', () => {
    const updateAppliedModifier = jest.fn();
    const { container } = renderComponent({ updateAppliedModifier });

    fireEvent.focus(container.querySelector('.react-datepicker-wrapper input'));
    fireEvent.click(container.querySelector('.react-datepicker__day--today'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: expect.stringMatching(/^@\d{4}-\d{2}-\d{2}$/),
      time: ''
    });

    fireEvent.click(container.querySelector('.rc-time-picker-input'));
    fireEvent.click(document.querySelector('.rc-time-picker-panel-select-option-selected'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      date: '',
      time: expect.stringMatching(/^T\d{2}:\d{2}:\d{2}$/)
    });
  });
});
