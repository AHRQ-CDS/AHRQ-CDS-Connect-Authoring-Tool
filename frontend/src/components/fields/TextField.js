import React, { memo, useMemo } from 'react';
import { FastField, useFormikContext } from 'formik';
import classnames from 'classnames';

import { isCpgComplete } from '../../utils/fields';

let labelUuid = 0;

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
    return `TextField-${labelUuid += 1}`;
  }, [label]);

  return (
    <div className={classnames('form__group', `flex-col-${colSize}`)}>
      {label &&
        <label htmlFor={labelId} className={classnames('field-label', helperText && 'has-helper-text')}>
          {label}
          {required && <span className="required">*</span>}
          {isCpgField &&
            <span className={classnames('cpg-tag', isCpgComplete(name, values) && 'cpg-tag-complete')}>CPG</span>
          }:
        </label>
      }

      <div className="input__group">
        <FastField
          id={labelId}
          type={type}
          name={fieldName}
          placeholder={placeholder}
          required={required}
        />

        {helperText && <div className="helper-text">{helperText}</div>}
      </div>
    </div>
  );
});
