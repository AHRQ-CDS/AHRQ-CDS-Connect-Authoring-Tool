import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Divider, MenuItem, TextField } from '@material-ui/core';

const Dropdown = ({
  Footer,
  labelKey = 'label',
  message,
  options,
  renderItem,
  value,
  valueKey = 'value',
  ...props
}) => (
  <TextField fullWidth select value={value || ''} variant="outlined" {...props}>
    {options.map(option => (
      <MenuItem key={option[valueKey]} value={option[valueKey]} disabled={option.isDisabled}>
        {renderItem ? renderItem(option) : option[labelKey]}
      </MenuItem>
    ))}

    {Footer &&
      options.length > 0 && [
        <Divider key={0} />,
        <MenuItem key={1} value="-" disabled>
          {Footer}
        </MenuItem>
      ]}

    {message && (
      <MenuItem value="-" disabled>
        {message}
      </MenuItem>
    )}

    {options.length === 0 && (
      <MenuItem value="-" disabled>
        No options
      </MenuItem>
    )}
  </TextField>
);

Dropdown.propTypes = {
  Footer: PropTypes.element,
  labelKey: PropTypes.string,
  message: PropTypes.element,
  options: PropTypes.array.isRequired,
  renderItem: PropTypes.func,
  value: PropTypes.string,
  valueKey: PropTypes.string
};

export default memo(Dropdown);
