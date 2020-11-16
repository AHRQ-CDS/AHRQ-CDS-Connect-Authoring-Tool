import React from 'react';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import ValueComparisonObservation from '../ValueComparisonObservation';

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
    renderComponent({ updateAppliedModifier });

    fireEvent.change(screen.getByLabelText('Min Value'), { target: { value: 21 } });
    expect(updateAppliedModifier).toBeCalledWith(303, { minValue: 21 });

    userEvent.click(screen.getByLabelText('minOp'));
    userEvent.click(screen.getByText('<'));
    expect(updateAppliedModifier).toBeCalledWith(303, { minOperator: '<' });

    fireEvent.change(screen.getByLabelText('Max Value'), { target: { value: 189 } });
    expect(updateAppliedModifier).toBeCalledWith(303, { maxValue: 189 });

    userEvent.click(screen.getByLabelText('maxOp'));
    userEvent.click(screen.getAllByText('!=')[1]);
    expect(updateAppliedModifier).toBeCalledWith(303, { maxOperator: '!=' });
  });
});
