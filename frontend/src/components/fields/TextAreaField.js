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
    multiline
    name={name}
    onBlur={onBlur}
    onChange={onChange}
    value={value}
    variant="outlined"
    {...props}
  />
);

export default memo(function TextAreaField({
  name,
  label,
  placeholder,
  colSize = '1',
  helperText,
  namePrefix,
  isCpgField = false
}) {
  const { values } = useFormikContext();
  const fieldName = namePrefix ? `${namePrefix}.${name}` : name;

  const labelId = useMemo(() => {
    if (!label) return null;
    return `TextAreaField-${labelUuid += 1}`;
  }, [label]);
  
  return (
    <div className="field text-area-field">
      {label &&
        <label htmlFor={labelId} className={clsx('field-label', helperText && 'has-helper-text')}>
          {label}
          {isCpgField &&
            <span className={clsx('cpg-tag', isCpgComplete(name, values) && 'cpg-tag-complete')}>CPG</span>
          }:
        </label>
      }

      <div className="field-input field-input-full-width">
        <FastField
          component={MuiFastField}
          id={labelId}
          name={fieldName}
          placeholder={placeholder}
        />

        {helperText && <div className="helper-text">{helperText}</div>}
      </div>
    </div>
  );
});
