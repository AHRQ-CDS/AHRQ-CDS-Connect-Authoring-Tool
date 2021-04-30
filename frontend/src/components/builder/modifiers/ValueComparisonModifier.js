import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import clsx from 'clsx';

import { Autocomplete } from '@material-ui/lab';

import UcumField from 'components/builder/fields/UcumField';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const options = [
  { value: '>', label: '>' },
  { value: '>=', label: '>=' },
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' }
];

const ValueComparisonModifier = ({ handleUpdateModifier, values }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <div className={styles.modifier}>
      <Autocomplete
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm)}
        getOptionLabel={option => option?.label || ''}
        id="value-comparison-modifier-minop"
        onChange={(event, option) => handleUpdateModifier({ minOperator: option?.value || '' })}
        options={options}
        renderInput={params => <TextField {...params} label="minOp" variant="outlined" />}
        value={options.find(option => option.value === values.minOperator) || null}
      />

      <TextField
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputXs)}
        label="minValue"
        onChange={event => handleUpdateModifier({ minValue: parseFloat(event.target.value) })}
        type="number"
        value={values.minValue || values.minValue === 0 ? values.minValue : ''}
        variant="outlined"
        id="value-comparison-modifier-minvalue"
      />

      <Autocomplete
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm)}
        getOptionLabel={option => option?.value || ''}
        id="value-comparison-modifier-maxop"
        onChange={(event, option) => handleUpdateModifier({ maxOperator: option?.value || '' })}
        options={options}
        renderInput={params => <TextField {...params} label="maxOp" variant="outlined" />}
        value={options.find(option => option.value === values.maxOperator) || null}
      />

      <TextField
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputXs)}
        label="maxValue"
        onChange={event => handleUpdateModifier({ maxValue: parseFloat(event.target.value) })}
        type="number"
        value={values.maxValue || values.maxValue === 0 ? values.maxValue : ''}
        variant="outlined"
        id="value-comparison-modifier-maxvalue"
      />

      {values.unit != null && (
        <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputLg)}>
          <UcumField
            handleChangeUnit={(event, option) => handleUpdateModifier({ unit: option.value })}
            unit={values.unit}
          />
        </div>
      )}
    </div>
  );
};

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
