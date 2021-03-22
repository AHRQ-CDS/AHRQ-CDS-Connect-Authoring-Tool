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
          id: 'age',
          value: '0'
        }}
        isInteger={true}
        handleUpdateField={jest.fn()}
        {...props}
      />
    );

  it('changes input with type integer', () => {
    const handleUpdateField = jest.fn();
    renderComponent({ handleUpdateField });

    const numberInput = document.querySelector('input[type="number"]');

    fireEvent.change(numberInput, { target: { value: '10' } });

    expect(handleUpdateField).toBeCalledWith({ age: 10 });
  });

  it('changes input with type float', () => {
    const handleUpdateField = jest.fn();
    renderComponent({ typeOfNumber: 'float', handleUpdateField });

    const numberInput = document.querySelector('input[type="number"]');

    fireEvent.change(numberInput, { target: { value: '10.02345' } });

    expect(handleUpdateField).toBeCalledWith({ age: 10.02345 });
  });
});
