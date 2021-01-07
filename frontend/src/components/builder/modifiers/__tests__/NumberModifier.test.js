import React from 'react';
import { render, screen, fireEvent } from 'utils/test-utils';
import NumberModifier from '../NumberModifier';

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
    renderComponent({ updateAppliedModifier });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '3' } });

    expect(updateAppliedModifier).toBeCalledWith(6, { value: 3 });
  });
});
