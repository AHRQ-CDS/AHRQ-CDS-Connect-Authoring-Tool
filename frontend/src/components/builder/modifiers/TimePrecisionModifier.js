import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { Schedule as TimeIcon } from '@material-ui/icons';
import { format, parse } from 'date-fns';

import { Dropdown } from 'components/elements';

const options = [
  { value: 'hour', label: 'hour' },
  { value: 'minute', label: 'minute' },
  { value: 'second', label: 'second' }
];

export default class TimePrecisionModifier extends Component {
  handleChange = (newValue, inputType) => {
    if (newValue && Number.isNaN(newValue.valueOf())) return;

    const { index, precision, time, updateAppliedModifier } = this.props;
    const newTime = inputType === 'time' ? (newValue ? `T${format(newValue, 'HH:mm:ss')}` : null) : time || null;
    const newPrecision = inputType === 'precision' ? newValue : precision;

    updateAppliedModifier(index, { time: newTime, precision: newPrecision });
  };

  render() {
    const { name, precision, time } = this.props;
    const timeValue = time ? parse(time.replace(/^T/, ''), 'HH:mm:ss', new Date()) : null;

    return (
      <div className="modifier time-precision-modifier">
        <div className="modifier-text">{name}</div>

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

TimePrecisionModifier.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  precision: PropTypes.string,
  time: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
