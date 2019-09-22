import React from 'react';
import QuantityModifier from '../QuantityModifier';
import { render, fireEvent } from '../../../../utils/test-utils';

describe('<QuantityModifier />', () => {
  let origDef = null;
  beforeEach(() => {
    origDef = window.Def;
    window.Def = {
      Autocompleter: {
        Search: jest.fn()
      }
    };
  });
  afterEach(() => {
    window.Def = origDef;
  });

  const renderComponent = (props = {}) =>
    render(
      <QuantityModifier
        index={6}
        name="quantity-modifier-test"
        value={0}
        updateAppliedModifier={jest.fn()}
        unit=""
        uniqueId="uniqueId"
        {...props}
      />
    );

  it('calls updateAppliedModifier on input change', () => {
    const updateAppliedModifier = jest.fn();
    const { getByLabelText } = renderComponent({ updateAppliedModifier });

    fireEvent.change(getByLabelText('Quantity Modifier Value'), { target: { value: '3' } });
    fireEvent.change(getByLabelText('Quantity Modifier Unit'), { target: { value: 'mg/dL' } });

    expect(updateAppliedModifier).toBeCalledWith(6, { value: 3 });
    expect(updateAppliedModifier).toBeCalledWith(6, { unit: 'mg/dL' });
  });
});
