import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import clsx from 'clsx';

import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const StringModifier = ({ handleUpdateModifier, name, value }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <div className={styles.modifier}>
      <div className={styles.modifierText}>{name}:</div>

      <TextField
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputXl)}
        fullWidth
        label="Value"
        onChange={event => handleUpdateModifier({ value: event.target.value })}
        value={value || ''}
      />
    </div>
  );
};

StringModifier.propTypes = {
  handleUpdateModifier: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string
};

export default StringModifier;
