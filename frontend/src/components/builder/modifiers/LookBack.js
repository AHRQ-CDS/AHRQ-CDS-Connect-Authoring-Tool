import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

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

/* eslint-disable jsx-a11y/no-onchange */
export default class LookBack extends Component {
  handleChange = event => {
    const { index, updateAppliedModifier } = this.props;
    const selectedOption = options.find(option => option.value === event.target.value);
    updateAppliedModifier(index, { unit: selectedOption ? selectedOption.value : null });
  }

  render() {
    const { index, unit, updateAppliedModifier, value } = this.props;
    const valueId = _.uniqueId('value-');
    const unitId = _.uniqueId('unit-');

    return (
      <div className="look-back">
        <label className="look-back" htmlFor={valueId}>
          Look back within the last...
        </label>

        <div className="look-back-group">
          <input
            id={valueId}
            type="number"
            name="value"
            placeholder="value"
            aria-label="Look back value"
            value={value || ''}
            onChange={(event) => {
              updateAppliedModifier(index, { value: parseInt(event.target.value, 10) });
            }}
          />

          <label htmlFor={unitId} className="modifier-dropdown">
            <Dropdown
              id={unitId}
              label="Unit"
              onChange={this.handleChange}
              options={options}
              value={unit}
            />
          </label>
        </div>
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
