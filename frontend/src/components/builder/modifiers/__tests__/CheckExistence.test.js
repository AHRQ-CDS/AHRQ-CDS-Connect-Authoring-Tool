import React from 'react';
import { render, screen, userEvent } from 'utils/test-utils';
import CheckExistence from '../CheckExistence';

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
    renderComponent({ updateAppliedModifier });

    userEvent.click(screen.getByRole('button', { name: /Check existence/ }));
    userEvent.click(screen.getByText('is null'));

    expect(updateAppliedModifier).toBeCalledWith(7, { value: 'is null' });
  });
});
