import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { Schedule as TimeIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const TimePicker = ({ onChange, value }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <KeyboardTimePicker
      className={clsx(styles.picker, fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
      format="HH:mm:ss"
      inputVariant="outlined"
      KeyboardButtonProps={{ 'aria-label': 'change time' }}
      keyboardIcon={<TimeIcon />}
      label="Time"
      margin="normal"
      onChange={onChange}
      placeholder="hh:mm:ss"
      value={value}
      views={['hours', 'minutes', 'seconds']}
    />
  );
};

TimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date)
};

export default TimePicker;
