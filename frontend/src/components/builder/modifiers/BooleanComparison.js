import React, { Component } from 'react';
import Select from 'react-select';

/* eslint-disable jsx-a11y/no-onchange */
export default class BooleanComparison extends Component {
  state = {
    selectedOption: this.props.value,
  }

  handleChange = (selectedOption) => {
    this.props.updateAppliedModifier(this.props.index, { value: selectedOption ? selectedOption.value : null });
  }

  render() {
    return (
      <div className="boolean-comparison">
        <Select
          name="Boolean Compare?"
          aria-label="Boolean Comparison"
          title="Boolean Comparison"
          placeholder="boolean"
          value={this.props.value}
          onChange={this.handleChange}
          options={[
            { value: 'is true', label: 'is true' },
            { value: 'is not true', label: 'is not true' },
            { value: 'is false', label: 'is false' },
            { value: 'is not false', label: 'is not false' }
          ]}
        />
      </div>
    );
  }
}
