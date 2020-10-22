import React, { memo, useState, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import MaskedInput from 'react-text-mask';
import moment from 'moment';
import { useField, useFormikContext } from 'formik';

import { isCpgComplete } from '../../utils/fields';

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
  const currentDateValue = useMemo(() => value ? moment(value).toDate() : null, [value]);

  const handleChange = useCallback(value => {
    setValue(value ? value.toISOString() : null);
  }, [setValue]);
  const toggleSelectNoDate = useCallback(() => {
    setValue(null);
    setNoDateSelected(currentValue => !currentValue);
  }, [setNoDateSelected, setValue]);

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
        <DatePicker
          id={fieldName}
          name={field.name}
          aria-label={`Date ${name}`}
          onChange={handleChange}
          selected={currentDateValue}
          dateFormat="MM/dd/yyyy"
          autoComplete="off"
          showYearDropdown
          placeholderText="MM/DD/YYYY"
          disabled={noDateSelected}
          isClearable
          customInput={
            <MaskedInput
              mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
              keepCharPositions={true}
              guide={true}
            />
          }
        />
        {helperText && <div className="helper-text">{helperText}</div>}

        {noDateOption &&
          <label className="input-checkbox">
            <input
              type="checkbox"
              onChange={toggleSelectNoDate}
              selected={noDateSelected}
            />
            <span className="input-checkbox-text">{noDateText}</span>
          </label>
        }
      </div>
    </div>
  );
});
