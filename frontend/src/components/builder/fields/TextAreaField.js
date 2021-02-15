import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import clsx from 'clsx';

import { useFieldStyles, useFlexStyles } from 'styles/hooks';

const TextAreaField = ({ id, name, updateInstance, value }) => {
  const fieldStyles = useFieldStyles();
  const flexStyles = useFlexStyles();

  return (
    <div className={clsx('text-area-field', fieldStyles.field)}>
      <div className={fieldStyles.fieldLabel}>{name}:</div>

      <TextField
        className={clsx(fieldStyles.fieldInput, flexStyles.flex1)}
        fullWidth
        multiline
        onChange={event => updateInstance({ [id]: event.target.value })}
        value={value || ''}
        variant="outlined"
      />
    </div>
  );
};

TextAreaField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  updateInstance: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default TextAreaField;
