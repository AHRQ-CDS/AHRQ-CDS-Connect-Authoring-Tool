import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import clsx from 'clsx';

import { useFieldStyles, useFlexStyles } from 'styles/hooks';

const NumberField = ({ field, handleUpdateField, isInteger = false }) => {
  const fieldStyles = useFieldStyles();
  const flexStyles = useFlexStyles();

  const handleChangeValue = event => {
    const newValue = isInteger === 'integer' ? parseInt(event.target.value, 10) : parseFloat(event.target.value);
    handleUpdateField({ [field.id]: newValue });
  };

  const handleChangeExclusive = event => {
    handleUpdateField({ [field.id]: event.target.value });
  };

  return (
    <div className={flexStyles.flex} id="number-field">
      <TextField
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
        fullWidth
        label={field.name}
        onChange={handleChangeValue}
        type="number"
        value={field.value || ''}
      />

      {field.exclusive && (
        <FormControlLabel
          className={fieldStyles.fieldInput}
          control={<Checkbox checked={field.exclusive || false} color="primary" onChange={handleChangeExclusive} />}
          label="Exclusive"
        />
      )}
    </div>
  );
};

NumberField.propTypes = {
  field: PropTypes.object.isRequired,
  handleUpdateField: PropTypes.func.isRequired,
  isInteger: PropTypes.bool
};

export default NumberField;
