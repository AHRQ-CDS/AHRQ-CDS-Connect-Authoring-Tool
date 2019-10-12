import React from 'react';
import LookBack from '../LookBack';
import { render, fireEvent, openSelect } from '../../../../utils/test-utils';

describe('<LookBack />', () => {
  const renderComponent = (props = {}) =>
    render(
      <LookBack
        index={5}
        unit="days"
        updateAppliedModifier={jest.fn()}
        value={0}
        {...props}
      />
    );

  it('calls updateAppliedModifier on input and unit change', () => {
    const updateAppliedModifier = jest.fn();
    const { container, getByText, getByLabelText } = renderComponent({ updateAppliedModifier });

    fireEvent.change(container.querySelector('input[type=number]'), { target: { value: 13 } });
    expect(updateAppliedModifier).toBeCalledWith(5, { value: 13 });

    openSelect(getByLabelText('Unit Select'));
    fireEvent.click(getByText('Year(s)'));

    expect(updateAppliedModifier).toBeCalledWith(5, { unit: 'years' });
  });
});
