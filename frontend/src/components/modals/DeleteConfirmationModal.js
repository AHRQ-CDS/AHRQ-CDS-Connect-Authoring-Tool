import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Modal }  from 'components/elements';

const DeleteConfirmationModal = ({ children, deleteType, handleCloseModal, handleDelete }) => (
  <Modal
    title={`Delete ${_.upperFirst(deleteType)} Confirmation`}
    submitButtonText="Delete"
    isOpen
    handleCloseModal={handleCloseModal}
    handleSaveModal={handleDelete}
  >
    <>
      <h5>Are you sure you want to permanently delete the {children && 'following '}{deleteType}?</h5>
      {children && children}
    </>
  </Modal>
);

DeleteConfirmationModal.propTypes = {
  children: PropTypes.element,
  deleteType: PropTypes.string.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
};

export default DeleteConfirmationModal;
