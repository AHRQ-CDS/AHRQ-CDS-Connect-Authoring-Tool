import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { Schedule as TimeIcon } from '@material-ui/icons';
import { format, parse } from 'date-fns';

export default class DateTimeModifier extends Component {
  handleChange = (newValue, inputType) => {
    if (newValue && Number.isNaN(newValue.valueOf())) return;

    const { date, index, time, updateAppliedModifier } = this.props;
    const newDate = inputType === 'date' ? (newValue ? `@${format(newValue, 'yyyy-MM-dd')}` : null) : date || null;
    const newTime = inputType === 'time' ? (newValue ? `T${format(newValue, 'HH:mm:ss')}` : null) : time || null;

    updateAppliedModifier(index, { date: newDate, time: newTime });
  };

  render() {
    const { date, name, time } = this.props;
    const dateValue = date ? parse(date.replace(/^@/, ''), 'yyyy-MM-dd', new Date()) : null;
    const timeValue = time ? parse(time.replace(/^T/, ''), 'HH:mm:ss', new Date()) : null;

    return (
      <div className="modifier date-time-modifier">
        <div className="modifier-text">{name}:</div>

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
      </div>
    );
  }
}

DateTimeModifier.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.string,
  time: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
