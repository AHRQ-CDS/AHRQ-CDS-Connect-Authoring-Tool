import React from 'react';
import StringModifier from '../StringModifier';
import { render, fireEvent } from '../../../../utils/test-utils';

describe('<StringModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <StringModifier
        index={6}
        name="string-modifier-test"
        value=""
        updateAppliedModifier={jest.fn()}
        {...props}
      />
    );

  it('calls updateAppliedModifier on input change', () => {
    const updateAppliedModifier = jest.fn();
    const { getByLabelText } = renderComponent({ updateAppliedModifier });

    fireEvent.change(getByLabelText('String Modifier'), { target: { value: 'test' } });

    expect(updateAppliedModifier).toBeCalledWith(6, { value: 'test' });
  });
});
