import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { ArrowBackIos as ArrowBackIosIcon } from '@material-ui/icons';

// TODO
const ModifierBuilder = ({ handleGoBack }) => {
  return (
    <div>
      <IconButton onClick={handleGoBack}>
        <ArrowBackIosIcon fontSize="small" />
      </IconButton>
      Modifier Builder
    </div>
  );
};

ModifierBuilder.propTypes = {
  handleGoBack: PropTypes.func.isRequired
};

export default ModifierBuilder;
