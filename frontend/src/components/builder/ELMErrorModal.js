import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'components/elements';

class ELMErrorModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired
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
            <div>
              We detected some errors in the ELM files you just used:
              <ul>
                {uniqueErrors.map((error, index) => <li key={index}>{error}</li>)}
              </ul>
            </div>
          </main>
        </Modal>
      </div>
    );
  }
}

export default ELMErrorModal;
