import React, { memo, useMemo } from 'react';
import { FastField, useFormikContext } from 'formik';
import { TextField as MuiTextField } from '@material-ui/core';
import clsx from 'clsx';

import { isCpgComplete } from 'utils/fields';

let labelUuid = 0;

const MuiFastField = ({ field: { name, value, onChange, onBlur }, form: { touched, errors }, ...props }) => (
  <MuiTextField
    error={touched[name] && Boolean(errors[name])}
    fullWidth
    helperText={touched[name] && errors[name]}
    name={name}
    onBlur={onBlur}
    onChange={onChange}
    value={value}
    variant="outlined"
    {...props}
  />
);

export default memo(function TextField({
  name,
  label,
  type = 'text',
  placeholder,
  colSize = '1',
  helperText,
  required = false,
  namePrefix,
  isCpgField = false
}) {
  const { values } = useFormikContext();
  const fieldName = namePrefix ? `${namePrefix}.${name}` : name;

  const labelId = useMemo(() => {
    if (!label) return null;
    return `TextField-${(labelUuid += 1)}`;
  }, [label]);

  return (
    <div className="field text-field">
      {label && (
        <label htmlFor={labelId} className="field-label">
          {label}
          {required && <span className="required">*</span>}
          {isCpgField && (
            <span className={clsx('cpg-tag', isCpgComplete(name, values) && 'cpg-tag-complete')}>CPG</span>
          )}
          :
        </label>
      )}

      <div className="field-input field-input-full-width">
        <FastField
          component={MuiFastField}
          id={labelId}
          name={fieldName}
          placeholder={placeholder}
          required={required}
          type={type}
        />

        {helperText && <div className="helper-text">{helperText}</div>}
      </div>
    </div>
  );
});
