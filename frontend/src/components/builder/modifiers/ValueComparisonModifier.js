import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, Stack, TextField } from '@mui/material';

import UcumField from 'components/builder/fields/UcumField';

const options = [
  { value: '>', label: '>' },
  { value: '>=', label: '>=' },
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' }
];

const ValueComparisonModifier = ({ handleUpdateModifier, values }) => (
  <Stack direction="row" flexWrap="wrap" py={1} width="100%">
    <Autocomplete
      getOptionLabel={option => option?.label || ''}
      id="value-comparison-modifier-minop"
      onChange={(event, option) => handleUpdateModifier({ minOperator: option?.value || null })}
      options={options}
      renderInput={params => <TextField {...params} label="minOp" />}
      sx={{ marginRight: '10px', width: { xs: '100px', xxl: '150px' } }}
      value={options.find(option => option.value === values.minOperator) || null}
    />

    <TextField
      id="value-comparison-modifier-minvalue"
      label="minValue"
      onChange={event => {
        const newValue = parseFloat(event.target.value);
        handleUpdateModifier({ minValue: isNaN(newValue) ? '' : newValue });
      }}
      type="number"
      value={values.minValue || values.minValue === 0 ? values.minValue : ''}
      sx={{ marginRight: '10px', width: { xs: '100px', xxl: '150px' } }}
    />

    <Autocomplete
      getOptionLabel={option => option?.value || ''}
      id="value-comparison-modifier-maxop"
      onChange={(event, option) => handleUpdateModifier({ maxOperator: option?.value || null })}
      options={options}
      renderInput={params => <TextField {...params} label="maxOp" />}
      sx={{ marginRight: '10px', width: { xs: '100px', xxl: '150px' } }}
      value={options.find(option => option.value === values.maxOperator) || null}
    />

    <TextField
      id="value-comparison-modifier-maxvalue"
      label="maxValue"
      onChange={event => {
        const newValue = parseFloat(event.target.value);
        handleUpdateModifier({ maxValue: isNaN(newValue) ? '' : newValue });
      }}
      sx={{ marginRight: '10px', width: { xs: '100px', xxl: '150px' } }}
      type="number"
      value={values.maxValue || values.maxValue === 0 ? values.maxValue : ''}
    />

    {values.unit != null && (
      <UcumField
        handleChangeUnit={(event, option) => handleUpdateModifier({ unit: option?.value || null })}
        unit={values.unit}
      />
    )}
  </Stack>
);

ValueComparisonModifier.propTypes = {
  handleUpdateModifier: PropTypes.func.isRequired,
  values: PropTypes.shape({
    maxOperator: PropTypes.string,
    maxValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minOperator: PropTypes.string,
    minValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    unit: PropTypes.string
  })
};

export default ValueComparisonModifier;
