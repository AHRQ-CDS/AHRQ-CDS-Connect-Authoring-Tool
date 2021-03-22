import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import clsx from 'clsx';

import { useFieldStyles, useFlexStyles } from 'styles/hooks';

const TextAreaField = ({ field, handleUpdateField }) => {
  const fieldStyles = useFieldStyles();
  const flexStyles = useFlexStyles();

  return (
    <div id="text-area-field">
      <TextField
        className={clsx(fieldStyles.fieldInput, flexStyles.flex1)}
        fullWidth
        multiline
        onChange={event => handleUpdateField({ [field.id]: event.target.value })}
        value={field.value || ''}
        variant="outlined"
      />
    </div>
  );
};

TextAreaField.propTypes = {
  field: PropTypes.object.isRequired,
  handleUpdateField: PropTypes.func.isRequired
};

export default TextAreaField;
