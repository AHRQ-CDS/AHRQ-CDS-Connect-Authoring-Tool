import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';

/* eslint-disable jsx-a11y/no-onchange */
export default class LookBack extends Component {
  state = {
    selectedOption: this.props.unit,
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.updateAppliedModifier(this.props.index, { unit: selectedOption });
  }

  render() {
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
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
            value={value}
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
