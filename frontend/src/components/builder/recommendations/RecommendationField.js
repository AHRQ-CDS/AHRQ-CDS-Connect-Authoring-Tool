import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, TextField } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { useFlexStyles } from 'styles/hooks';

const RecommendationField = ({ handleChangeField, handleDeleteField, label, placeholder, value }) => {
  const flexStyles = useFlexStyles();

  return (
    <>
      <div className={clsx(flexStyles.flex, flexStyles.alignCenter, flexStyles.spaceBetween)}>
        {label}
        <IconButton aria-label="remove field" color="primary" onClick={handleDeleteField}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </div>

      <TextField
        fullWidth
        label={null}
        multiline
        onChange={handleChangeField}
        placeholder={placeholder}
        value={value}
        variant="outlined"
      />
    </>
  );
};

RecommendationField.propTypes = {
  handleChangeField: PropTypes.func.isRequired,
  handleDeleteField: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default RecommendationField;
