import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

import UcumField from 'components/builder/fields/UcumField';

export default class QuantityModifier extends Component {
  handleChange = (newValue, inputType) => {
    const { index, unit, updateAppliedModifier, value } = this.props;
    const newQuantity = inputType === 'quantity' ? parseFloat(newValue) : value || '';
    const newUnit = inputType === 'unit' ? newValue || '' : unit || '';

    updateAppliedModifier(index, { value: newQuantity, unit: newUnit });
  };

  render() {
    const { name, unit, value } = this.props;

    return (
      <div className="modifier quantity-modifier">
        <div className="modifier-text">{name}:</div>

        <TextField
          className="field-input field-input-sm"
          fullWidth
          label="Value"
          onChange={event => this.handleChange(event.target.value, 'quantity')}
          value={(value || value === 0) ? value : ''}
          variant="outlined"
        />

        <div className="field-input field-input-lg">
          <UcumField
            handleChangeUnit={(event, option) => this.handleChange(option?.value, 'unit')}
            unit={unit || ''}
          />
        </div>
      </div>
    );
  }
}

QuantityModifier.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number,
  unit: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
