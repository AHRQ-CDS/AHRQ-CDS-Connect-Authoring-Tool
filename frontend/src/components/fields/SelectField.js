import React, { memo, useCallback } from 'react';
import { FastField, useFormikContext } from 'formik';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import { isCpgComplete } from 'utils/fields';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const FormikSelect = ({ field: { name, value, onChange }, form: { setFieldValue }, options }) => {
  const handleChange = useCallback(
    event => {
      const option = options.find(option => option.value === event.target.value);
      setFieldValue(name, option ? option.value : null);
    },
    [name, options, setFieldValue]
  );

  return (
    <Dropdown id={name} label={value ? null : 'Select...'} onChange={handleChange} options={options} value={value} />
  );
};

export default memo(function SelectField({
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
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <div className={fieldStyles.field}>
      {label && (
        <label htmlFor={fieldName} className={fieldStyles.fieldLabel}>
          {label}
          {isCpgField && (
            <span className={clsx(styles.cpgTag, isCpgComplete(name, values) && styles.cpgTagComplete)}>CPG</span>
          )}
          :
        </label>
      )}

      <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputLg)}>
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
