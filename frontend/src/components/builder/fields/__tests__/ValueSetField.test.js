import React from 'react';
import ValueSetField from '../ValueSetField';
import { render, fireEvent, openSelect } from '../../../../utils/test-utils';

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

  it('calls loadValueSets on mount if none are present', () => {
    const loadValueSets = jest.fn();

    renderComponent({ loadValueSets, valueSets: null });

    expect(loadValueSets).toBeCalledWith('demographics/units_of_time');
  });

  it('does not call loadValueSets on mount if value sets are present', () => {
    const loadValueSets = jest.fn();

    renderComponent({ loadValueSets });

    expect(loadValueSets).not.toHaveBeenCalled(); //toBeCalledWith('demographics/units_of_time');
  });

  it('calls updateInstance when an option is selected', () => {
    const updateInstance = jest.fn();
    const { container, getByText } = renderComponent({ updateInstance });

    openSelect(container.querySelector('.value-set-field-select__control'));
    fireEvent.click(getByText('hours'));

    expect(updateInstance).toBeCalledWith({
      unit_of_time: {
        name: 'hours',
        value: 'hours'
      }
    });
  });
});
