import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

import { Dropdown } from 'components/elements';
import UcumField from 'components/builder/fields/UcumField';

const options = [
  { value: '>', label: '>' },
  { value: '>=', label: '>=' },
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' }
];

const ValueComparisonModifier = ({
  index,
  hasUnit = false,
  maxOperator,
  maxValue,
  minOperator,
  minValue,
  unit,
  updateAppliedModifier
}) => {
  const handleChangeMin = event => {
    const selectedMinOption = options.find(option => option.value === event.target.value);
    const value = selectedMinOption ? selectedMinOption.value : null;
    updateAppliedModifier(index, { minOperator: value });
  };

  const handleChangeMax = event => {
    const selectedMaxOption = options.find(option => option.value === event.target.value);
    const value = selectedMaxOption ? selectedMaxOption.value : null;
    updateAppliedModifier(index, { maxOperator: value });
  };

  const handleChangeUnit = (event, option) => {
    updateAppliedModifier(index, { unit: option?.value || '' });
  };

  return (
    <div className="modifier">
      <Dropdown
        className="field-input flex-1 field-input-sm"
        label="minOp"
        onChange={handleChangeMin}
        options={options}
        value={minOperator}
        id={`value-comparison-modifier-minop-${index}`}
      />

      <TextField
        className="field-input flex-1 field-input-sm"
        label="minValue"
        onChange={event => updateAppliedModifier(index, { minValue: parseFloat(event.target.value) })}
        type="number"
        value={minValue || minValue === 0 ? minValue : ''}
        variant="outlined"
        id={`value-comparison-modifier-minvalue-${index}`}
      />

      <Dropdown
        className="field-input flex-1 field-input-sm"
        label="maxOp"
        onChange={handleChangeMax}
        options={options}
        value={maxOperator}
        id={`value-comparison-modifier-maxop-${index}`}
      />

      <TextField
        className="field-input flex-1 field-input-sm"
        label="maxValue"
        onChange={event => updateAppliedModifier(index, { maxValue: parseFloat(event.target.value) })}
        type="number"
        value={maxValue || maxValue === 0 ? maxValue : ''}
        variant="outlined"
        id={`value-comparison-modifier-maxvalue-${index}`}
      />

      {hasUnit &&
        <div className="field-input flex-2 field-input-md">
          <UcumField handleChangeUnit={handleChangeUnit} unit={unit} />
        </div>
      }
    </div>
  );
};

ValueComparisonModifier.propTypes = {
  hasUnit: PropTypes.bool,
  index: PropTypes.number.isRequired,
  maxOperator: PropTypes.string,
  maxValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minOperator: PropTypes.string,
  minValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  unit: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};

export default ValueComparisonModifier;
