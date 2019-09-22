import React from 'react';
import NumberModifier from '../NumberModifier';
import { render, fireEvent } from '../../../../utils/test-utils';

describe('<NumberModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <NumberModifier
        index={6}
        name="number-modifier-test"
        value={0}
        updateAppliedModifier={jest.fn()}
        {...props}
      />
    );

  it('calls updateAppliedModifier on input change', () => {
    const updateAppliedModifier = jest.fn();
    const { getByLabelText } = renderComponent({ updateAppliedModifier });

    fireEvent.change(getByLabelText('Number Modifier'), { target: { value: '3' } });

    expect(updateAppliedModifier).toBeCalledWith(6, { value: 3 });
  });
});
