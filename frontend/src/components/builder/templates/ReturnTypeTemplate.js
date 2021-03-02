import React from 'react';
import PropTypes from 'prop-types';
import { Check as CheckIcon } from '@material-ui/icons';

import useStyles from './styles';

const ReturnTypeTemplate = ({ returnType, shouldValidateReturnType }) => {
  const styles = useStyles();

  return (
    <div className={styles.templateField} id="return-type-template">
      <div className={styles.templateFieldLabel}>Return Type:</div>

      <div className={styles.templateFieldDisplayPadded}>
        {shouldValidateReturnType && returnType === 'Boolean' && <CheckIcon fontSize="small" />}
        {returnType}
      </div>
    </div>
  );
};

ReturnTypeTemplate.propTypes = {
  returnType: PropTypes.string.isRequired,
  shouldValidateReturnType: PropTypes.bool.isRequired
};

export default ReturnTypeTemplate;
