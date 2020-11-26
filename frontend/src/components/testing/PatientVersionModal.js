import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'components/elements';

class PatientVersionModal extends Component {
  render() {
    const { closeModal, isOpen, patientData, selectVersion } = this.props;

    return (
      <div className="element-modal">
        <Modal
          title="Select a FHIR Version"
          handleShowModal={isOpen}
          handleCloseModal={closeModal}
          handleSaveModal={closeModal}
          hasCancelButton
          hideSubmitButton
        >
          <main className="modal__body">
            <div className="element-modal modal__content">
              Please select the FHIR version of this patient from the options below.
            </div>

            <div className="modal__options">
              <button className="primary-button" onClick={() => selectVersion(patientData, 'R4')}  aria-label="R4">
                R4
              </button>

              <button className="primary-button" onClick={() => selectVersion(patientData, 'STU3')} aria-label="STU3">
                STU3
              </button>

              <button className="primary-button" onClick={() => selectVersion(patientData, 'DSTU2')} aria-label="DSTU2">
                DSTU2
              </button>
            </div>
          </main>
        </Modal>
      </div>
    );
  }
};

PatientVersionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  patientData: PropTypes.object,
  selectVersion: PropTypes.func.isRequired
};

export default PatientVersionModal;
