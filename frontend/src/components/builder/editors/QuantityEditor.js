import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Remove as DashIcon } from '@material-ui/icons';
import clsx from 'clsx';

import UcumField from 'components/builder/fields/UcumField';
import { isInteger } from 'utils/numbers';
import { useFieldStyles } from 'styles/hooks';

const QuantityEditor = ({ handleUpdateEditor, isInterval, value }) => {
  const [showInputWarning, setShowInputWarning] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const fieldStyles = useFieldStyles();

  const shouldShowInputWarning = quantity => Boolean(quantity && !/^-?\d+(\.\d+)?$/.test(quantity));
  const shouldShowIncompleteWarning = (unit, quantity) => Boolean(unit && !(quantity || quantity === 0));

  const handleChange = (newValue, inputType) => {
    if (newValue && Number.isNaN(newValue.valueOf())) return;
    const unit = inputType === 'unit' ? newValue || '' : value?.unit || '';
    const escapedQuoteUnit = (unit ? unit.replace(/'/g, "\\'") : unit) || '1';

    if (isInterval) {
      const firstQuantity = (inputType === 'firstQuantity' ? newValue : value?.firstQuantity) || null;
      const secondQuantity = (inputType === 'secondQuantity' ? newValue : value?.secondQuantity) || null;
      const firstQuantityStr =
        firstQuantity != null ? `${firstQuantity}${isInteger(firstQuantity) ? '.0' : ''} '${escapedQuoteUnit}'` : null;
      const secondQuantityStr =
        secondQuantity != null
          ? `${secondQuantity}${isInteger(secondQuantity) ? '.0' : ''} '${escapedQuoteUnit}'`
          : null;
      const str = `Interval[${firstQuantityStr},${secondQuantityStr}]`;

      setShowInputWarning(shouldShowInputWarning(firstQuantity) || shouldShowInputWarning(secondQuantity));
      setShowIncompleteWarning(
        shouldShowIncompleteWarning(unit, firstQuantity) && shouldShowIncompleteWarning(unit, secondQuantity)
      );
      handleUpdateEditor(firstQuantity || secondQuantity || unit ? { firstQuantity, secondQuantity, unit, str } : null);
    } else {
      const quantity = inputType === 'quantity' ? newValue : value?.quantity || '';
      const str = `${quantity}${isInteger(quantity) ? '.0' : ''} '${escapedQuoteUnit}'`;

      setShowInputWarning(shouldShowInputWarning(quantity));
      setShowIncompleteWarning(shouldShowIncompleteWarning(unit, quantity));
      handleUpdateEditor(quantity || unit ? { quantity, unit, str } : null);
    }
  };

  return (
    <div className={fieldStyles.fieldInputFullWidth} id="quantity-editor">
      <div className={clsx(fieldStyles.fieldInputGroup, fieldStyles.fieldInputGroupJustifyLeft)}>
        <TextField
          className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm)}
          fullWidth
          label="Value"
          onChange={event => handleChange(event.target.value, isInterval ? 'firstQuantity' : 'quantity')}
          value={isInterval ? value?.firstQuantity || '' : value?.quantity || ''}
          variant="outlined"
        />

        {isInterval && (
          <>
            <DashIcon className={fieldStyles.fieldInput} />

            <TextField
              className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm)}
              fullWidth
              label="Value"
              onChange={event => handleChange(event.target.value, 'secondQuantity')}
              value={value?.secondQuantity || ''}
              variant="outlined"
            />
          </>
        )}

        <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputLg)}>
          <UcumField
            handleChangeUnit={(event, option) => handleChange(option?.value, 'unit')}
            unit={value?.unit || ''}
          />
        </div>
      </div>

      {showInputWarning && (
        <Alert severity="error">Warning: The Quantity's numerical value must be a valid Decimal.</Alert>
      )}

      {showIncompleteWarning && (
        <Alert severity="error">Warning: A Quantity must have at least a numerical value.</Alert>
      )}
    </div>
  );
};

QuantityEditor.propTypes = {
  handleUpdateEditor: PropTypes.func.isRequired,
  isInterval: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default QuantityEditor;
