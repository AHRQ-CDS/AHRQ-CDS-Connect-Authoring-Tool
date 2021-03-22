import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import { DatePicker, TimePicker } from 'components/elements/Pickers';
import {
  convertDateForPicker,
  convertPickerDateToCQL,
  convertPickerTimeToCQL,
  convertTimeForPicker
} from 'utils/dates';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const timePrecisionOptions = [
  { value: 'hour', label: 'hour' },
  { value: 'minute', label: 'minute' },
  { value: 'second', label: 'second' }
];

const dateTimePrecisionOptions = [
  { value: 'year', label: 'year' },
  { value: 'month', label: 'month' },
  { value: 'day', label: 'day' },
  { value: 'hour', label: 'hour' },
  { value: 'minute', label: 'minute' },
  { value: 'second', label: 'second' }
];

const DateTimeModifier = ({ handleUpdateModifier, name, values }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  const handleChange = (newValue, inputType) => {
    if (newValue && Number.isNaN(newValue.valueOf())) return;

    const newValues = {};
    if (newValue != null) {
      newValues.date = inputType === 'date' ? `@${convertPickerDateToCQL(newValue)}` : values?.date || null;
      newValues.time =
        inputType === 'time' ? `${!values.date ? '@' : ''}T${convertPickerTimeToCQL(newValue)}` : values?.time || null;
      if (inputType === 'precision') newValues.precision = newValue;
    } else {
      newValues[inputType] = null;
    }

    handleUpdateModifier(newValues);
  };

  return (
    <div className={styles.modifier}>
      <div className={styles.modifierText}>{name}:</div>

      {values?.date != null && (
        <DatePicker onChange={newValue => handleChange(newValue, 'date')} value={convertDateForPicker(values.date.replace(/^@/, ''))} />
      )}

      {values?.time != null && (
        <TimePicker onChange={newValue => handleChange(newValue, 'time')} value={convertTimeForPicker(values.time.replace(/^@?T/, ''))} />
      )}

      {values.precision != null && (
        <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}>
          <Dropdown
            id="date-time-precision-modifier"
            label="Precision"
            onChange={event => handleChange(event.target.value, 'precision')}
            options={values.date != null ? dateTimePrecisionOptions : timePrecisionOptions}
            value={values.precision}
          />
        </div>
      )}
    </div>
  );
};

DateTimeModifier.propTypes = {
  handleUpdateModifier: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  values: PropTypes.shape({
    date: PropTypes.string,
    precision: PropTypes.string,
    time: PropTypes.string
  }).isRequired
};

export default DateTimeModifier;
