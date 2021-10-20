import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const ElementCardLabel = ({ label, ...props }) => (
  <Box fontSize={{ xs: '14px', xxl: '18px' }} fontWeight="600" mr={2} minWidth="200px" textAlign="right" {...props}>
    {label || <i>unnamed</i>}:
  </Box>
);

ElementCardLabel.propTypes = {
  label: PropTypes.string
};

export default ElementCardLabel;
