import React, { memo, useState, useCallback } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useField, useFormikContext } from 'formik';
import clsx from 'clsx';

import { isCpgComplete } from 'utils/fields';

export default memo(function DateField({
  name,
  label,
  colSize = '1',
  helperText,
  noDateOption = false,
  noDateText = 'No Date',
  namePrefix,
  isCpgField = false
}) {
  const [noDateSelected, setNoDateSelected] = useState(false);
  const fieldName = namePrefix ? `${namePrefix}.${name}` : name;
  const [field, , { setValue }] = useField(fieldName);
  const { value } = field;
  const { values } = useFormikContext();

  const toggleSelectNoDate = useCallback(() => {
    setValue(null);
    setNoDateSelected(currentValue => !currentValue);
  }, [setNoDateSelected, setValue]);

  return (
    <div className="field date-field">
      {label && (
        <label htmlFor={fieldName} className="field-label">
          {label}
          {isCpgField && (
            <span className={clsx('cpg-tag', isCpgComplete(name, values) && 'cpg-tag-complete')}>CPG</span>
          )}
          :
        </label>
      )}

      <div className="field-input">
        <KeyboardDatePicker
          disabled={noDateSelected}
          format="MM/dd/yyyy"
          inputVariant="outlined"
          KeyboardButtonProps={{ 'aria-label': 'change date' }}
          label="Date"
          margin="normal"
          onChange={value => setValue(value)}
          placeholder="mm/dd/yyyy"
          value={value}
        />

        {helperText && <div className="helper-text">{helperText}</div>}
      </div>

      {noDateOption && (
        <div className="field-checkbox">
          <FormControlLabel
            control={<Checkbox checked={noDateSelected} color="primary" onChange={toggleSelectNoDate} />}
            label={noDateText}
          />
        </div>
      )}
    </div>
  );
});
