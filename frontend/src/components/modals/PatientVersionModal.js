import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import { Modal } from 'components/elements';

const PatientVersionModal = ({ handleCloseModal, selectVersion }) => (
  <Modal
    title="Select a FHIR Version"
    handleCloseModal={handleCloseModal}
    handleSaveModal={handleCloseModal}
    hasCancelButton
    hideSubmitButton
    isOpen
  >
    <>
      <div className="patient-version-modal__content">
        Please select the FHIR version of this patient from the options below.
      </div>

      <div className="patient-version-modal__options">
        <Button color="primary" onClick={() => selectVersion('R4')} variant="contained">R4</Button>
        <Button color="primary" onClick={() => selectVersion('STU3')} variant="contained">STU3</Button>
        <Button color="primary" onClick={() => selectVersion('DSTU2')} variant="contained">DSTU2</Button>
      </div>
    </>
  </Modal>
);

PatientVersionModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  selectVersion: PropTypes.func.isRequired
};

export default PatientVersionModal;
