import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const StringEditor = ({ handleUpdateEditor, value }) => (
  <TextField
    fullWidth
    label="Value"
    onChange={event => handleUpdateEditor(event.target.value ? `'${event.target.value}'` : null)}
    sx={{ width: { xs: '400px', xxl: '600px' } }}
    value={value ? value.replace(/'/g, '') : ''}
  />
);

StringEditor.propTypes = {
  handleUpdateEditor: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default StringEditor;
