import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
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

  const handleChange = (event, key) => {
    const selectedOption = options.find(option => option.value === event.target.value);
    const value = selectedOption ? selectedOption.value : null;
    handleUpdateModifier({ [key]: value });
  };

  return (
    <div className={styles.modifier}>
      <Dropdown
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm)}
        label="minOp"
        onChange={event => handleChange(event, 'minOperator')}
        options={options}
        value={values.minOperator}
        id="value-comparison-modifier-minop"
      />

      <TextField
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm)}
        label="minValue"
        onChange={event => handleUpdateModifier({ minValue: parseFloat(event.target.value) })}
        type="number"
        value={values.minValue || values.minValue === 0 ? values.minValue : ''}
        variant="outlined"
        id="value-comparison-modifier-minvalue"
      />

      <Dropdown
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm)}
        label="maxOp"
        onChange={event => handleChange(event, 'maxOperator')}
        options={options}
        value={values.maxOperator}
        id="value-comparison-modifier-maxop"
      />

      <TextField
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm)}
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
