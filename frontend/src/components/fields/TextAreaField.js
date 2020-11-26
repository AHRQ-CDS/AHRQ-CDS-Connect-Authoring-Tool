import React, { memo, useMemo } from 'react';
import { FastField, useFormikContext } from 'formik';
import classnames from 'classnames';

import { isCpgComplete } from '../../utils/fields';

let labelUuid = 0;

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
    <div className={classnames('form__group', `flex-col-${colSize}`)}>
      {label &&
        <label htmlFor={labelId} className={classnames('field-label', helperText && 'has-helper-text')}>
          {label}
          {isCpgField &&
            <span className={classnames('cpg-tag', isCpgComplete(name, values) && 'cpg-tag-complete')}>CPG</span>
          }:
        </label>
      }

      <div className="input__group">
        <FastField id={labelId} as="textarea" name={fieldName} placeholder={placeholder} />

        {helperText && <div className="helper-text">{helperText}</div>}
      </div>
    </div>
  );
});
