import React, { memo, useCallback } from 'react';
import { FastField, useFormikContext } from 'formik';
import classnames from 'classnames';

import { Dropdown } from 'components/elements';
import { isCpgComplete } from 'utils/fields';

const FormikSelect = ({ field: { name, value, onChange }, form: { setFieldValue }, options }) => {
  const handleChange = useCallback(
    event => {
      const option = options.find(option => option.value === event.target.value);
      setFieldValue(name, option ? option.value : null);
    },
    [name, options, setFieldValue]
  );

  return (
    <Dropdown
      id={name}
      label={value ? null : 'Select...'}
      onChange={handleChange}
      options={options}
      value={value}
    />
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

  return (
    <div className={classnames('form__group', `flex-col-${colSize}`)}>
      {label && (
        <label htmlFor={fieldName} className={classnames('field-label', helperText && 'has-helper-text')}>
          {label}
          {isCpgField && (
            <span className={classnames('cpg-tag', isCpgComplete(name, values) && 'cpg-tag-complete')}>CPG</span>
          )}
          :
        </label>
      )}

      <div className="input__group">
        <FastField
          name={fieldName}
          component={FormikSelect}
          options={options}
          aria-label={`Select ${name}`}
          classNamePrefix={name}
        />
        {helperText && <div className="helper-text">{helperText}</div>}
      </div>
    </div>
  );
});
