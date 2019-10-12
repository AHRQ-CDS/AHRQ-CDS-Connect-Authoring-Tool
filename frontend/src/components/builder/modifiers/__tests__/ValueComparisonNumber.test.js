import React from 'react';
import ValueComparisonNumber from '../ValueComparisonNumber';
import { render, fireEvent, openSelect } from '../../../../utils/test-utils';

describe('<ValueComparisonNumber />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ValueComparisonNumber
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

    openSelect(getByLabelText('Min Operator'));
    fireEvent.click(getByText('<'));
    expect(updateAppliedModifier).toBeCalledWith(303, { minOperator: '<' });

    fireEvent.change(getByLabelText('Max Value'), { target: { value: 189 } });
    expect(updateAppliedModifier).toBeCalledWith(303, { maxValue: 189 });

    openSelect(getByLabelText('Max Operator'));
    fireEvent.click(getByText('!='));
    expect(updateAppliedModifier).toBeCalledWith(303, { maxOperator: '!=' });
  });
});
