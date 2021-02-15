import React from 'react';
import PropTypes from 'prop-types';

import useStyles from './styles';

const LabelModifier = ({ name }) => {
  const styles = useStyles();

  return <div className={styles.modifier}>{name}</div>;
};

LabelModifier.propTypes = {
  name: PropTypes.string.isRequired
};

export default LabelModifier;
