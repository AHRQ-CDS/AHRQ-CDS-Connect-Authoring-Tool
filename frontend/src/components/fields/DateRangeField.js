import React, { memo, useCallback } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Remove as DashIcon } from '@mui/icons-material';
import { useField, useFormikContext } from 'formik';
import clsx from 'clsx';

import { DatePicker } from 'components/elements/Pickers';
import { isCpgComplete } from 'utils/fields';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const DateRangePicker = memo(({ fieldName, helperText, name, rangeType, noDateOption, noDateText }) => {
  const rangeFieldName = `${fieldName}.${rangeType}`;
  const [field, , { setValue }] = useField(rangeFieldName);
  const [noDateField, , { setValue: setNoDateFieldValue }] = useField(`${fieldName}.${rangeType}NoDate`);
  const { value } = field;
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  const toggleSelectNoDate = useCallback(() => {
    setNoDateFieldValue(!noDateField.value);
    setValue(null);
  }, [setNoDateFieldValue, setValue, noDateField.value]);

  return (
    <>
      <div className={fieldStyles.fieldInput}>
        <DatePicker
          disabled={noDateField.value}
          label={field.name === 'effectivePeriod.start' ? 'Start date' : 'End date'}
          onChange={value => setValue(value)}
          value={value}
        />

        {helperText && <div className={fieldStyles.helperText}>{helperText}</div>}
      </div>

      {noDateOption && (
        <div className={styles.fieldCheckbox}>
          <FormControlLabel
            control={<Checkbox checked={noDateField.value} color="primary" onChange={toggleSelectNoDate} />}
            label={noDateText}
          />
        </div>
      )}
    </>
  );
});

export default memo(function DateRangeField({
  name,
  label,
  helperText,
  noDateOption = false,
  namePrefix,
  isCpgField = false
}) {
  const fieldName = namePrefix ? `${namePrefix}.${name}` : name;
  const { values } = useFormikContext();
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <div className={clsx(fieldStyles.field, styles.fieldCentered)}>
      {label && (
        <label htmlFor={fieldName} className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelGroup)}>
          {label}
          {isCpgField && (
            <div className={clsx(styles.cpgTag, isCpgComplete(name, values) && styles.cpgTagComplete)}>CPG</div>
          )}
          :
        </label>
      )}

      <div className={clsx(styles.fieldGroup, styles.dateFieldInput)}>
        <DateRangePicker
          fieldName={fieldName}
          name={name}
          noDateOption={noDateOption}
          noDateText="No Start Date"
          rangeType="start"
        />

        <div className={fieldStyles.fieldInput}>
          <DashIcon />
        </div>

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
