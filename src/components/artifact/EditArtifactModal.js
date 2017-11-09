import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Modal from '../elements/Modal';

export default class EditArtifactModal extends Component {
  render() {
    const { name, version, handleInputChange, showModal, closeModal, saveModal, artifactEditing } = this.props;
    const nameID = artifactEditing ? artifactEditing.name : _.uniqueId('artifact-name-');
    const versionID = artifactEditing ? artifactEditing.version : _.uniqueId('artifact-version-');

    return (
      <Modal
        modalTitle="Edit Artifact"
        modalId="edit-modal"
        modalTheme="light"
        modalSubmitButtonText="Save"
        handleShowModal={showModal}
        handleCloseModal={closeModal}
        handleSaveModal={saveModal}>

        <div className="artifact-table__modal">
          <div className="artifact-form__edit">
            <div className="artifact-form__inputs d-flex justify-content-start">
              <div className='form__group p-2'>
                <label htmlFor={nameID}>Artifact Name</label>
                <input id={nameID} required className='input__long' name='name' type='text'
                  value={name} onChange={handleInputChange} />
              </div>

              <div className='form__group p-2'>
                <label htmlFor={versionID}>Version</label>
                <input id={versionID} className='input__short' name='version' type='text'
                  value={version} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

EditArtifactModal.propTypes = {
  artifactEditing: PropTypes.object,
  name: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  saveModal: PropTypes.func.isRequired
};
