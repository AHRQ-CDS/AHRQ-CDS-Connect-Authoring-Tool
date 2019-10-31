import React from 'react';
import CheckExistence from '../CheckExistence';
import { render, fireEvent, openSelect } from '../../../../utils/test-utils';

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

    openSelect(container.querySelector('.check-existence-select__control'));
    fireEvent.click(getByText('is null'));

    expect(updateAppliedModifier).toBeCalledWith(7, { value: 'is null' });
  });
});
