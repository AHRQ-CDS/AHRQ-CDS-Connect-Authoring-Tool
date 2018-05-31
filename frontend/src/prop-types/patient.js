import PropTypes from 'prop-types';

const patientProps = {
  id: PropTypes.string,
  user: PropTypes.string,
  name: PropTypes.string,
  patient: PropTypes.object
};

export default PropTypes.shape(patientProps);
