import React from 'react';
import WithUnit from '../WithUnit';
import { render, fireEvent } from '../../../../utils/test-utils';

describe('<WithUnit />', () => {
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
      <WithUnit
        index={5}
        uniqueId="uniqueId"
        unit=""
        updateAppliedModifier={jest.fn()}
        {...props}
      />
    );

  it('calls updateAppliedModifier when selection changes', () => {
    const updateAppliedModifier = jest.fn();
    const { getByLabelText } = renderComponent({ updateAppliedModifier });

    fireEvent.change(getByLabelText('With Unit'), { target: { value: 'mg/dL' } });

    expect(updateAppliedModifier).toBeCalledWith(5, { unit: 'mg/dL' });
  });
});
