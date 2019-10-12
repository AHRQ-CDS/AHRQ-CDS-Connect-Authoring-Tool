import React from 'react';
import TimePrecisionModifier from '../TimePrecisionModifier';
import { render, fireEvent, openSelect } from '../../../../utils/test-utils';

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
    const { container, getByText, getByLabelText } = renderComponent({ updateAppliedModifier });

    fireEvent.click(container.querySelector('.rc-time-picker-input'));
    fireEvent.click(document.querySelector('.rc-time-picker-panel-select-option-selected'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      time: expect.stringMatching(/^@T\d{2}:\d{2}:\d{2}$/),
      precision: ''
    });

    openSelect(getByLabelText('Precision'));
    fireEvent.click(getByText('hour'));

    expect(updateAppliedModifier).toBeCalledWith(6, {
      time: '',
      precision: 'hour'
    });
  });
});
