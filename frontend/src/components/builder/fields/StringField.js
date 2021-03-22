import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import clsx from 'clsx';

import { useFieldStyles, useFlexStyles } from 'styles/hooks';

const StringField = ({ field, handleUpdateField, isDisabled = false }) => {
  const fieldStyles = useFieldStyles();
  const flexStyles = useFlexStyles();

  return (
    <div id="string-field">
      <TextField
        className={clsx(fieldStyles.fieldInput, flexStyles.flex1)}
        disabled={isDisabled}
        fullWidth
        onChange={event => handleUpdateField({ [field.id]: event.target.value })}
        value={field.value || ''}
        variant="outlined"
      />
    </div>
  );
};

StringField.propTypes = {
  field: PropTypes.object.isRequired,
  handleUpdateField: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
};

export default StringField;
