import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers';

const DatePicker = ({ disabled = false, label = 'Date', onChange, value }) => (
  <MuiDatePicker
    disabled={disabled}
    format="MM/dd/yyyy"
    label={label}
    onChange={onChange}
    slotProps={{
      textField: { variant: 'outlined' },
      openPickerButton: { 'aria-label': 'change date', sx: { height: '40px', width: '40px' } }
    }}
    value={value}
  />
);

DatePicker.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date)
};

export default DatePicker;
