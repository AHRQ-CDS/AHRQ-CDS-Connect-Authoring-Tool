import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

import { Modal } from 'components/elements';
import useStyles from '../styles';

const PatientVersionModal = ({ handleCloseModal, handleSelectVersion, versionOptions = ['R4', 'STU3', 'DSTU2'] }) => {
  const styles = useStyles();

  return (
    <Modal
      title="Select a FHIR Version"
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleCloseModal}
      hasCancelButton
      hideSubmitButton
      isOpen
    >
      <>
        <div>Please select the FHIR version of this patient from the options below.</div>

        <div className={styles.versionButtons}>
          <Button
            color="primary"
            onClick={() => handleSelectVersion('R4')}
            variant="contained"
            disabled={!versionOptions.includes('R4')}
          >
            R4
          </Button>
          <Button
            color="primary"
            onClick={() => handleSelectVersion('STU3')}
            variant="contained"
            disabled={!versionOptions.includes('STU3')}
          >
            STU3
          </Button>
          <Button
            color="primary"
            onClick={() => handleSelectVersion('DSTU2')}
            variant="contained"
            disabled={!versionOptions.includes('DSTU2')}
          >
            DSTU2
          </Button>
        </div>
      </>
    </Modal>
  );
};

PatientVersionModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  handleSelectVersion: PropTypes.func.isRequired
};

export default PatientVersionModal;
