import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import Modal from '../elements/Modal';
import artifactProps from '../../prop-types/artifact';
import { onVisitExternalLink } from '../../utils/handlers';

export default class EditArtifactModal extends Component {
  constructor(props) {
    super(props);

    const { artifactEditing: artifact } = props;

    this.state = {
      name: artifact ? artifact.name : '',
      version: artifact ? artifact.version : ''
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    const { artifactEditing: artifact } = nextProps;

    if (artifact) {
      this.setState({ name: artifact.name, version: artifact.version });
    }
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { showModal, closeModal, saveModal, artifactEditing } = this.props;
    const { name, version } = this.state;
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
        handleSaveModal={() => saveModal(this.state)}>

        <div className="artifact-table__modal modal__content">
          <div className="artifact-form__edit">
            {this.state.version && !(/^\d+\.\d+\.\d+$/.test(this.state.version))
              && <div className="notification">
                    <FontAwesome name="exclamation-circle" />
                    Version should follow the Apache APR versioning scheme (e.g., 1.0.0).
                    See <a href="http://build.fhir.org/ig/HL7/cqf-recommendations/documentation-libraries.html" target="_blank" rel="noopener noreferrer" onClick={onVisitExternalLink}>FHIR Clinical Guidelines</a> for more information.
                  </div>}
            <div className="artifact-form__inputs d-flex justify-content-start">
              <div className='form__group p-2'>
                <label htmlFor={nameID}>Artifact Name</label>
                <input id={nameID} required className='input__long' name='name' type='text'
                  value={name} onChange={this.handleInputChange} />
              </div>

              <div className='form__group p-2'>
                <label htmlFor={versionID}>Version</label>
                <input id={versionID} className='input__short' name='version' type='text'
                  value={version} onChange={this.handleInputChange} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

EditArtifactModal.propTypes = {
  artifactEditing: artifactProps,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  saveModal: PropTypes.func.isRequired
};
