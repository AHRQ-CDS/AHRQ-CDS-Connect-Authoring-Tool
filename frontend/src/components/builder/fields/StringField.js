import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const StringField = ({ field, handleUpdateField, isDisabled = false }) => (
  <TextField
    disabled={isDisabled}
    fullWidth
    hiddenLabel
    inputProps={{ 'aria-label': field.name }}
    onChange={event => handleUpdateField({ [field.id]: event.target.value })}
    value={field.value || ''}
  />
);

StringField.propTypes = {
  field: PropTypes.object.isRequired,
  handleUpdateField: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
};

export default StringField;
