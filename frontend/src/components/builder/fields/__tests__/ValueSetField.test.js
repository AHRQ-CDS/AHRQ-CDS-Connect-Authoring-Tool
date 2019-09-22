import React from 'react';
import ValueSetField from '../ValueSetField';
import { render, fireEvent } from '../../../../utils/test-utils';

describe('<ValueSetField />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ValueSetField
        field={{
          id: 'unit_of_time',
          name: 'Unit of Time',
          select: 'demographics/units_of_time',
          type: 'valueset',
          value: null
        }}
        loadValueSets={jest.fn()}
        updateInstance={jest.fn()}
        valueSets={[{ name: 'hours', value: 'hours' }]}
        {...props}
      />
    );

  it('calls loadValueSets on focus', () => {
    const loadValueSets = jest.fn();
    const { container } = renderComponent({ loadValueSets });

    fireEvent.keyDown(container.querySelector('.value-set-field-select__control'), { keyCode: 40 });
    fireEvent.focus(container.querySelector('input[type="text"]'));

    expect(loadValueSets).toBeCalledWith('demographics/units_of_time');
  });

  it('calls updateInstance when an option is selected', () => {
    const updateInstance = jest.fn();
    const { container, getByText } = renderComponent({ updateInstance });

    fireEvent.keyDown(container.querySelector('.value-set-field-select__control'), { keyCode: 40 });
    fireEvent.click(getByText('hours'));

    expect(updateInstance).toBeCalledWith({
      unit_of_time: {
        name: 'hours',
        value: 'hours'
      }
    });
  });
});
