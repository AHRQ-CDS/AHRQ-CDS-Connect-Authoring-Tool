import React from 'react';
import { fireEvent, render, screen } from 'utils/test-utils';
import WithUnitModifier from '../WithUnitModifier';

describe('<WithUnitModifier />', () => {
  const renderComponent = (props = {}) =>
    render(<WithUnitModifier handleUpdateModifier={jest.fn()} unit="" {...props} />);

  it('calls handleUpdateModifier when selection changes', () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    const autocomplete = screen.getByRole('combobox');

    autocomplete.focus();
    fireEvent.change(autocomplete, { target: { value: 'mg/dL' } });
    fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
    fireEvent.keyDown(autocomplete, { key: 'Enter' });

    expect(autocomplete.value).toEqual('mg/dL');
  });
});
