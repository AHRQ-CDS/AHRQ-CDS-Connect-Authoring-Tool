import React from 'react';
import CheckExistence from '../CheckExistence';
import { render, fireEvent } from '../../../../utils/test-utils';

describe('<CheckExistence />', () => {
  const renderComponent = (props = {}) =>
    render(
      <CheckExistence
        index={7}
        updateAppliedModifier={jest.fn()}
        value=""
        {...props}
      />
    );

  it('calls updateAppliedModifier on input change', () => {
    const updateAppliedModifier = jest.fn();
    const { container, getByText } = renderComponent({ updateAppliedModifier });

    fireEvent.keyDown(container.querySelector('.check-existence-select__control'), { keyCode: 40 });
    fireEvent.click(getByText('is null'));

    expect(updateAppliedModifier).toBeCalledWith(7, { value: 'is null' });
  });
});
