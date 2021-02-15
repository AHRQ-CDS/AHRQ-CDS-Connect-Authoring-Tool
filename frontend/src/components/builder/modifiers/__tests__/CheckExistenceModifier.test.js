import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import CheckExistenceModifier from '../CheckExistenceModifier';

describe('<CheckExistenceModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <CheckExistenceModifier
        handleUpdateModifier={jest.fn()}
        value=""
        {...props}
      />
    );

  it('calls handleUpdateModifier on input change', () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    userEvent.click(screen.getByRole('button', { name: /Check existence/ }));
    userEvent.click(screen.getByText('is null'));

    expect(handleUpdateModifier).toBeCalledWith({ value: 'is null' });
  });
});
