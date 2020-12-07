import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

import { Dropdown } from 'components/elements';

const options = [
  { value: 'years', label: 'Year(s)' },
  { value: 'months', label: 'Month(s)' },
  { value: 'weeks', label: 'Week(s)' },
  { value: 'days', label: 'Day(s)' },
  { value: 'hours', label: 'Hour(s)' },
  { value: 'minutes', label: 'Minute(s)' },
  { value: 'seconds', label: 'Second(s)' }
];

export default class LookBack extends Component {
  handleChange = event => {
    const { index, updateAppliedModifier } = this.props;
    const selectedOption = options.find(option => option.value === event.target.value);
    updateAppliedModifier(index, { unit: selectedOption ? selectedOption.value : null });
  }

  render() {
    const { index, unit, updateAppliedModifier, value } = this.props;

    return (
      <div className="modifier">
        <div className="modifier-text">Look back within the last...</div>

        <TextField
          className="field-input flex-1 field-input-sm"
          label="Value"
          onChange={event => updateAppliedModifier(index, { value: parseInt(event.target.value, 10) })}
          type="number"
          value={value || ''}
          variant="outlined"
        />

        <Dropdown
          className="field-input flex-2 field-input-md"
          label="Unit"
          onChange={this.handleChange}
          options={options}
          value={unit}
        />
      </div>
    );
  }
}

LookBack.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number,
  unit: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
