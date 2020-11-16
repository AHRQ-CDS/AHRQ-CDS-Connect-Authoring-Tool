import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'components/elements';

class ELMErrorModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired
  }

  enterKeyCheck = (func, argument, event) => {
    if (!event || event.type !== 'keydown' || event.key !== 'Enter') return;
    event.preventDefault();
    if (argument) { func(argument); } else { func(); }
  }

  render() {
    const { closeModal, errors, isOpen } = this.props;
    const uniqueErrors = [...new Set(errors.map(error => error.message))];

    return (
      <div className="element-modal">
        <Modal
          title="About your CQL..."
          submitButtonText="Close"
          handleShowModal={isOpen}
          handleCloseModal={closeModal}
          handleSaveModal={closeModal}
        >
          <main className="modal__body">
            <p>
              We detected some errors in the ELM files you just used:
              <ul>
                {uniqueErrors.map((error, index) => <li key={index}>{error}</li>)}
              </ul>
            </p>
          </main>
        </Modal>
      </div>
    );
  }
}

export default ELMErrorModal;
