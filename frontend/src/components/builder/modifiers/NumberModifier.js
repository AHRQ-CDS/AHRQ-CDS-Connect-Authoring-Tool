import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

export default class NumberModifier extends Component {
  handleChange = newValue => {
    const { index, updateAppliedModifier } = this.props;
    updateAppliedModifier(index, { value: parseFloat(newValue) });
  };

  render() {
    const { name, value } = this.props;

    return (
      <div className="modifier number-modifier">
        <div className="modifier-text">{name}:</div>

        <TextField
          className="field-input field-input-sm"
          fullWidth
          label="Value"
          onChange={event => this.handleChange(event.target.value)}
          value={(value || value === 0) ? value : ''}
          variant="outlined"
        />
      </div>
    );
  }
}

NumberModifier.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number,
  updateAppliedModifier: PropTypes.func.isRequired
};
