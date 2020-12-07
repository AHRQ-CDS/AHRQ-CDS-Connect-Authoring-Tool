import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { Schedule as TimeIcon } from '@material-ui/icons';
import { format, parse } from 'date-fns';

export default class TimeEditor extends Component {
  handleChange = newValue => {
    if (newValue && Number.isNaN(newValue.valueOf())) return;

    const { name, type, label, updateInstance } = this.props;
    const time = newValue ? `@T${format(newValue, 'HH:mm:ss')}` : null;

    updateInstance({ name, type, label, value: time });
  };

  render() {
    const { label, value } = this.props;
    const time = value ? parse(value.replace(/^@T/, ''), 'HH:mm:ss', new Date()) : null;

    return (
      <div className="editor time-editor">
        <div className="editor-label">{label}</div>

        <div className="editor-inputs">
          <KeyboardTimePicker
            className="field-input"
            format="HH:mm:ss"
            inputVariant="outlined"
            KeyboardButtonProps={{ 'aria-label': 'change time' }}
            keyboardIcon={<TimeIcon />}
            label="Time"
            margin="normal"
            onChange={this.handleChange}
            placeholder="hh:mm:ss"
            value={time}
            views={['hours', 'minutes', 'seconds']}
          />
        </div>
      </div>
    );
  }
}

TimeEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired
};
