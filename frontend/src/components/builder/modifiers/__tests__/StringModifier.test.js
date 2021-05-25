import React from 'react';
import { screen, render, fireEvent } from 'utils/test-utils';
import StringModifier from '../StringModifier';

describe('<StringModifier />', () => {
  const renderComponent = (props = {}) =>
    render(<StringModifier handleUpdateModifier={jest.fn()} name="string-modifier-test" value="" {...props} />);

  it('calls handleUpdateModifier on input change', () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });

    expect(handleUpdateModifier).toBeCalledWith({ value: 'test' });
  });
});
