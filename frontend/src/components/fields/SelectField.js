import React, { memo, useCallback, useMemo } from 'react';
import { FastField, useFormikContext } from 'formik';
import classnames from 'classnames';

import StyledSelect from '../elements/StyledSelect';
import { isCpgComplete } from '../../utils/fields';

const FormikSelect = ({
  field: { name, value, onChange, onBlur },
  form: { setFieldValue },
  options,
  ...selectProps
}) => {
  const handleChange = useCallback(option => {
    setFieldValue(name, option ? option.value : null);
  }, [setFieldValue, name]);

  const selectedOption = useMemo(
    () => {
      if (value == null) return null;
      return options.find(option => option.value === value);
    },
    [options, value]
  );

  return (
    <StyledSelect
      name={name}
      value={selectedOption}
      onChange={handleChange}
      onBlur={onBlur}
      options={options}
      isClearable
      {...selectProps}
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
      {label &&
        <label htmlFor={fieldName} className={classnames(helperText && 'has-helper-text')}>
          {label}
          {isCpgField &&
            <span className={classnames('cpg-tag', isCpgComplete(name, values) && 'cpg-tag-complete')}>CPG</span>
          }:
        </label>
      }

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
