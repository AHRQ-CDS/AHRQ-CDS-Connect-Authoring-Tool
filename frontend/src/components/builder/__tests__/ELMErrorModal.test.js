import React from 'react';
import ELMErrorModal from '../ELMErrorModal';
import { render, fireEvent } from '../../../utils/test-utils';

describe('<ELMErrorModal />', () => {
  it('does not render the modal if it is not opened', () => {
    const { container } = render(
      <ELMErrorModal
        isOpen={false}
        closeModal={jest.fn()}
        errors={[]}
      />
    );

    expect(container.querySelector('.element-modal')).toBeEmpty();
    expect(document.body.querySelector('.ReactModalPortal')).toBeEmpty();
  });

  it('renders the error messages', () => {
    render(
      <ELMErrorModal
        isOpen={true}
        closeModal={jest.fn()}
        errors={[{ message: 'Message 1' }, { message: 'Message 2' }, { message: 'Message 1' }]}
      />
    );

    const modalBody = document.body.querySelector('.modal__body');
    expect(modalBody).toHaveTextContent(
      'We detected some errors in the ELM files you just used:'
    );
    const errorMessages = modalBody.querySelectorAll('li');
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

    fireEvent.click(document.body.querySelector('.modal__footer button[type="button"]'));

    expect(closeModal).toBeCalled();
  });
});
