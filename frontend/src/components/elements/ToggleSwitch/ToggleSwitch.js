import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import clsx from 'clsx';

import useStyles from './styles';

const ToggleSwitch = ({ className, labels = ['and', 'or'], onToggle, value }) => {
  const styles = useStyles();

  const handleToggle = labelToSelect => {
    if (value !== labelToSelect) onToggle(labelToSelect);
  };

  return (
    <div className={className || ''}>
      {labels.map(label => (
        <Button
          key={label}
          onClick={() => handleToggle(label)}
          className={clsx(styles.toggleButton, label === value && styles.active)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

ToggleSwitch.propTypes = {
  className: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.string),
  onToggle: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default ToggleSwitch;
