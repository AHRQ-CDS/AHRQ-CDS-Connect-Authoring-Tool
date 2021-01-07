import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import clsx from 'clsx';

import { useFlexStyles } from 'styles/hooks';
import useStyles from './styles';

const StringField = ({ disabled, id, name, updateInstance, value }) => {
  const styles = useStyles();
  const flexStyles = useFlexStyles();

  return (
    <div className={clsx('string-field', styles.field)}>
      <div className={styles.fieldLabel}>{name}:</div>

      <TextField
        className={clsx(styles.fieldInput, flexStyles.flex1)}
        disabled={disabled}
        fullWidth
        onChange={event => updateInstance({ [id]: event.target.value })}
        value={value || ''}
        variant="outlined"
      />
    </div>
  );
};

StringField.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  updateInstance: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default StringField;
