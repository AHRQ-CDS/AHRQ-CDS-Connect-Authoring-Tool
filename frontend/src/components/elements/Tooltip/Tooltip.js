import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip as MuiTooltip } from '@mui/material';

const Tooltip = ({ children, enabled = true, ...tooltipProps }) =>
  enabled ? (
    <MuiTooltip arrow {...tooltipProps}>
      <span>{children}</span>
    </MuiTooltip>
  ) : (
    <span>{children}</span>
  );

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  enabled: PropTypes.bool
};

export default Tooltip;
