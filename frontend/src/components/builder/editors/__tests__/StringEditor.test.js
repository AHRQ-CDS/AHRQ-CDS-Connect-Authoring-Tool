import React from 'react';
import { render, fireEvent, screen } from 'utils/test-utils';
import StringEditor from '../StringEditor';

describe('<StringEditor />', () => {
  const renderComponent = (props = {}) =>
    render(<StringEditor handleUpdateEditor={jest.fn()} value={null} {...props} />);

  it('calls handleUpdateEditor with string', () => {
    const handleUpdateEditor = jest.fn();
    renderComponent({ handleUpdateEditor });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });

    expect(handleUpdateEditor).toBeCalledWith(`'test'`);
  });

  it('calls handleUpdateEditor with empty', () => {
    const handleUpdateEditor = jest.fn();
    renderComponent({ handleUpdateEditor, value: 'test' });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });

    expect(handleUpdateEditor).toBeCalledWith(null);
  });
});
