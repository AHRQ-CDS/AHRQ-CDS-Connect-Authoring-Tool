import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Stack, TextField } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

const RecommendationField = ({ handleChangeField, handleDeleteField, label, placeholder, value }) => (
  <Stack my={2}>
    <Stack alignItems="center" direction="row" justifyContent="space-between">
      {label}
      <IconButton aria-label="remove field" color="primary" onClick={handleDeleteField}>
        <ClearIcon fontSize="small" />
      </IconButton>
    </Stack>

    <TextField fullWidth hiddenLabel multiline onChange={handleChangeField} placeholder={placeholder} value={value} />
  </Stack>
);

RecommendationField.propTypes = {
  handleChangeField: PropTypes.func.isRequired,
  handleDeleteField: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default RecommendationField;
