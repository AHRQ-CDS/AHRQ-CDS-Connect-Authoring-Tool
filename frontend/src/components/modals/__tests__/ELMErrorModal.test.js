import React from 'react';
import { render, userEvent, screen, within } from 'utils/test-utils';
import { ELMErrorModal } from 'components/modals';

describe('<ELMErrorModal />', () => {
  it('renders the error messages', () => {
    render(
      <ELMErrorModal
        handleCloseModal={jest.fn()}
        errors={[{ message: 'Message 1' }, { message: 'Message 2' }, { message: 'Message 1' }]}
      />
    );

    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByText('We detected some errors in the ELM files you just used:')).toBeInTheDocument();

    const errorMessages = dialog.getAllByRole('listitem');
    expect(errorMessages).toHaveLength(2);
    expect(errorMessages[0]).toHaveTextContent('Message 1');
    expect(errorMessages[1]).toHaveTextContent('Message 2');
  });

  it('calls the closeModal prop when closed', () => {
    const closeModal = jest.fn();

    render(
      <ELMErrorModal
        handleCloseModal={closeModal}
        errors={[{ message: 'Message 1' }, { message: 'Message 2' }, { message: 'Message 1' }]}
      />
    );

    const dialog = within(screen.getByRole('dialog'));
    userEvent.click(dialog.getByText('Close'));

    expect(closeModal).toBeCalled();
  });
});
