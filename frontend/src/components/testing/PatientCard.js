import React from 'react';
import PropTypes from 'prop-types';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';

import { getPatientAge, getPatientFullName, getPatientGender } from 'utils/patients';
import useStyles from './styles';

const PatientCard = ({ patient }) => {
  const styles = useStyles();

  return (
    <div className={styles.patientCard}>
      <AccountCircleIcon className={styles.patientCardIcon} />

      <div>
        <div className={styles.patientCardName}>{getPatientFullName(patient)}</div>

        <div className={styles.patientCardDemographics}>
          <div>{getPatientGender(patient)}</div>
          <div>{getPatientAge(patient)}</div>
        </div>
      </div>
    </div>
  );
};

PatientCard.propTypes = {
  patient: PropTypes.object.isRequired
};

export default PatientCard;
