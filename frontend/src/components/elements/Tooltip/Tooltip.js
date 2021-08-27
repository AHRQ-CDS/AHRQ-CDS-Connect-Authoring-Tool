import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip as MuiTooltip } from '@material-ui/core';

const ConditionalWrapper = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children);

const Tooltip = ({ children, condition, placement = 'bottom', title = '' }) => (
  <ConditionalWrapper
    condition={condition ?? true}
    wrapper={wrapperChildren => (
      <MuiTooltip arrow placement={placement} title={title}>
        <span>{wrapperChildren}</span>
      </MuiTooltip>
    )}
  >
    {children}
  </ConditionalWrapper>
);

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  condition: PropTypes.bool,
  placement: PropTypes.string,
  title: PropTypes.string
};

export default Tooltip;
