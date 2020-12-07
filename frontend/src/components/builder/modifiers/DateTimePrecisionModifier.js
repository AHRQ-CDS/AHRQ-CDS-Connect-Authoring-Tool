import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { Schedule as TimeIcon } from '@material-ui/icons';
import { format, parse } from 'date-fns';

import { Dropdown } from 'components/elements';

const options = [
  { value: 'year', label: 'year' },
  { value: 'month', label: 'month' },
  { value: 'day', label: 'day' },
  { value: 'hour', label: 'hour' },
  { value: 'minute', label: 'minute' },
  { value: 'second', label: 'second' }
];

export default class DateTimePrecisionModifier extends Component {
  handleChange = (newValue, inputType) => {
    if (newValue && Number.isNaN(newValue.valueOf())) return;

    const { date, index, precision, time, updateAppliedModifier } = this.props;
    const newDate = inputType === 'date' ? (newValue ? `@${format(newValue, 'yyyy-MM-dd')}` : null) : date || null;
    const newTime = inputType === 'time' ? (newValue ? `T${format(newValue, 'HH:mm:ss')}` : null) : time || null;
    const newPrecision = inputType === 'precision' ? newValue : precision;

    updateAppliedModifier(index, { date: newDate, time: newTime, precision: newPrecision });
  };

  render() {
    const { date, name, precision, time } = this.props;
    const dateValue = date ? parse(date.replace(/^@/, ''), 'yyyy-MM-dd', new Date()) : null;
    const timeValue = time ? parse(time.replace(/^T/, ''), 'HH:mm:ss', new Date()) : null;

    return (
      <div className="modifier date-time-precision-modifier">
        <div className="modifier-text">{name}</div>

        <KeyboardDatePicker
          className="field-input"
          format="MM/dd/yyyy"
          inputVariant="outlined"
          KeyboardButtonProps={{ 'aria-label': 'change date' }}
          label="Date"
          margin="normal"
          onChange={newValue => this.handleChange(newValue, 'date')}
          placeholder="mm/dd/yyyy"
          value={dateValue}
        />

        <KeyboardTimePicker
          className="field-input"
          format="HH:mm:ss"
          inputVariant="outlined"
          KeyboardButtonProps={{ 'aria-label': 'change time' }}
          keyboardIcon={<TimeIcon />}
          label="Time"
          margin="normal"
          onChange={newValue => this.handleChange(newValue, 'time')}
          placeholder="hh:mm:ss"
          value={timeValue}
          views={['hours', 'minutes', 'seconds']}
        />

        <div className="field-input field-input-md">
          <Dropdown
            label="Precision"
            onChange={event => this.handleChange(event.target.value, 'precision')}
            options={options}
            value={precision}
          />
        </div>
      </div>
    );
  }
}

DateTimePrecisionModifier.propTypes = {
  index: PropTypes.number.isRequired,
  date: PropTypes.string,
  name: PropTypes.string,
  time: PropTypes.string,
  precision: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
