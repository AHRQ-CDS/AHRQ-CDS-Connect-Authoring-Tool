import React, { memo, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import MaskedInput from 'react-text-mask';
import moment from 'moment';
import { useField, useFormikContext } from 'formik';

import { isCpgComplete } from '../../utils/fields';

const DateRangePicker = memo(({ fieldName, name, rangeType, noDateOption, noDateText }) => {
  const rangeFieldName = `${fieldName}.${rangeType}`;
  const [field, , { setValue }] = useField(rangeFieldName);
  const [noDateField, , { setValue: setNoDateFieldValue }] = useField(`${fieldName}.${rangeType}NoDate`);
  const { value } = field;
  const currentDateValue = useMemo(() => value ? moment(value).toDate() : null, [value]);

  const handleChange = useCallback(value => {
    setValue(value ? value.toISOString() : null);
  }, [setValue]);

  const toggleSelectNoDate = useCallback(() => {
    setNoDateFieldValue(!noDateField.value);
    setValue(null);
  }, [setNoDateFieldValue, setValue, noDateField.value]);

  return (
    <div className="input__group">
      <DatePicker
        id={rangeFieldName}
        name={field.name}
        aria-label={`Date ${name}`}
        onChange={handleChange}
        selected={currentDateValue}
        dateFormat="MM/dd/yyyy"
        autoComplete="off"
        showYearDropdown
        placeholderText="MM/DD/YYYY"
        disabled={noDateField.value}
        isClearable
        customInput={
          <MaskedInput
            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
            keepCharPositions={true}
            guide={true}
          />
        }
      />

      {noDateOption &&
        <label className="input-checkbox">
          <input
            type="checkbox"
            onChange={toggleSelectNoDate}
            checked={noDateField.value}
            value="true"
          />
          <span className="input-checkbox-text">{noDateText}</span>
        </label>
      }
    </div>
  );
});

export default memo(function DateRangeField({
  name,
  label,
  colSize = '1',
  helperText,
  noDateOption = false,
  namePrefix,
  isCpgField = false
}) {
  const fieldName = namePrefix ? `${namePrefix}.${name}` : name;
  const { values } = useFormikContext();

  return (
    <div className={classnames('form__group', `flex-col-${colSize}`)}>
      {label &&
        <label htmlFor={fieldName} className={classnames('field-label', helperText && 'has-helper-text')}>
          {label}
          {isCpgField &&
            <span className={classnames('cpg-tag', isCpgComplete(name, values) && 'cpg-tag-complete')}>CPG</span>
          }:
        </label>
      }

      <div className="date-range-group">
        <DateRangePicker
          fieldName={fieldName}
          rangeType="start"
          name={name}
          noDateOption={noDateOption}
          noDateText="No Start Date"
        />

        <div className="date-range-to">to</div>

        <DateRangePicker
          fieldName={fieldName}
          rangeType="end"
          name={name}
          noDateOption={noDateOption}
          noDateText="No End Date"
        />
      </div>

      {helperText && <div className="helper-text">{helperText}</div>}
    </div>
  );
});
