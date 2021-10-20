import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const options = [
  { value: 'years', label: 'Year(s)' },
  { value: 'months', label: 'Month(s)' },
  { value: 'weeks', label: 'Week(s)' },
  { value: 'days', label: 'Day(s)' },
  { value: 'hours', label: 'Hour(s)' },
  { value: 'minutes', label: 'Minute(s)' },
  { value: 'seconds', label: 'Second(s)' }
];

const LookBackModifier = ({ handleUpdateModifier, unit, value }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  const handleSelectUnit = useCallback(
    event => {
      const selectedOption = options.find(option => option.value === event.target.value);
      handleUpdateModifier({ unit: selectedOption ? selectedOption.value : null });
    },
    [handleUpdateModifier]
  );

  return (
    <div className={styles.modifier}>
      <div className={styles.modifierText}>Look back within the last...</div>

      <TextField
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputXs)}
        label="Value"
        onChange={event => {
          const newValue = parseInt(event.target.value, 10);
          handleUpdateModifier({ value: isNaN(newValue) ? null : newValue });
        }}
        type="number"
        value={value == null ? '' : value}
      />

      <Dropdown
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
        label="Unit"
        onChange={handleSelectUnit}
        options={options}
        value={unit}
      />
    </div>
  );
};

LookBackModifier.propTypes = {
  handleUpdateModifier: PropTypes.func.isRequired,
  unit: PropTypes.string,
  value: PropTypes.number
};

export default LookBackModifier;
