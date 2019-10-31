import React from 'react';
import NumberField from '../NumberField';
import { render, fireEvent } from '../../../../utils/test-utils';

describe('<NumberField />', () => {
  const renderComponent = (props = {}) =>
    render(
      <NumberField
        field={{
          exclusive: false,
          name: 'age',
          id: 'age',
        }}
        typeOfNumber="integer"
        updateInstance={jest.fn()}
        value={0}
        {...props}
      />
    );

  it('changes input with type integer', () => {
    const updateInstance = jest.fn();
    const { container } = renderComponent({ updateInstance });

    const numberInput = container.querySelector('input[type="number"]');

    fireEvent.change(numberInput, { target: { name: numberInput.getAttribute('name'), value: "10" } });

    expect(updateInstance).toBeCalledWith({ [numberInput.name]: 10 });
  });

  it('changes input with type float', () => {
    const updateInstance = jest.fn();
    const { container } = renderComponent({ typeOfNumber: 'float', updateInstance });

    const numberInput = container.querySelector('input[type="number"]');

    fireEvent.change(numberInput, { target: { name: numberInput.getAttribute('name'), value: "10.02345" } });

    expect(updateInstance).toBeCalledWith({ [numberInput.name]: 10.02345 });
  });
});
