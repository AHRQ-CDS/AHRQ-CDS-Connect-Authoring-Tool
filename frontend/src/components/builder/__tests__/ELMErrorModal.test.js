import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import ELMErrorModal from '../ELMErrorModal';

describe('<ELMErrorModal />', () => {
  it('does not render the modal if it is not opened', () => {
    render(
      <ELMErrorModal
        isOpen={false}
        closeModal={jest.fn()}
        errors={[]}
      />
    );

    expect(document.querySelector('.element-modal')).toBeEmptyDOMElement();
    expect(document.body.children).toHaveLength(1);
  });

  it('renders the error messages', () => {
    render(
      <ELMErrorModal
        isOpen={true}
        closeModal={jest.fn()}
        errors={[{ message: 'Message 1' }, { message: 'Message 2' }, { message: 'Message 1' }]}
      />
    );

    expect(screen.getByText('We detected some errors in the ELM files you just used:')).toBeInTheDocument();

    const errorMessages = screen.getAllByRole('listitem');
    expect(errorMessages).toHaveLength(2);
    expect(errorMessages[0]).toHaveTextContent('Message 1');
    expect(errorMessages[1]).toHaveTextContent('Message 2');
  });

  it('calls the closeModal prop when closed', () => {
    const closeModal = jest.fn();

    render(
      <ELMErrorModal
        isOpen={true}
        closeModal={closeModal}
        errors={[{ message: 'Message 1' }, { message: 'Message 2' }, { message: 'Message 1' }]}
      />
    );

    userEvent.click(screen.getByText('Close'));

    expect(closeModal).toBeCalled();
  });
});
