import React, { memo, useCallback } from 'react';
import { FastField, useFormikContext } from 'formik';
import { Autocomplete, TextField } from '@mui/material';
import clsx from 'clsx';

import { isCpgComplete } from 'utils/fields';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const FormikSelect = ({ field: { name, value, onChange }, form: { setFieldValue }, options }) => {
  const handleChange = useCallback((event, option) => setFieldValue(name, option?.value || null), [
    name,
    setFieldValue
  ]);
  const selectedOption = options.find(option => option.value === value) || null;
  const fieldStyles = useFieldStyles();

  return (
    <Autocomplete
      className={fieldStyles.fieldInputLg}
      getOptionLabel={option => option?.label || ''}
      id={name}
      onChange={handleChange}
      options={options}
      renderInput={params => <TextField {...params} hiddenLabel={Boolean(value)} label={value ? null : 'Select...'} />}
      value={selectedOption}
    />
  );
};

export default memo(function AutocompleteField({
  name,
  label,
  helperText,
  options = [],
  namePrefix,
  isCpgField = false
}) {
  const fieldName = namePrefix ? `${namePrefix}.${name}` : name;
  const { values } = useFormikContext();
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <div className={fieldStyles.field}>
      {label && (
        <label htmlFor={fieldName} className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelGroup)}>
          <div>{label}</div>
          {isCpgField && (
            <div className={clsx(styles.cpgTag, isCpgComplete(name, values) && styles.cpgTagComplete)}>CPG</div>
          )}
          :
        </label>
      )}

      <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputFullWidth)}>
        <FastField
          aria-label={`Select ${name}`}
          classNamePrefix={name}
          component={FormikSelect}
          name={fieldName}
          options={options}
        />

        {helperText && <div className={fieldStyles.helperText}>{helperText}</div>}
      </div>
    </div>
  );
});
