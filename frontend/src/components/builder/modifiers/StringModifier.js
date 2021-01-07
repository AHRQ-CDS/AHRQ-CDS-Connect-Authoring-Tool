import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

export default class StringModifier extends Component {
  handleChange = newValue => {
    const { index, updateAppliedModifier } = this.props;
    updateAppliedModifier(index, { value: newValue });
  };

  render() {
    const { name, value } = this.props;

    return (
      <div className="modifier string-modifier">
        <div className="modifier-text">{name}:</div>

        <TextField
          className="field-input field-input-xl"
          fullWidth
          label="Value"
          onChange={event => this.handleChange(event.target.value)}
          value={value || ''}
          variant="outlined"
        />
      </div>
    );
  }
}

StringModifier.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
