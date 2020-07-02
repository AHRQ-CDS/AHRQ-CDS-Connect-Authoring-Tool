import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import Modal from '../elements/Modal';
import { onVisitExternalLink } from '../../utils/handlers';

export default class NewArtifactModal extends Component {
  constructor(props) {
    super(props);

    this.state = { name: '', version: '' };
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleAddArtifact = (event) => {
    event.preventDefault();

    this.props.addArtifact({ name: this.state.name, version: this.state.version });
    this.setState({ name: '', version: '' });
    this.props.closeModal();
  }

  render() {
    const { showModal, closeModal } = this.props;
    const { name, version } = this.state;
    const nameID = _.uniqueId('artifact-name-');
    const versionID = _.uniqueId('artifact-version-');

    return (
      <div className="element-modal">
        <Modal
          modalTitle="New Artifact"
          modalId="new-modal"
          modalTheme="light"
          modalSubmitButtonText="Save"
          handleShowModal={showModal}
          handleCloseModal={closeModal}
          handleSaveModal={this.handleAddArtifact}>

          <div className="artifact-table__modal modal__content">
            <div className="artifact-form__new">
              {this.state.version && !(/^\d+\.\d+\.\d+$/.test(this.state.version))
                && <div className="notification">
                      <FontAwesomeIcon icon={faExclamationCircle} />
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
      </div>
    );
  }
}

NewArtifactModal.propTypes = {
  addArtifact: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};
