import React, { memo, useCallback } from 'react';
import { FastField, useFormikContext } from 'formik';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import clsx from 'clsx';

import { isCpgComplete } from 'utils/fields';
import useStyles from './styles';

const FormikSelect = ({ field: { name, value, onChange }, form: { setFieldValue }, options }) => {
  const handleChange = useCallback((event, option) => setFieldValue(name, option?.value || null), [
    name,
    setFieldValue
  ]);
  const selectedOption = options.find(option => option.value === value) || null;

  return (
    <Autocomplete
      getOptionLabel={option => option?.label || ''}
      id={name}
      onChange={handleChange}
      options={options}
      renderInput={params => <TextField {...params} label={value ? null : 'Select...'} variant="outlined" />}
      value={selectedOption}
    />
  );
};

export default memo(function AutocompleteField({
  name,
  label,
  colSize = '1',
  helperText,
  options = [],
  namePrefix,
  isCpgField = false
}) {
  const fieldName = namePrefix ? `${namePrefix}.${name}` : name;
  const { values } = useFormikContext();
  const styles = useStyles();

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={fieldName} className={styles.fieldLabel}>
          {label}
          {isCpgField && (
            <span className={clsx(styles.cpgTag, isCpgComplete(name, values) && styles.cpgTagComplete)}>CPG</span>
          )}
          :
        </label>
      )}

      <div className={clsx(styles.fieldInput, styles.fieldInputFullWidth)}>
        <FastField
          aria-label={`Select ${name}`}
          classNamePrefix={name}
          component={FormikSelect}
          name={fieldName}
          options={options}
        />

        {helperText && <div className={styles.helperText}>{helperText}</div>}
      </div>
    </div>
  );
});
