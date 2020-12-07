import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

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
              <Button color="primary" onClick={() => selectVersion(patientData, 'R4')} variant="contained">
                R4
              </Button>

              <Button color="primary" onClick={() => selectVersion(patientData, 'STU3')} variant="contained">
                STU3
              </Button>

              <Button color="primary" onClick={() => selectVersion(patientData, 'DSTU2')} variant="contained">
                DSTU2
              </Button>
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
