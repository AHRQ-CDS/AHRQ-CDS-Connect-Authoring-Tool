import React from 'react';
import { screen, render, fireEvent } from 'utils/test-utils';
import StringModifier from '../StringModifier';

describe('<StringModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <StringModifier
        index={6}
        name="string-modifier-test"
        value=""
        updateAppliedModifier={jest.fn()}
        {...props}
      />
    );

  it('calls updateAppliedModifier on input change', () => {
    const updateAppliedModifier = jest.fn();
    renderComponent({ updateAppliedModifier });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });

    expect(updateAppliedModifier).toBeCalledWith(6, { value: 'test' });
  });
});
