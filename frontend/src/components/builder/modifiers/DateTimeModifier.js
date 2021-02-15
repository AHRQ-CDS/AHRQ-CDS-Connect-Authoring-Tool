import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { Schedule as TimeIcon } from '@material-ui/icons';
import { format, parse } from 'date-fns';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
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

  const formatDateForPicker = date => { return parse(date.replace(/^@/, ''), 'yyyy-MM-dd', new Date()); };
  const formatTimeForPicker = time => { return parse(time.replace(/^@?T/, ''), 'HH:mm:ss', new Date()); };
  const formatDateForCQL = date => `@${format(date, 'yyyy-MM-dd')}`;
  const formatTimeForCQL = time => `${!values.date ? '@' : ''}T${format(time, 'HH:mm:ss')}`;

  const dateValue = values.date ? formatDateForPicker(values.date) : null;
  const timeValue = values.time ? formatTimeForPicker(values.time) : null;

  const handleChange = (newValue, inputType) => {
    if (newValue && Number.isNaN(newValue.valueOf())) return;
    const newValues = {};
    newValues.date = inputType === 'date' ? (newValue ? formatDateForCQL(newValue) : null) : values.date || null;
    newValues.time = inputType === 'time' ? (newValue ? formatTimeForCQL(newValue) : null) : values.time || null;
    if (inputType === 'precision') newValues.precision = newValue;

    handleUpdateModifier(newValues);
  };

  return (
    <div className={styles.modifier}>
      <div className={styles.modifierText}>{name}:</div>

      {values.date != null &&
        <KeyboardDatePicker
          className={clsx(styles.dateTimeInput, fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
          format="MM/dd/yyyy"
          inputVariant="outlined"
          KeyboardButtonProps={{ 'aria-label': 'change date' }}
          label="Date"
          margin="normal"
          onChange={newValue => handleChange(newValue, 'date')}
          placeholder="mm/dd/yyyy"
          value={dateValue}
        />
      }

      {values.time != null &&
        <KeyboardTimePicker
          className={clsx(styles.dateTimeInput, fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
          format="HH:mm:ss"
          inputVariant="outlined"
          KeyboardButtonProps={{ 'aria-label': 'change time' }}
          keyboardIcon={<TimeIcon />}
          label="Time"
          margin="normal"
          onChange={newValue => handleChange(newValue, 'time')}
          placeholder="hh:mm:ss"
          value={timeValue}
          views={['hours', 'minutes', 'seconds']}
        />
      }

      {values.precision != null &&
        <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}>
          <Dropdown
            id="date-time-precision-modifier"
            label="Precision"
            onChange={event => handleChange(event.target.value, 'precision')}
            options={values.date != null ? dateTimePrecisionOptions : timePrecisionOptions}
            value={values.precision}
          />
        </div>
      }
    </div>
  );
};

DateTimeModifier.propTypes = {
  handleUpdateModifier: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  values: PropTypes.shape({
    date: PropTypes.string,
    precision: PropTypes.string,
    time: PropTypes.string,
  }).isRequired
};

export default DateTimeModifier;
