import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { Schedule as TimeIcon } from '@material-ui/icons';
import { format, parse } from 'date-fns';

export default class DateTimeEditor extends Component {
  constructor(props) {
    super(props);

    const date = props.value?.date || null;
    const time = props.value?.time || null;

    this.state = {
      showInputWarning: time && !date
    };
  }

  handleChange = (newValue, inputType) => {
    if (newValue && Number.isNaN(newValue.valueOf())) return;

    const { name, type, label, updateInstance, value } = this.props;
    const date = inputType === 'date' ? (newValue ? format(newValue, 'yyyy-MM-dd') : null) : value?.date || null;
    const time = inputType === 'time' ? (newValue ? format(newValue, 'HH:mm:ss') : null) : value?.time || null;
    const str = inputType === 'date' ? `@${date}` : `@${date}T${time}`;

    this.setState({ showInputWarning: time && !date });
    updateInstance({ name, type, label, value: { date, time, str } });
  };

  render() {
    const { label, value } = this.props;
    const { showInputWarning } = this.state;
    const date = value?.date ? parse(value.date, 'yyyy-MM-dd', new Date()) : null;
    const time = value?.time ? parse(value.time, 'HH:mm:ss', new Date()) : null;

    return (
      <div className="editor date-time-editor">
        <div className="editor-label">{label}</div>

        <div className="editor-inputs">
          <KeyboardDatePicker
            className="field-input"
            format="MM/dd/yyyy"
            inputVariant="outlined"
            KeyboardButtonProps={{ 'aria-label': 'change date' }}
            label="Date"
            margin="normal"
            onChange={newValue => this.handleChange(newValue, 'date')}
            placeholder="mm/dd/yyyy"
            value={date}
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
            value={time}
            views={['hours', 'minutes', 'seconds']}
          />
        </div>

        <div className="editor-warnings">
          {showInputWarning && <div className="warning">Warning: A DateTime must have at least a date.</div>}
        </div>
      </div>
    );
  }
}

DateTimeEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
