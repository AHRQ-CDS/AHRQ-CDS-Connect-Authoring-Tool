import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import BooleanComparison from '../BooleanComparison';

describe('<BooleanComparison />', () => {
  const renderComponent = (props = {}) =>
    render(
      <BooleanComparison
        index={80}
        updateAppliedModifier={jest.fn()}
        value=""
        {...props}
      />
    );

  it('calls updateAppliedModifier on input change', () => {
    const updateAppliedModifier = jest.fn();
    renderComponent({ updateAppliedModifier });

    userEvent.click(screen.getByLabelText('Boolean'));
    userEvent.click(screen.getByText('is not true'));

    expect(updateAppliedModifier).toBeCalledWith(80, { value: 'is not true' });
  });
});
