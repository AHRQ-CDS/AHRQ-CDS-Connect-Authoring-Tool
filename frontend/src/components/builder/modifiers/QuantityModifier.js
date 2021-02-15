import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import clsx from 'clsx';

import UcumField from 'components/builder/fields/UcumField';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const QuantityModifier = ({ handleUpdateModifier, name, unit, value }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  const handleChange = (newValue, inputType) => {
    const newQuantity = inputType === 'quantity' ? parseFloat(newValue) : value || '';
    const newUnit = inputType === 'unit' ? newValue || '' : unit || '';

    handleUpdateModifier({ value: newQuantity, unit: newUnit });
  };

  return (
    <div className={styles.modifier}>
      <div className={styles.modifierText}>{name}:</div>

      <TextField
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm)}
        fullWidth
        label="Value"
        onChange={event => handleChange(event.target.value, 'quantity')}
        value={(value || value === 0) ? value : ''}
        variant="outlined"
        id="quantity-modifier"
      />

      <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputLg)}>
        <UcumField
          handleChangeUnit={(event, option) => handleChange(option?.value, 'unit')}
          unit={unit || ''}
        />
      </div>
    </div>
  );
};

QuantityModifier.propTypes = {
  handleUpdateModifier: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.number
};

export default QuantityModifier;
