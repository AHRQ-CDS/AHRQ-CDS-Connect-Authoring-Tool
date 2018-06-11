import PropTypes from 'prop-types';

const patientProps = {
  id: PropTypes.string,
  patient: PropTypes.object,
  user: PropTypes.string
};

export default PropTypes.shape(patientProps);
