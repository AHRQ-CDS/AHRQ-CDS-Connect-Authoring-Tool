import React from 'react';
import { render, fireEvent } from 'utils/test-utils';
import NumberField from '../NumberField';

describe('<NumberField />', () => {
  const renderComponent = (props = {}) =>
    render(
      <NumberField
        field={{
          exclusive: false,
          name: 'age',
          id: 'age'
        }}
        typeOfNumber="integer"
        updateInstance={jest.fn()}
        value={0}
        {...props}
      />
    );

  it('changes input with type integer', () => {
    const updateInstance = jest.fn();
    renderComponent({ updateInstance });

    const numberInput = document.querySelector('input[type="number"]');

    fireEvent.change(numberInput, { target: { value: '10' } });

    expect(updateInstance).toBeCalledWith({ age: 10 });
  });

  it('changes input with type float', () => {
    const updateInstance = jest.fn();
    renderComponent({ typeOfNumber: 'float', updateInstance });

    const numberInput = document.querySelector('input[type="number"]');

    fireEvent.change(numberInput, { target: { value: '10.02345' } });

    expect(updateInstance).toBeCalledWith({ age: 10.02345 });
  });
});
