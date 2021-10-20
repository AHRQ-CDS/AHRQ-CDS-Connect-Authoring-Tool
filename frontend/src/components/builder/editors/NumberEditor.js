import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Stack, TextField } from '@mui/material';
import { Remove as DashIcon } from '@mui/icons-material';

import { isInteger } from 'utils/numbers';

const NumberEditor = ({
  errors,
  handleUpdateEditor,
  isDecimal = false,
  isInterval = false,
  label = 'Value',
  value
}) => {
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
    <Stack>
      <Stack alignItems="center" direction="row">
        <TextField
          fullWidth
          label={label}
          onChange={event =>
            handleChange(event.target.value, isInterval ? (isDecimal ? 'firstDecimal' : 'firstInteger') : null)
          }
          sx={{ width: { xs: '150px', xxl: '200px' } }}
          type="number"
          value={firstValue}
        />

        {isInterval && (
          <>
            <DashIcon sx={{ margin: '0 10px' }} />

            <TextField
              fullWidth
              label="Value"
              onChange={event =>
                handleChange(event.target.value, isInterval ? (isDecimal ? 'secondDecimal' : 'secondInteger') : null)
              }
              sx={{ width: { xs: '150px', xxl: '200px' } }}
              type="number"
              value={secondValue}
            />
          </>
        )}
      </Stack>

      {errors?.invalidInput && (
        <Alert severity="error">Warning: The entered value is not a valid {isDecimal ? 'Decimal' : 'Integer'}.</Alert>
      )}
    </Stack>
  );
};

NumberEditor.propTypes = {
  errors: PropTypes.shape({
    invalidInput: PropTypes.bool
  }),
  handleUpdateEditor: PropTypes.func.isRequired,
  isDecimal: PropTypes.bool,
  isInterval: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default NumberEditor;
