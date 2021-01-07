import React from 'react';
import { fireEvent, render, screen, within } from 'utils/test-utils';
import WithUnit from '../WithUnit';

describe('<WithUnit />', () => {
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
    renderComponent({ updateAppliedModifier });

    const autocomplete = screen.getByRole('combobox');
    const input = within(autocomplete).getByRole('textbox');

    autocomplete.focus();
    fireEvent.change(input, { target: { value: 'mg/dL' } });
    fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
    fireEvent.keyDown(autocomplete, { key: 'Enter' });

    expect(input.value).toEqual('mg/dL');
  });
});
