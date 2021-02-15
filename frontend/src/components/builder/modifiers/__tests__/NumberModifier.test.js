import React from 'react';
import { render, screen, fireEvent } from 'utils/test-utils';
import NumberModifier from '../NumberModifier';

describe('<NumberModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <NumberModifier
        handleUpdateModifier={jest.fn()}
        name="number-modifier-test"
        value={0}
        {...props}
      />
    );

  it('calls handleUpdateModifier on input change', () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '3' } });

    expect(handleUpdateModifier).toBeCalledWith({ value: 3 });
  });
});
