import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Remove as DashIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { isInteger } from 'utils/numbers';
import { useFieldStyles } from 'styles/hooks';

const NumberEditor = ({
  errors,
  fullWidth = true,
  handleUpdateEditor,
  isDecimal = false,
  isInterval = false,
  label = 'Value',
  value
}) => {
  const fieldStyles = useFieldStyles();

  let firstValue = value || '';
  if (isInterval && isDecimal) firstValue = value?.firstDecimal || '';
  if (isInterval && !isDecimal) firstValue = value?.firstInteger || '';
  if (!isInterval && isDecimal) firstValue = value?.decimal || '';
  const secondValue = isDecimal ? value?.secondDecimal || '' : value?.secondInteger || '';

  const handleChange = (newValue, inputType) => {
    if (newValue && Number.isNaN(newValue.valueOf())) return;
    if (isInterval) {
      if (isDecimal) {
        const firstDecimal = (inputType === 'firstDecimal' ? newValue : value?.firstDecimal) || null;
        const secondDecimal = (inputType === 'secondDecimal' ? newValue : value?.secondDecimal) || null;
        const firstDecimalStr = firstDecimal ? `${firstDecimal}${isInteger(firstDecimal) ? '.0' : ''}` : null;
        const secondDecimalStr = secondDecimal ? `${secondDecimal}${isInteger(secondDecimal) ? '.0' : ''}` : null;
        const str = `Interval[${firstDecimalStr},${secondDecimalStr}]`;
        handleUpdateEditor(firstDecimal || secondDecimal ? { firstDecimal, secondDecimal, str } : null);
      } else {
        const firstInteger = (inputType === 'firstInteger' ? newValue : value?.firstInteger) || null;
        const secondInteger = (inputType === 'secondInteger' ? newValue : value?.secondInteger) || null;
        const str = `Interval[${firstInteger},${secondInteger}]`;
        handleUpdateEditor(firstInteger || secondInteger ? { firstInteger, secondInteger, str } : null);
      }
    } else {
      if (isDecimal) {
        if (newValue) {
          handleUpdateEditor({ decimal: newValue, str: isInteger(newValue) ? `${newValue}.0` : `${newValue}` });
        } else {
          handleUpdateEditor(null);
        }
      } else {
        handleUpdateEditor(newValue || null);
      }
    }
  };

  return (
    <div className={fullWidth ? fieldStyles.fieldInputFullWidth : fieldStyles.fieldInputSm} id="number-editor">
      <div className={clsx(fieldStyles.fieldInputGroup, fieldStyles.fieldInputGroupJustifyLeft)}>
        <TextField
          className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
          fullWidth
          label={label}
          onChange={event =>
            handleChange(event.target.value, isInterval ? (isDecimal ? 'firstDecimal' : 'firstInteger') : null)
          }
          type="number"
          value={firstValue}
          variant="outlined"
        />

        {isInterval && (
          <>
            <DashIcon className={fieldStyles.fieldInput} />

            <div className={clsx(fieldStyles.fieldInputGroup, fieldStyles.fieldInputGroupJustifyLeft)}>
              <TextField
                className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
                fullWidth
                label="Value"
                onChange={event =>
                  handleChange(event.target.value, isInterval ? (isDecimal ? 'secondDecimal' : 'secondInteger') : null)
                }
                type="number"
                value={secondValue}
                variant="outlined"
              />
            </div>
          </>
        )}
      </div>

      {errors?.invalidInput && (
        <Alert severity="error">Warning: The entered value is not a valid {isDecimal ? 'Decimal' : 'Integer'}.</Alert>
      )}
    </div>
  );
};

NumberEditor.propTypes = {
  errors: PropTypes.shape({
    invalidInput: PropTypes.bool
  }),
  fullWidth: PropTypes.bool,
  handleUpdateEditor: PropTypes.func.isRequired,
  isDecimal: PropTypes.bool,
  isInterval: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default NumberEditor;
