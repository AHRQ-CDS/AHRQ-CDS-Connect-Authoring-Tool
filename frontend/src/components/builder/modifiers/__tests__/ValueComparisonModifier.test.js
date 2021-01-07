import React from 'react';
import { render, fireEvent, userEvent, screen, waitFor } from 'utils/test-utils';
import ValueComparisonModifier from '../ValueComparisonModifier';

describe('<ValueComparisonModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ValueComparisonModifier
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

  it('calls updateAppliedModifier when input changes', async () => {
    const updateAppliedModifier = jest.fn();
    renderComponent({ updateAppliedModifier });

    fireEvent.change(screen.getByRole('spinbutton', { name: 'minValue' }), { target: { value: '21' } });
    expect(updateAppliedModifier).toBeCalledWith(303, { minValue: 21 });

    userEvent.click(screen.getByRole('button', { name: /minOp/ }));
    userEvent.click(screen.getByRole('option', { name: '<' }));

    await waitFor(() => {
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    fireEvent.change(screen.getByRole('spinbutton', { name: 'maxValue' }), { target: { value: '189' } });
    expect(updateAppliedModifier).toBeCalledWith(303, { maxValue: 189 });

    userEvent.click(screen.getByRole('button', { name: /maxOp/ }));
    userEvent.click(screen.getByRole('option', { name: '!=' }));

    expect(updateAppliedModifier).toBeCalledWith(303, { maxOperator: '!=' });
  }, 30000);
});
