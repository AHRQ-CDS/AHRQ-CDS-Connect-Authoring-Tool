import React from 'react';
import PropTypes from 'prop-types';

import useStyles from './styles';

const ErrorStatementLabel = ({ text }) => {
  const styles = useStyles();

  return (
    <div className={styles.label}>
      <div className={styles.labelCorner} />
      <div className={styles.labelLine} />
      <div className={styles.labelText}>{text}</div>
    </div>
  );
};

ErrorStatementLabel.propTypes = {
  text: PropTypes.string.isRequired
};

export default ErrorStatementLabel;
