import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import BooleanComparisonModifier from '../BooleanComparisonModifier';

describe('<BooleanComparisonModifier />', () => {
  const renderComponent = (props = {}) =>
    render(<BooleanComparisonModifier handleUpdateModifier={jest.fn()} value="" {...props} />);

  it('calls handleUpdateModifier on input change', () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    userEvent.click(screen.getByLabelText('Boolean'));
    userEvent.click(screen.getByText('is not true'));

    expect(handleUpdateModifier).toBeCalledWith({ value: 'is not true' });
  });
});
