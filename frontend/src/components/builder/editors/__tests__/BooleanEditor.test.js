import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import BooleanEditor from '../BooleanEditor';

describe('<BooleanEditor />', () => {
  const renderComponent = (props = {}) =>
    render(<BooleanEditor handleUpdateEditor={jest.fn()} value={null} {...props} />);

  it('calls handleUpdateEditor with True', () => {
    const handleUpdateEditor = jest.fn();
    renderComponent({ handleUpdateEditor });

    userEvent.click(screen.getByRole('button'));
    userEvent.click(screen.getByRole('option', { name: 'True' }));

    expect(handleUpdateEditor).toBeCalledWith('true');
  });

  it('calls handleUpdateEditor with False', () => {
    const handleUpdateEditor = jest.fn();
    renderComponent({ handleUpdateEditor });

    userEvent.click(screen.getByRole('button'));
    userEvent.click(screen.getByRole('option', { name: 'False' }));

    expect(handleUpdateEditor).toBeCalledWith('false');
  });
});
