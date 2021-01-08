import React, { memo, useCallback } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Remove as DashIcon } from '@material-ui/icons';
import { useField, useFormikContext } from 'formik';
import clsx from 'clsx';

import { isCpgComplete } from 'utils/fields';
import useStyles from './styles';

const DateRangePicker = memo(({ fieldName, helperText, name, rangeType, noDateOption, noDateText }) => {
  const rangeFieldName = `${fieldName}.${rangeType}`;
  const [field, , { setValue }] = useField(rangeFieldName);
  const [noDateField, , { setValue: setNoDateFieldValue }] = useField(`${fieldName}.${rangeType}NoDate`);
  const { value } = field;
  const styles = useStyles();

  const toggleSelectNoDate = useCallback(() => {
    setNoDateFieldValue(!noDateField.value);
    setValue(null);
  }, [setNoDateFieldValue, setValue, noDateField.value]);

  return (
    <>
      <div className={styles.fieldInput}>
        <KeyboardDatePicker
          disabled={noDateField.value}
          format="MM/dd/yyyy"
          inputVariant="outlined"
          KeyboardButtonProps={{ 'aria-label': 'change date' }}
          label={field.name === 'effectivePeriod.start' ? 'Start date' : 'End date' }
          margin="normal"
          onChange={value => setValue(value)}
          placeholder="mm/dd/yyyy"
          value={value}
        />

        {helperText && <div className={styles.helperText}>{helperText}</div>}
      </div>

      {noDateOption &&
        <div className={styles.fieldCheckbox}>
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
  const styles = useStyles();

  return (
    <div className={clsx(styles.field, styles.fieldCentered)}>
      {label &&
        <label htmlFor={fieldName} className={styles.fieldLabel}>
          {label}
          {isCpgField &&
            <span className={clsx(styles.cpgTag, isCpgComplete(name, values) && styles.cpgTagComplete)}>CPG</span>
          }:
        </label>
      }

      <div className={clsx(styles.fieldGroup, styles.dateFieldInput)}>
        <DateRangePicker
          fieldName={fieldName}
          name={name}
          noDateOption={noDateOption}
          noDateText="No Start Date"
          rangeType="start"
        />

        <div className={styles.fieldInput}><DashIcon /></div>

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
