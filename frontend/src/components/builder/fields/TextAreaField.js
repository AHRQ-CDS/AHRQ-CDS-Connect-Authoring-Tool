import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const TextAreaField = ({ field, handleUpdateField }) => (
  <TextField
    fullWidth
    hiddenLabel
    multiline
    inputProps={{ 'aria-label': field.name }}
    onChange={event => handleUpdateField({ [field.id]: event.target.value })}
    value={field.value || ''}
  />
);

TextAreaField.propTypes = {
  field: PropTypes.object.isRequired,
  handleUpdateField: PropTypes.func.isRequired
};

export default TextAreaField;
