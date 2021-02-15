import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import clsx from 'clsx';

import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const NumberField = ({ field, typeOfNumber, updateInstance, value }) => {
  const [checked, setChecked] = useState(field.exclusive);
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  const updateExclusive = event => {
    field.exclusive = event.target.checked;
    setChecked(event.target.checked);
  };

  const handleChange = event => {
    const newValue = (typeOfNumber === 'integer') ? parseInt(event.target.value, 10) : parseFloat(event.target.value);
    updateInstance({ [field.id]: newValue });
  };

  return (
    <div className={clsx('number-field', fieldStyles.field)}>
      <div className={styles.fieldGroup}>
        <div className={fieldStyles.fieldLabel}>{field.name}:</div>

        <div className={fieldStyles.fieldInput}>
          <TextField
            fullWidth
            label={field.name}
            onChange={handleChange}
            type="number"
            value={value}
            variant="outlined"
          />
        </div>

        {('exclusive' in field) &&
          <FormControlLabel
            control={
              <Checkbox
                checked={checked || false}
                color="primary"
                onChange={event => updateExclusive(event)}
              />
            }
            className={fieldStyles.fieldInput}
            label="Exclusive"
          />
        }
      </div>
    </div>
  );
};

NumberField.propTypes = {
  field: PropTypes.object.isRequired,
  typeOfNumber: PropTypes.string.isRequired,
  updateInstance: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired
};

export default NumberField;
