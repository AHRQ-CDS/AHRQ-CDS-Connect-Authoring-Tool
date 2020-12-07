import React, { memo, useCallback, useMemo } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Remove as DashIcon } from '@material-ui/icons';
import { useField, useFormikContext } from 'formik';
import { format } from 'date-fns';
import clsx from 'clsx';

import { isCpgComplete } from 'utils/fields';

const DateRangePicker = memo(({ fieldName, helperText, name, rangeType, noDateOption, noDateText }) => {
  const rangeFieldName = `${fieldName}.${rangeType}`;
  const [field, , { setValue }] = useField(rangeFieldName);
  const [noDateField, , { setValue: setNoDateFieldValue }] = useField(`${fieldName}.${rangeType}NoDate`);
  const { value } = field;
  const currentDateValue = useMemo(() => value ? format(value, 'yyyy-MM-dd') : null, [value]);

  const toggleSelectNoDate = useCallback(() => {
    setNoDateFieldValue(!noDateField.value);
    setValue(null);
  }, [setNoDateFieldValue, setValue, noDateField.value]);

  return (
    <>
      <div className="field-input">
        <KeyboardDatePicker
          disabled={noDateField.value}
          format="MM/dd/yyyy"
          inputVariant="outlined"
          KeyboardButtonProps={{ 'aria-label': 'change date' }}
          label={field.name === 'effectivePeriod.start' ? 'Start date' : 'End date' }
          margin="normal"
          onChange={value => setValue(value)}
          placeholder="mm/dd/yyyy"
          value={currentDateValue}
        />

        {helperText && <div className="helper-text">{helperText}</div>}
      </div>

      {noDateOption &&
        <div className="field-checkbox">
          <FormControlLabel
            control={
              <Checkbox
                checked={noDateField.value}
                color="primary"
                onChange={toggleSelectNoDate}
              />
            }
            label={noDateText}
          />
        </div>
      }
    </>
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
    <div className="field date-range-field">
      {label &&
        <label htmlFor={fieldName} className="field-label">
          {label}
          {isCpgField &&
            <span className={clsx('cpg-tag', isCpgComplete(name, values) && 'cpg-tag-complete')}>CPG</span>
          }:
        </label>
      }

      <div className="field-group">
        <DateRangePicker
          fieldName={fieldName}
          name={name}
          noDateOption={noDateOption}
          noDateText="No Start Date"
          rangeType="start"
        />

        <div className="field-input"><DashIcon /></div>

        <DateRangePicker
          fieldName={fieldName}
          helperText={helperText}
          name={name}
          noDateOption={noDateOption}
          noDateText="No End Date"
          rangeType="end"
        />
      </div>
    </div>
  );
});
