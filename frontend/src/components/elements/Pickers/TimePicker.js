import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { TimePicker as MuiTimePicker } from '@mui/x-date-pickers';
import { Schedule as TimeIcon } from '@mui/icons-material';

const TimePicker = ({ onChange, value }) => (
  <MuiTimePicker
    inputFormat="HH:mm:ss"
    keyboardIcon={<TimeIcon />}
    label="Time"
    onChange={onChange}
    OpenPickerButtonProps={{ 'aria-label': 'change time', sx: { height: '40px', width: '40px' } }}
    renderInput={props => <TextField {...props} />}
    value={value}
    views={['hours', 'minutes', 'seconds']}
  />
);

TimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date)
};

export default TimePicker;
