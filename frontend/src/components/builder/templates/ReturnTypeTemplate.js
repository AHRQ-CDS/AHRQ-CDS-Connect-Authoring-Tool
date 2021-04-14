import React from 'react';
import PropTypes from 'prop-types';
import { Check as CheckIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { useFieldStyles } from 'styles/hooks';

const ReturnTypeTemplate = ({ returnType, returnTypeIsValid }) => {
  const fieldStyles = useFieldStyles();

  return (
    <div className={fieldStyles.field} id="return-type-template">
      <div className={fieldStyles.fieldLabel}>Return Type:</div>

      <div className={clsx(fieldStyles.fieldDetails, fieldStyles.fieldDetailsLast)}>
        {returnTypeIsValid && <CheckIcon fontSize="small" />}
        {returnType}
      </div>
    </div>
  );
};

ReturnTypeTemplate.propTypes = {
  returnType: PropTypes.string.isRequired,
  returnTypeIsValid: PropTypes.bool.isRequired
};

export default ReturnTypeTemplate;
