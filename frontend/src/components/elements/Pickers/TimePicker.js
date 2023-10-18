import React from 'react';
import PropTypes from 'prop-types';
import { TimePicker as MuiTimePicker } from '@mui/x-date-pickers';
import { Schedule as TimeIcon } from '@mui/icons-material';

const TimePicker = ({ onChange, value }) => (
  <MuiTimePicker
    format="HH:mm:ss"
    keyboardIcon={<TimeIcon />}
    label="Time"
    onChange={onChange}
    slotProps={{
      textField: { variant: 'outlined' },
      openPickerButton: { 'aria-label': 'change time', sx: { height: '40px', width: '40px' } }
    }}
    value={value}
    views={['hours', 'minutes', 'seconds']}
  />
);

TimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date)
};

export default TimePicker;
