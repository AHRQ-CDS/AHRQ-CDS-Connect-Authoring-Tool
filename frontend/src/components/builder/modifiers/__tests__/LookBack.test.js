import React from 'react';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import LookBack from '../LookBack';

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
    renderComponent({ updateAppliedModifier });

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '13' } });

    expect(updateAppliedModifier).toBeCalledWith(5, { value: 13 });

    userEvent.click(screen.getByRole('button', { name: 'Day(s)' }));
    userEvent.click(screen.getByText('Year(s)'));

    expect(updateAppliedModifier).toBeCalledWith(5, { unit: 'years' });
  });
});
