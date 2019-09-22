import React from 'react';
import ValueComparisonObservation from '../ValueComparisonObservation';
import { render, fireEvent } from '../../../../utils/test-utils';

describe('<ValueComparisonObservation />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ValueComparisonObservation
        index={303}
        maxOperator=""
        maxValue=""
        minOperator=""
        minValue=""
        uniqueId="uniqueId"
        updateAppliedModifier={jest.fn()}
        {...props}
      />
    );

  it('calls updateAppliedModifier when input changes', () => {
    const updateAppliedModifier = jest.fn();
    const { getByText, getByLabelText } = renderComponent({ updateAppliedModifier });

    fireEvent.change(getByLabelText('Min Value'), { target: { value: 21 } });
    expect(updateAppliedModifier).toBeCalledWith(303, { minValue: 21 });

    fireEvent.keyDown(getByLabelText('Min Operator'), { keyCode: 40 });
    fireEvent.click(getByText('<'));
    expect(updateAppliedModifier).toBeCalledWith(303, { minOperator: '<' });

    fireEvent.change(getByLabelText('Max Value'), { target: { value: 189 } });
    expect(updateAppliedModifier).toBeCalledWith(303, { maxValue: 189 });

    fireEvent.keyDown(getByLabelText('Max Operator'), { keyCode: 40 });
    fireEvent.click(getByText('!='));
    expect(updateAppliedModifier).toBeCalledWith(303, { maxOperator: '!=' });
  });
});
