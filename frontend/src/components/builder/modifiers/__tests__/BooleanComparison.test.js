import React from 'react';
import BooleanComparison from '../BooleanComparison';
import { render, fireEvent } from '../../../../utils/test-utils';

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
    const { container, getByText } = renderComponent({ updateAppliedModifier });

    fireEvent.keyDown(container.querySelector('.boolean-comparison-select__control'), { keyCode: 40 });
    fireEvent.click(getByText('is not true'));

    expect(updateAppliedModifier).toBeCalledWith(80, { value: 'is not true' });
  });
});
