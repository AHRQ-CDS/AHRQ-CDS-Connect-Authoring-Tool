import React from 'react';
import { render, screen, fireEvent } from 'utils/test-utils';
import NumberModifier from '../NumberModifier';

describe('<NumberModifier />', () => {
  const renderComponent = (props = {}) =>
    render(<NumberModifier handleUpdateModifier={jest.fn()} name="number-modifier-test" value={'0'} {...props} />);

  it('calls handleUpdateModifier on input change for integer', () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3' } });

    expect(handleUpdateModifier).toBeCalledWith({ value: '3' });
  });

  it('calls handleUpdateModifier on input change for decimal', () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '.3' } });

    expect(handleUpdateModifier).toBeCalledWith({ value: '0.3' });
  });

  it('calls handleUpdateModifier on input change for negative decimal', () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '-.3' } });

    expect(handleUpdateModifier).toBeCalledWith({ value: '-0.3' });
  });
});
