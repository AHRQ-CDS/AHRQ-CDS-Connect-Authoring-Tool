import React from 'react';
import PropTypes from 'prop-types';
import { Check as CheckIcon } from '@material-ui/icons';

import { useFieldStyles } from 'styles/hooks';

const ReturnTypeTemplate = ({ returnType, shouldValidateReturnType }) => {
  const fieldStyles = useFieldStyles();

  return (
    <div className={fieldStyles.field} id="return-type-template">
      <div className={fieldStyles.fieldLabel}>Return Type:</div>

      <div className={fieldStyles.fieldInput}>
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
