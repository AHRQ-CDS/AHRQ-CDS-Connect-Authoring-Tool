import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';

/* eslint-disable jsx-a11y/no-onchange */
export default class LookBack extends Component {
  handleChange = (selectedOption) => {
    this.props.updateAppliedModifier(this.props.index, { unit: selectedOption ? selectedOption.value : null });
  }

  render() {
    const valueId = _.uniqueId('value-');
    const unitId = _.uniqueId('unit-');

    return (
      <div className="look-back">
        <label htmlFor={valueId}>
          <input
            id={valueId}
            type="number"
            name="value"
            placeholder="value"
            value={this.props.value || ''}
            onChange={(event) => {
              this.props.updateAppliedModifier(this.props.index, { value: parseInt(event.target.value, 10) });
            }}
          />
        </label>

        <label htmlFor={unitId}>
          <Select
            name="unit"
            aria-label="Unit Select"
            id={unitId}
            value={this.props.unit}
            placeholder="select unit"
            onChange={this.handleChange}
            options={[
              { value: 'years', label: 'Year(s)' },
              { value: 'months', label: 'Month(s)' },
              { value: 'weeks', label: 'Week(s)' },
              { value: 'days', label: 'Day(s)' },
              { value: 'hours', label: 'Hour(s)' },
              { value: 'minutes', label: 'Minute(s)' },
              { value: 'seconds', label: 'Second(s)' }
            ]}
          />
        </label>
      </div>
    );
  }
}
