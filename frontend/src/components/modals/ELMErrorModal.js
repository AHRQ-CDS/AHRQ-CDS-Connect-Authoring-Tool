import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'components/elements';

const ELMErrorModal = ({ handleCloseModal, errors }) => {
  const uniqueErrors = [...new Set(errors.map(error => error.message))];

  return (
    <Modal
      title="About your CQL..."
      submitButtonText="Close"
      isOpen
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleCloseModal}
    >
      <div>
        We detected some errors in the ELM files you just used:
        <ul>
          {uniqueErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

ELMErrorModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired
};

export default ELMErrorModal;
