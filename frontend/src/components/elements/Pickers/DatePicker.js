import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardDatePicker } from '@material-ui/pickers';
import clsx from 'clsx';

import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const DatePicker = ({ disabled = false, label = 'Date', onChange, value }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <KeyboardDatePicker
      className={clsx(styles.picker, fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
      disabled={disabled}
      format="MM/dd/yyyy"
      inputVariant="outlined"
      KeyboardButtonProps={{ 'aria-label': 'change date' }}
      label={label}
      margin="normal"
      onChange={onChange}
      placeholder="mm/dd/yyyy"
      value={value}
    />
  );
};

DatePicker.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date)
};

export default DatePicker;
